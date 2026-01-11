const AUTH_API = 'https://functions.poehali.dev/90ac8029-1642-4311-84a7-73245da3b7c7';
const GAMES_API = 'https://functions.poehali.dev/2e5b7a71-590a-4a94-bef7-12e3a499ac1d';

export interface User {
  id: number;
  username: string;
  email?: string;
  balance: number;
  is_admin: boolean;
  created_at: string;
  last_login?: string;
}

export interface GameSettings {
  id: number;
  game_name: string;
  rtp_percent: number;
  min_bet: number;
  max_bet: number;
  enabled: boolean;
  custom_config: any;
  updated_at: string;
}

export interface GameHistory {
  id: number;
  user_id: number;
  game_name: string;
  bet_amount: number;
  win_amount: number;
  multiplier: number;
  result_data: any;
  played_at: string;
}

export const authAPI = {
  async register(username: string, password: string, email?: string) {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, password, email })
    });
    return response.json();
  },

  async login(username: string, password: string) {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password })
    });
    return response.json();
  },

  async getUser(userId: number) {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_user', user_id: userId })
    });
    return response.json();
  },

  async updateBalance(userId: number, amount: number) {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_balance', user_id: userId, amount })
    });
    return response.json();
  }
};

export const gamesAPI = {
  async getSettings() {
    const response = await fetch(GAMES_API, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  async play(userId: number, gameName: string, betAmount: number, gameData?: any) {
    const response = await fetch(GAMES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.dumps({ action: 'play', user_id: userId, game_name: gameName, bet_amount: betAmount, game_data: gameData })
    });
    return response.json();
  },

  async getHistory(userId: number, limit: number = 50) {
    const response = await fetch(GAMES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'history', user_id: userId, limit })
    });
    return response.json();
  },

  async updateSettings(gameName: string, updates: any) {
    const response = await fetch(GAMES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_settings', game_name: gameName, updates })
    });
    return response.json();
  }
};
