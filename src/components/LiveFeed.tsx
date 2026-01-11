import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface WinData {
  id: number;
  username: string;
  game: string;
  amount: number;
  time: string;
}

const LiveFeed = () => {
  const [wins, setWins] = useState<WinData[]>([
    { id: 1, username: 'Player***123', game: '🎰 Слоты', amount: 5000, time: '2 мин назад' },
    { id: 2, username: 'Lucky***777', game: '✈️ Авиатор', amount: 12500, time: '5 мин назад' },
    { id: 3, username: 'Winner***456', game: '⛏️ Шахты', amount: 3200, time: '8 мин назад' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const games = ['🎰 Слоты', '✈️ Авиатор', '⛏️ Шахты', '🏗️ Башни', '📦 Кейсы', '⚽ Футбол'];
      const newWin: WinData = {
        id: Date.now(),
        username: `Player***${Math.floor(Math.random() * 999)}`,
        game: games[Math.floor(Math.random() * games.length)],
        amount: Math.floor(Math.random() * 10000) + 1000,
        time: 'только что'
      };

      setWins(prev => [newWin, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 card-glow">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="TrendingUp" className="text-secondary animate-pulse-glow" />
        Последние выигрыши
      </h3>
      <div className="space-y-3">
        {wins.map((win, i) => (
          <div 
            key={win.id} 
            className={`flex items-center justify-between p-3 bg-card rounded border border-border hover:border-primary transition-colors ${i === 0 ? 'animate-slide-up' : ''}`}
          >
            <div className="flex-1">
              <p className="font-semibold text-sm">{win.username}</p>
              <p className="text-xs text-muted-foreground">{win.game}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-secondary">+{win.amount.toLocaleString()}₽</p>
              <p className="text-xs text-muted-foreground">{win.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LiveFeed;
