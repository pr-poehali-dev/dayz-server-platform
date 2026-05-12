"""
Аутентификация: регистрация, логин, логаут, получение профиля.
"""
import json
import os
import hashlib
import secrets
import psycopg2

DB = os.environ['DATABASE_URL']
SCHEMA = 't_p77058165_dayz_server_platform'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

def get_conn():
    conn = psycopg2.connect(DB, options=f'-c search_path={SCHEMA}')
    return conn

def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

def get_user_by_session(conn, session_id: str):
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.username, u.email, u.avatar_url, u.bio, u.is_vip, u.is_admin, u.reputation, u.created_at "
        "FROM sessions s JOIN users u ON s.user_id = u.id "
        "WHERE s.id = %s AND s.expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    if not row:
        return None
    return {
        'id': row[0], 'username': row[1], 'email': row[2],
        'avatar_url': row[3], 'bio': row[4], 'is_vip': row[5],
        'is_admin': row[6], 'reputation': row[7],
        'created_at': str(row[8])
    }

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    _params = event.get('queryStringParameters') or {}
    path = _params.get('__path', event.get('path', '/'))
    headers = event.get('headers', {}) or {}
    session_id = headers.get('X-Session-Id', '')

    conn = get_conn()
    cur = conn.cursor()

    # POST /register
    if method == 'POST' and '/register' in path:
        body = json.loads(event.get('body') or '{}')
        username = (body.get('username') or '').strip()
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''

        if not username or not email or not password:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}
        if len(username) < 3:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Имя минимум 3 символа'})}
        if len(password) < 6:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

        cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        if cur.fetchone():
            return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Пользователь уже существует'})}

        ph = hash_password(password)
        cur.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (username, email, ph)
        )
        user_id = cur.fetchone()[0]

        # Достижение "Новичок"
        cur.execute("SELECT id FROM achievements WHERE code = 'newcomer'")
        ach = cur.fetchone()
        if ach:
            cur.execute(
                "INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (user_id, ach[0])
            )
            cur.execute("UPDATE users SET reputation = reputation + 5 WHERE id = %s", (user_id,))

        sid = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (id, user_id) VALUES (%s, %s)", (sid, user_id))
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'session_id': sid, 'user_id': user_id, 'username': username})}

    # POST /login
    if method == 'POST' and '/login' in path:
        body = json.loads(event.get('body') or '{}')
        login = (body.get('login') or '').strip()
        password = body.get('password') or ''
        ph = hash_password(password)

        cur.execute(
            "SELECT id, username, email FROM users WHERE (username = %s OR email = %s) AND password_hash = %s",
            (login, login.lower(), ph)
        )
        row = cur.fetchone()
        if not row:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        sid = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (id, user_id) VALUES (%s, %s)", (sid, row[0]))
        cur.execute("UPDATE users SET last_seen_at = NOW() WHERE id = %s", (row[0],))
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'session_id': sid, 'user_id': row[0], 'username': row[1]})}

    # POST /logout
    if method == 'POST' and '/logout' in path:
        if session_id:
            cur.execute("UPDATE sessions SET expires_at = NOW() WHERE id = %s", (session_id,))
            conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    # GET /me
    if method == 'GET' and '/me' in path:
        user = get_user_by_session(conn, session_id)
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        # Достижения
        cur.execute(
            "SELECT a.code, a.name, a.icon, a.points, ua.earned_at "
            "FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id "
            "WHERE ua.user_id = %s",
            (user['id'],)
        )
        user['achievements'] = [{'code': r[0], 'name': r[1], 'icon': r[2], 'points': r[3], 'earned_at': str(r[4])} for r in cur.fetchall()]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(user)}

    # PUT /profile
    if method == 'PUT' and '/profile' in path:
        user = get_user_by_session(conn, session_id)
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
        body = json.loads(event.get('body') or '{}')
        bio = body.get('bio', user['bio'])
        avatar_url = body.get('avatar_url', user['avatar_url'])
        cur.execute("UPDATE users SET bio = %s, avatar_url = %s WHERE id = %s", (bio, avatar_url, user['id']))
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}