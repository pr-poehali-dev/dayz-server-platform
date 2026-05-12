"""
Личные сообщения и уведомления пользователей.
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

def get_user(conn, session_id):
    if not session_id:
        return None
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.username FROM sessions s JOIN users u ON s.user_id = u.id "
        "WHERE s.id = %s AND s.expires_at > NOW()", (session_id,)
    )
    row = cur.fetchone()
    return {'id': row[0], 'username': row[1]} if row else None

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
    user = get_user(conn, session_id)

    if not user:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужна авторизация'})}

    # GET /inbox
    if method == 'GET' and '/inbox' in path:
        cur.execute(
            "SELECT m.id, m.subject, m.body, m.is_read, m.created_at, "
            "u.id, u.username "
            "FROM messages m LEFT JOIN users u ON m.sender_id = u.id "
            "WHERE m.receiver_id = %s ORDER BY m.created_at DESC LIMIT 50",
            (user['id'],)
        )
        msgs = [{
            'id': r[0], 'subject': r[1], 'body': r[2], 'is_read': r[3], 'created_at': str(r[4]),
            'sender': {'id': r[5], 'username': r[6]}
        } for r in cur.fetchall()]

        cur.execute("SELECT COUNT(*) FROM messages WHERE receiver_id = %s AND is_read = FALSE", (user['id'],))
        unread = cur.fetchone()[0]

        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'messages': msgs, 'unread': unread})}

    # GET /sent
    if method == 'GET' and '/sent' in path:
        cur.execute(
            "SELECT m.id, m.subject, m.body, m.is_read, m.created_at, "
            "u.id, u.username "
            "FROM messages m LEFT JOIN users u ON m.receiver_id = u.id "
            "WHERE m.sender_id = %s ORDER BY m.created_at DESC LIMIT 50",
            (user['id'],)
        )
        msgs = [{
            'id': r[0], 'subject': r[1], 'body': r[2], 'is_read': r[3], 'created_at': str(r[4]),
            'receiver': {'id': r[5], 'username': r[6]}
        } for r in cur.fetchall()]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'messages': msgs})}

    # POST /send
    if method == 'POST' and '/send' in path:
        body = json.loads(event.get('body') or '{}')
        to_username = (body.get('to') or '').strip()
        subject = (body.get('subject') or '').strip()
        text = (body.get('body') or '').strip()

        if not to_username or not text:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните поля'})}

        cur.execute("SELECT id FROM users WHERE username = %s", (to_username,))
        row = cur.fetchone()
        if not row:
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Пользователь не найден'})}

        receiver_id = row[0]
        if receiver_id == user['id']:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нельзя писать самому себе'})}

        cur.execute(
            "INSERT INTO messages (sender_id, receiver_id, subject, body) VALUES (%s, %s, %s, %s) RETURNING id",
            (user['id'], receiver_id, subject or 'Без темы', text)
        )
        new_id = cur.fetchone()[0]

        # Уведомление получателю
        cur.execute(
            "INSERT INTO notifications (user_id, type, title, body, link) VALUES (%s, %s, %s, %s, %s)",
            (receiver_id, 'message', f'Новое сообщение от {user["username"]}', text[:100], '/messages')
        )
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': new_id})}

    # POST /read?id=
    if method == 'POST' and '/read' in path:
        msg_id = params.get('id')
        cur.execute(
            "UPDATE messages SET is_read = TRUE WHERE id = %s AND receiver_id = %s",
            (msg_id, user['id'])
        )
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    # GET /notifications
    if method == 'GET' and '/notifications' in path:
        cur.execute(
            "SELECT id, type, title, body, link, is_read, created_at FROM notifications "
            "WHERE user_id = %s ORDER BY created_at DESC LIMIT 30",
            (user['id'],)
        )
        notifs = [{'id': r[0], 'type': r[1], 'title': r[2], 'body': r[3], 'link': r[4], 'is_read': r[5], 'created_at': str(r[6])} for r in cur.fetchall()]

        cur.execute("SELECT COUNT(*) FROM notifications WHERE user_id = %s AND is_read = FALSE", (user['id'],))
        unread = cur.fetchone()[0]

        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'notifications': notifs, 'unread': unread})}

    # POST /notifications/read
    if method == 'POST' and '/notifications/read' in path:
        cur.execute("UPDATE notifications SET is_read = TRUE WHERE user_id = %s", (user['id'],))
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}