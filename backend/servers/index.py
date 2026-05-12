"""
Серверы DayZ: топ, добавление, голосование, реклама.
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
        "SELECT u.id, u.username, u.is_vip FROM sessions s JOIN users u ON s.user_id = u.id "
        "WHERE s.id = %s AND s.expires_at > NOW()", (session_id,)
    )
    row = cur.fetchone()
    return {'id': row[0], 'username': row[1], 'is_vip': row[2]} if row else None

def row_to_server(row):
    return {
        'id': row[0], 'name': row[1], 'description': row[2],
        'ip': row[3], 'port': row[4], 'map': row[5],
        'max_players': row[6], 'current_players': row[7],
        'is_modded': row[8], 'is_verified': row[9],
        'logo_url': row[10], 'website_url': row[11], 'discord_url': row[12],
        'ad_boost': row[13], 'votes': row[14],
        'owner_username': row[15], 'has_ad': row[16] is not None,
        'created_at': str(row[17])
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
    user = get_user(conn, session_id)

    # GET /list
    if method == 'GET' and '/list' in path:
        map_filter = params.get('map', '')
        modded = params.get('modded', '')
        limit = min(int(params.get('limit', 20)), 50)
        offset = int(params.get('offset', 0))

        where = []
        vals = []
        if map_filter:
            where.append("s.map = %s")
            vals.append(map_filter)
        if modded == '1':
            where.append("s.is_modded = TRUE")

        w = ('WHERE ' + ' AND '.join(where)) if where else ''
        cur.execute(f"""
            SELECT s.id, s.name, s.description, s.ip, s.port, s.map,
                   s.max_players, s.current_players, s.is_modded, s.is_verified,
                   s.logo_url, s.website_url, s.discord_url, s.ad_boost, s.votes,
                   u.username, s.ad_expires_at, s.created_at
            FROM servers s LEFT JOIN users u ON s.owner_id = u.id
            {w}
            ORDER BY s.ad_boost DESC, s.votes DESC, s.current_players DESC
            LIMIT %s OFFSET %s
        """, vals + [limit, offset])
        rows = cur.fetchall()

        cur.execute(f"SELECT COUNT(*) FROM servers s {w}", vals)
        total = cur.fetchone()[0]

        # Голоса пользователя
        user_votes = set()
        if user:
            cur.execute("SELECT server_id FROM server_votes WHERE user_id = %s", (user['id'],))
            user_votes = {r[0] for r in cur.fetchall()}

        servers = []
        for row in rows:
            s = row_to_server(row)
            s['user_voted'] = s['id'] in user_votes
            servers.append(s)

        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'servers': servers, 'total': total})}

    # POST /add — добавить сервер
    if method == 'POST' and '/add' in path:
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужна авторизация'})}
        body = json.loads(event.get('body') or '{}')
        name = (body.get('name') or '').strip()
        if not name:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите название сервера'})}

        cur.execute(
            "INSERT INTO servers (owner_id, name, description, ip, port, map, max_players, is_modded, logo_url, website_url, discord_url) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (user['id'], name, body.get('description', ''), body.get('ip', ''),
             body.get('port', 2302), body.get('map', 'Chernarus'),
             body.get('max_players', 64), body.get('is_modded', False),
             body.get('logo_url'), body.get('website_url'), body.get('discord_url'))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': new_id})}

    # POST /vote?id=
    if method == 'POST' and '/vote' in path:
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужна авторизация'})}
        server_id = params.get('id')
        cur.execute("SELECT id FROM server_votes WHERE server_id = %s AND user_id = %s", (server_id, user['id']))
        if cur.fetchone():
            return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Вы уже голосовали'})}

        cur.execute("INSERT INTO server_votes (server_id, user_id) VALUES (%s, %s)", (server_id, user['id']))
        cur.execute("UPDATE servers SET votes = votes + 1 WHERE id = %s RETURNING votes", (server_id,))
        votes = cur.fetchone()[0]
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'votes': votes})}

    # POST /boost — реклама сервера (платная)
    if method == 'POST' and '/boost' in path:
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нужна авторизация'})}
        body = json.loads(event.get('body') or '{}')
        server_id = body.get('server_id')
        days = int(body.get('days', 30))

        cur.execute("SELECT owner_id FROM servers WHERE id = %s", (server_id,))
        row = cur.fetchone()
        if not row or row[0] != user['id']:
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}

        cur.execute(
            "UPDATE servers SET ad_expires_at = NOW() + INTERVAL '%s days', ad_boost = %s WHERE id = %s",
            (days, days, server_id)
        )
        conn.commit()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'message': 'Реклама активирована'})}

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}