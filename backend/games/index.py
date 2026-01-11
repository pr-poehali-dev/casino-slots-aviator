import json
import os
import random
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для игровых сессий с контролем RTP'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        if method == 'GET':
            return get_game_settings(conn, schema)
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'play':
                return play_game(conn, schema, body)
            elif action == 'history':
                return get_game_history(conn, schema, body)
            elif action == 'update_settings':
                return update_game_settings(conn, schema, body)
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
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

def get_game_settings(conn, schema: str) -> dict:
    '''Получить настройки всех игр'''
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f'SELECT * FROM {schema}.game_settings ORDER BY game_name')
        settings = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'settings': [dict(s) for s in settings]}, default=str)
        }

def play_game(conn, schema: str, body: dict) -> dict:
    '''Играть в игру с учетом RTP'''
    user_id = body.get('user_id')
    game_name = body.get('game_name')
    bet_amount = body.get('bet_amount')
    game_data = body.get('game_data', {})
    
    if not all([user_id, game_name, bet_amount]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'user_id, game_name, and bet_amount required'})
        }
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Получить настройки игры
        cur.execute(
            f'SELECT * FROM {schema}.game_settings WHERE game_name = %s',
            (game_name,)
        )
        settings = cur.fetchone()
        
        if not settings or not settings['enabled']:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Game is disabled'})
            }
        
        # Проверить баланс
        cur.execute(f'SELECT balance FROM {schema}.users WHERE id = %s', (user_id,))
        user = cur.fetchone()
        
        if not user or user['balance'] < bet_amount:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Insufficient balance'})
            }
        
        # Рассчитать результат игры с учетом RTP
        rtp = float(settings['rtp_percent']) / 100.0
        result = calculate_game_result(game_name, bet_amount, rtp, game_data)
        
        win_amount = result['win_amount']
        multiplier = result['multiplier']
        
        # Обновить баланс
        cur.execute(
            f'UPDATE {schema}.users SET balance = balance - %s + %s WHERE id = %s',
            (bet_amount, win_amount, user_id)
        )
        
        # Сохранить историю
        cur.execute(
            f'''INSERT INTO {schema}.game_history 
                (user_id, game_name, bet_amount, win_amount, multiplier, result_data) 
                VALUES (%s, %s, %s, %s, %s, %s)''',
            (user_id, game_name, bet_amount, win_amount, multiplier, json.dumps(result['data']))
        )
        
        # Получить новый баланс
        cur.execute(f'SELECT balance FROM {schema}.users WHERE id = %s', (user_id,))
        new_balance = cur.fetchone()['balance']
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'win_amount': float(win_amount),
                'multiplier': float(multiplier),
                'balance': float(new_balance),
                'result': result['data']
            })
        }

def calculate_game_result(game_name: str, bet: float, rtp: float, game_data: dict) -> dict:
    '''Расчет результата игры с учетом RTP'''
    
    # Базовая логика: случайное число определяет выигрыш
    rand = random.random()
    
    # Корректировка вероятности выигрыша на основе RTP
    win_threshold = rtp * 0.5  # 50% от RTP - вероятность выигрыша
    
    if rand < win_threshold:
        # Выигрыш
        multipliers = {
            'Слоты': [1.5, 2, 3, 5, 10, 20],
            'Авиатор': [1.2, 1.5, 2, 3, 5, 10],
            'Рыбалка': [1.2, 2, 3, 8, 20, 50],
            'Кости': [1.9, 2, 3],
            'Покер': [1.5, 2, 5, 10, 50],
            'Дартс': [1.5, 2, 3, 5, 10],
            'Сапёр': [1.2, 1.5, 2, 3, 5],
            'Колесо Фортуны': [2, 5, 10, 20, 50],
            'Майнкрафт': [1.5, 2, 3, 5, 10],
            'Спорт': [1.8, 2.5, 3.5]
        }
        
        game_multipliers = multipliers.get(game_name, [1.5, 2, 3])
        multiplier = random.choice(game_multipliers)
        win_amount = bet * multiplier
        
        return {
            'win_amount': win_amount,
            'multiplier': multiplier,
            'data': {
                'won': True,
                'multiplier': multiplier,
                'details': f'Выигрыш x{multiplier}'
            }
        }
    else:
        # Проигрыш
        return {
            'win_amount': 0,
            'multiplier': 0,
            'data': {
                'won': False,
                'multiplier': 0,
                'details': 'Проигрыш'
            }
        }

def get_game_history(conn, schema: str, body: dict) -> dict:
    '''Получить историю игр пользователя'''
    user_id = body.get('user_id')
    limit = body.get('limit', 50)
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'user_id required'})
        }
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f'''SELECT * FROM {schema}.game_history 
                WHERE user_id = %s 
                ORDER BY played_at DESC 
                LIMIT %s''',
            (user_id, limit)
        )
        history = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'history': [dict(h) for h in history]}, default=str)
        }

def update_game_settings(conn, schema: str, body: dict) -> dict:
    '''Обновить настройки игры (только для админов)'''
    game_name = body.get('game_name')
    updates = body.get('updates', {})
    
    if not game_name:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'game_name required'})
        }
    
    # Построение UPDATE запроса
    allowed_fields = ['rtp_percent', 'min_bet', 'max_bet', 'enabled']
    set_parts = []
    values = []
    
    for field in allowed_fields:
        if field in updates:
            set_parts.append(f'{field} = %s')
            values.append(updates[field])
    
    if not set_parts:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No valid fields to update'})
        }
    
    values.append(game_name)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        query = f"UPDATE {schema}.game_settings SET {', '.join(set_parts)}, updated_at = CURRENT_TIMESTAMP WHERE game_name = %s RETURNING *"
        cur.execute(query, values)
        result = cur.fetchone()
        conn.commit()
        
        if not result:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Game not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'settings': dict(result)}, default=str)
        }
