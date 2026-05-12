"""
Форум: категории, темы, ответы — полный CRUD.
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
        "SELECT u.id, u.username, u.avatar_url, u.reputation, u.is_vip, u.is_admin "
        "FROM sessions s JOIN users u ON s.user_id = u.id "
        "WHERE s.id = %s AND s.expires_at > NOW()", (session_id,)
    )
    row = cur.fetchone()
    return {'id': row[0], 'username': row[1], 'avatar_url': row[2], 'reputation': row[3], 'is_vip': row[4], 'is_admin': row[5]} if row else None

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

    # GET /categories
    if method == 'GET' and '/categories' in path:
        cur.execute(
            "SELECT fc.id, fc.name, fc.description, fc.icon, "
            "(SELECT COUNT(*) FROM forum_topics ft WHERE ft.category_id = fc.id) as topics_count "
            "FROM forum_categories fc ORDER BY fc.order_num"
        )
        cats = [{'id': r[0], 'name': r[1], 'description': r[2], 'icon': r[3], 'topics_count': r[4]} for r in cur.fetchall()]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'categories': cats})}

    # GET /topics
    if method == 'GET' and '/topics' in path:
        cat_id = params.get('category_id')
        search = params.get('search', '')
        limit = min(int(params.get('limit', 20)), 50)
        offset = int(params.get('offset', 0))

        where = []
        vals = []
        if cat_id:
            where.append("ft.category_id = %s")
            vals.append(cat_id)
        if search:
            where.append("(ft.title ILIKE %s OR ft.body ILIKE %s)")
            vals.extend([f'%{search}%', f'%{search}%'])

        w = ('WHERE ' + ' AND '.join(where)) if where else ''
        cur.execute(f"""
            SELECT ft.id, ft.title, ft.body, ft.is_pinned, ft.is_locked,
                   ft.views, ft.replies_count, ft.last_reply_at, ft.created_at,
                   u.id, u.username, u.avatar_url, u.reputation, u.is_vip,
                   ft.category_id, fc.name
            FROM forum_topics ft
            LEFT JOIN users u ON ft.author_id = u.id
            LEFT JOIN forum_categories fc ON ft.category_id = fc.id
            {w}
            ORDER BY ft.is_pinned DESC, ft.last_reply_at DESC
            LIMIT %s OFFSET %s
        """, vals + [limit, offset])
        rows = cur.fetchall()

        cur.execute(f"SELECT COUNT(*) FROM forum_topics ft {w}", vals)
        total = cur.fetchone()[0]

        topics = [{
            'id': r[0], 'title': r[1], 'body': r[2][:200] + '...' if len(r[2]) > 200 else r[2],
            'is_pinned': r[3], 'is_locked': r[4], 'views': r[5],
            'replies_count': r[6], 'last_reply_at': str(r[7]), 'created_at': str(r[8]),
            'author': {'id': r[9], 'username': r[10], 'avatar_url': r[11], 'reputation': r[12], 'is_vip': r[13]},
            'category_id': r[14], 'category_name': r[15]
        } for r in rows]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'topics': topics, 'total': total})}

    # GET /topic?id=
    if method == 'GET' and path.endswith('/topic'):
        tid = params.get('id')
        cur.execute(
            "SELECT ft.id, ft.title, ft.body, ft.is_pinned, ft.is_locked, ft.views, ft.replies_count, ft.created_at, "
            "u.id, u.username, u.avatar_url, u.reputation, u.is_vip, ft.category_id, fc.name "
            "FROM forum_topics ft LEFT JOIN users u ON ft.author_id = u.id "
            "LEFT JOIN forum_categories fc ON ft.category_id = fc.id WHERE ft.id = %s", (tid,)
        )
        row = cur.fetchone()
        if not row:
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Тема не найдена'})}

        cur.execute("UPDATE forum_topics SET views = views + 1 WHERE id = %s", (tid,))
        conn.commit()

        topic = {
            'id': row[0], 'title': row[1], 'body': row[2],
            'is_pinned': row[3], 'is_locked': row[4], 'views': row[5] + 1,
            'replies_count': row[6], 'created_at': str(row[7]),
            'author': {'id': row[8], 'username': row[9], 'avatar_url': row[10], 'reputation': row[11], 'is_vip': row[12]},
            'category_id': row[13], 'category_name': row[14]
        }

        # Ответы
        cur.execute(
            "SELECT fr.id, fr.body, fr.is_best_answer, fr.created_at, "
            "u.id, u.username, u.avatar_url, u.reputation, u.is_vip "
            "FROM forum_replies fr LEFT JOIN users u ON fr.author_id = u.id "
            "WHERE fr.topic_id = %s ORDER BY fr.created_at", (tid,)
        )
        topic['replies'] = [{
            'id': r[0], 'body': r[1], 'is_best_answer': r[2], 'created_at': str(r[3]),
            'author': {'id': r[4], 'username': r[5], 'avatar_url': r[6], 'reputation': r[7], 'is_vip': r[8]}
        } for r in cur.fetchall()]

        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(topic)}

    # POST /topics (создать тему)
    if method == 'POST' and '/topics' in path:
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужна авторизация'})}
        body = json.loads(event.get('body') or '{}')
        title = (body.get('title') or '').strip()
        text = (body.get('body') or '').strip()
        cat_id = body.get('category_id')
        if not title or not text or not cat_id:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}

        cur.execute(
            "INSERT INTO forum_topics (category_id, author_id, title, body) VALUES (%s, %s, %s, %s) RETURNING id",
            (cat_id, user['id'], title, text)
        )
        new_id = cur.fetchone()[0]

        # Достижение "Первый пост"
        cur.execute("SELECT COUNT(*) FROM forum_topics WHERE author_id = %s", (user['id'],))
        count = cur.fetchone()[0]
        if count == 1:
            cur.execute("SELECT id FROM achievements WHERE code = 'first_post'")
            ach = cur.fetchone()
            if ach:
                cur.execute("INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (user['id'], ach[0]))
                cur.execute("UPDATE users SET reputation = reputation + 10 WHERE id = %s", (user['id'],))

        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': new_id})}

    # POST /replies (ответить)
    if method == 'POST' and '/replies' in path:
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужна авторизация'})}
        body = json.loads(event.get('body') or '{}')
        topic_id = body.get('topic_id')
        text = (body.get('body') or '').strip()
        if not topic_id or not text:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}

        # Проверить не заблокирована ли тема
        cur.execute("SELECT is_locked FROM forum_topics WHERE id = %s", (topic_id,))
        row = cur.fetchone()
        if not row:
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Тема не найдена'})}
        if row[0]:
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Тема закрыта'})}

        cur.execute(
            "INSERT INTO forum_replies (topic_id, author_id, body) VALUES (%s, %s, %s) RETURNING id",
            (topic_id, user['id'], text)
        )
        new_id = cur.fetchone()[0]
        cur.execute(
            "UPDATE forum_topics SET replies_count = replies_count + 1, last_reply_at = NOW() WHERE id = %s",
            (topic_id,)
        )

        # Достижения за активность
        cur.execute("SELECT COUNT(*) FROM forum_replies WHERE author_id = %s", (user['id'],))
        cnt = cur.fetchone()[0]
        if cnt == 20:
            cur.execute("SELECT id FROM achievements WHERE code = 'helper'")
            ach = cur.fetchone()
            if ach:
                cur.execute("INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (user['id'], ach[0]))
                cur.execute("UPDATE users SET reputation = reputation + 40 WHERE id = %s", (user['id'],))

        cur.execute("SELECT COUNT(*) FROM forum_topics WHERE author_id = %s", (user['id'],))
        topics_cnt = cur.fetchone()[0]
        if topics_cnt >= 10:
            cur.execute("SELECT id FROM achievements WHERE code = 'active'")
            ach = cur.fetchone()
            if ach:
                cur.execute("INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (user['id'], ach[0]))

        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': new_id})}

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}