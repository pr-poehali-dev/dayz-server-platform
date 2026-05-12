"""
Скрипты и моды: список, детали, добавление, скачивание, оценка.
"""
import json
import os
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

def get_user_by_session(conn, session_id: str):
    if not session_id:
        return None
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.username, u.is_vip, u.is_admin FROM sessions s JOIN users u ON s.user_id = u.id "
        "WHERE s.id = %s AND s.expires_at > NOW()", (session_id,)
    )
    row = cur.fetchone()
    return {'id': row[0], 'username': row[1], 'is_vip': row[2], 'is_admin': row[3]} if row else None

def row_to_script(row):
    return {
        'id': row[0], 'author_id': row[1], 'author_username': row[2],
        'title': row[3], 'description': row[4], 'category': row[5],
        'type': row[6], 'version': row[7], 'is_vip_only': row[8],
        'downloads': row[9],
        'rating': round(row[10] / row[11], 1) if row[11] else 0,
        'rating_count': row[11],
        'tags': row[12] or [],
        'created_at': str(row[13])
    }

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers', {}) or {}
    session_id = headers.get('X-Session-Id', '')
    params = event.get('queryStringParameters') or {}
    path = params.get('__path', path)

    conn = get_conn()
    cur = conn.cursor()
    user = get_user_by_session(conn, session_id)

    # GET /list
    if method == 'GET' and '/list' in path:
        category = params.get('category', '')
        type_ = params.get('type', '')
        search = params.get('search', '')
        sort = params.get('sort', 'created_at')
        limit = min(int(params.get('limit', 20)), 50)
        offset = int(params.get('offset', 0))

        where = ["s.is_approved = TRUE"]
        vals = []
        if category:
            where.append("s.category = %s")
            vals.append(category)
        if type_:
            where.append("s.type = %s")
            vals.append(type_)
        if search:
            where.append("(s.title ILIKE %s OR s.description ILIKE %s)")
            vals.extend([f'%{search}%', f'%{search}%'])

        order = 'downloads' if sort == 'popular' else 'created_at'
        q = f"""
            SELECT s.id, s.author_id, u.username, s.title, s.description,
                   s.category, s.type, s.version, s.is_vip_only,
                   s.downloads, s.rating_sum, s.rating_count, s.tags, s.created_at
            FROM scripts s LEFT JOIN users u ON s.author_id = u.id
            WHERE {' AND '.join(where)}
            ORDER BY s.{order} DESC LIMIT %s OFFSET %s
        """
        vals.extend([limit, offset])
        cur.execute(q, vals)
        rows = cur.fetchall()

        cur.execute(f"SELECT COUNT(*) FROM scripts s WHERE {' AND '.join(where)}", vals[:-2])
        total = cur.fetchone()[0]

        scripts = []
        for row in rows:
            s = row_to_script(row)
            if s['is_vip_only'] and (not user or not user['is_vip']):
                s['content'] = None
                s['locked'] = True
            scripts.append(s)

        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'scripts': scripts, 'total': total})}

    # GET /detail?id=
    if method == 'GET' and '/detail' in path:
        sid = params.get('id')
        cur.execute(
            "SELECT s.id, s.author_id, u.username, s.title, s.description, "
            "s.category, s.type, s.version, s.is_vip_only, s.downloads, "
            "s.rating_sum, s.rating_count, s.tags, s.created_at, s.content, s.file_url "
            "FROM scripts s LEFT JOIN users u ON s.author_id = u.id WHERE s.id = %s",
            (sid,)
        )
        row = cur.fetchone()
        if not row:
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Не найдено'})}
        script = row_to_script(row)
        script['content'] = row[14]
        script['file_url'] = row[15]
        if script['is_vip_only'] and (not user or not user['is_vip']):
            script['content'] = None
            script['file_url'] = None
            script['locked'] = True
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(script)}

    # POST /download?id=
    if method == 'POST' and '/download' in path:
        sid = params.get('id')
        cur.execute("UPDATE scripts SET downloads = downloads + 1 WHERE id = %s RETURNING downloads", (sid,))
        row = cur.fetchone()
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'downloads': row[0] if row else 0})}

    # POST /rate
    if method == 'POST' and '/rate' in path:
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужна авторизация'})}
        body = json.loads(event.get('body') or '{}')
        script_id = body.get('script_id')
        rating = int(body.get('rating', 5))

        cur.execute(
            "INSERT INTO script_ratings (script_id, user_id, rating) VALUES (%s, %s, %s) "
            "ON CONFLICT (script_id, user_id) DO UPDATE SET rating = EXCLUDED.rating",
            (script_id, user['id'], rating)
        )
        cur.execute(
            "UPDATE scripts SET rating_sum = (SELECT SUM(rating) FROM script_ratings WHERE script_id = %s), "
            "rating_count = (SELECT COUNT(*) FROM script_ratings WHERE script_id = %s) WHERE id = %s",
            (script_id, script_id, script_id)
        )
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    # POST /create
    if method == 'POST' and '/create' in path:
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужна авторизация'})}
        body = json.loads(event.get('body') or '{}')
        title = (body.get('title') or '').strip()
        if not title:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите название'})}

        cur.execute(
            "INSERT INTO scripts (author_id, title, description, content, category, type, version, is_vip_only, tags) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (user['id'], title, body.get('description', ''), body.get('content', ''),
             body.get('category', 'other'), body.get('type', 'script'),
             body.get('version', '1.0.0'), body.get('is_vip_only', False),
             body.get('tags', []))
        )
        new_id = cur.fetchone()[0]

        # Достижение "Скриптер"
        cur.execute("SELECT COUNT(*) FROM scripts WHERE author_id = %s", (user['id'],))
        count = cur.fetchone()[0]
        if count == 1:
            cur.execute("SELECT id FROM achievements WHERE code = 'scripter'")
            ach = cur.fetchone()
            if ach:
                cur.execute(
                    "INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (user['id'], ach[0])
                )
                cur.execute("UPDATE users SET reputation = reputation + 30 WHERE id = %s", (user['id'],))
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': new_id})}

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}