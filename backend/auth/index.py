import json
import os
import hashlib
import hmac
import time
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для регистрации и авторизации пользователей'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'register':
            return register_user(conn, schema, body)
        elif action == 'login':
            return login_user(conn, schema, body)
        elif action == 'get_user':
            return get_user_info(conn, schema, body)
        elif action == 'update_balance':
            return update_user_balance(conn, schema, body)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if conn:
            conn.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def register_user(conn, schema: str, body: dict) -> dict:
    username = body.get('username')
    password = body.get('password')
    email = body.get('email', '')
    
    if not username or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Username and password required'})
        }
    
    password_hash = hash_password(password)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Проверка существования пользователя
        cur.execute(f'SELECT id FROM {schema}.users WHERE username = %s', (username,))
        if cur.fetchone():
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Username already exists'})
            }
        
        # Создание пользователя
        cur.execute(
            f'''INSERT INTO {schema}.users (username, password_hash, email, balance) 
                VALUES (%s, %s, %s, 2000.00) 
                RETURNING id, username, email, balance, is_admin, created_at''',
            (username, password_hash, email)
        )
        user = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'user': dict(user),
                'token': generate_token(user['id'])
            }, default=str)
        }

def login_user(conn, schema: str, body: dict) -> dict:
    username = body.get('username')
    password = body.get('password')
    
    if not username or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Username and password required'})
        }
    
    password_hash = hash_password(password)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f'''SELECT id, username, email, balance, is_admin, created_at 
                FROM {schema}.users 
                WHERE username = %s AND password_hash = %s''',
            (username, password_hash)
        )
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid credentials'})
            }
        
        # Обновление времени последнего входа
        cur.execute(
            f'UPDATE {schema}.users SET last_login = CURRENT_TIMESTAMP WHERE id = %s',
            (user['id'],)
        )
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'user': dict(user),
                'token': generate_token(user['id'])
            }, default=str)
        }

def get_user_info(conn, schema: str, body: dict) -> dict:
    user_id = body.get('user_id')
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'})
        }
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f'''SELECT id, username, email, balance, is_admin, created_at, last_login 
                FROM {schema}.users WHERE id = %s''',
            (user_id,)
        )
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'user': dict(user)}, default=str)
        }

def update_user_balance(conn, schema: str, body: dict) -> dict:
    user_id = body.get('user_id')
    amount = body.get('amount')
    
    if not user_id or amount is None:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID and amount required'})
        }
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f'UPDATE {schema}.users SET balance = balance + %s WHERE id = %s RETURNING balance',
            (amount, user_id)
        )
        result = cur.fetchone()
        conn.commit()
        
        if not result:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'balance': float(result['balance'])})
        }

def generate_token(user_id: int) -> str:
    '''Генерация простого токена на основе user_id и времени'''
    timestamp = str(int(time.time()))
    data = f"{user_id}:{timestamp}"
    return hashlib.sha256(data.encode()).hexdigest()
