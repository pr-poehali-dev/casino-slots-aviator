import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface SportsGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

interface Match {
  id: number;
  team1: string;
  team2: string;
  odds1: number;
  oddsDraw?: number;
  odds2: number;
  time: string;
}

const SportsGame = ({ balance, setBalance }: SportsGameProps) => {
  const [bet, setBet] = useState(10);
  const [activeBets, setActiveBets] = useState<any[]>([]);

  const footballMatches: Match[] = [
    { id: 1, team1: 'Реал Мадрид', team2: 'Барселона', odds1: 2.1, oddsDraw: 3.2, odds2: 3.5, time: 'Через 2 часа' },
    { id: 2, team1: 'Манчестер Юнайтед', team2: 'Ливерпуль', odds1: 2.8, oddsDraw: 3.0, odds2: 2.6, time: 'Через 4 часа' },
    { id: 3, team1: 'ПСЖ', team2: 'Бавария', odds1: 2.4, oddsDraw: 3.1, odds2: 2.9, time: 'Сегодня 21:00' },
    { id: 4, team1: 'Ювентус', team2: 'Интер', odds1: 2.2, oddsDraw: 3.3, odds2: 3.2, time: 'Завтра 18:00' },
  ];

  const hockeyMatches: Match[] = [
    { id: 5, team1: 'СКА', team2: 'ЦСКА', odds1: 1.9, odds2: 2.1, time: 'Через 1 час' },
    { id: 6, team1: 'Ак Барс', team2: 'Авангард', odds1: 2.3, odds2: 1.8, time: 'Через 3 часа' },
    { id: 7, team1: 'Металлург Мг', team2: 'Динамо Мск', odds1: 2.0, odds2: 2.0, time: 'Сегодня 19:30' },
    { id: 8, team1: 'Салават Юлаев', team2: 'Трактор', odds1: 1.7, odds2: 2.4, time: 'Завтра 17:00' },
  ];

  const placeBet = (match: Match, outcome: 'team1' | 'draw' | 'team2', odds: number) => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - bet);
    
    const newBet = {
      id: Date.now(),
      match: `${match.team1} - ${match.team2}`,
      outcome: outcome === 'team1' ? match.team1 : outcome === 'draw' ? 'Ничья' : match.team2,
      odds,
      amount: bet,
      potentialWin: bet * odds,
      time: match.time
    };

    setActiveBets(prev => [...prev, newBet]);
    toast.success(`Ставка принята! Потенциальный выигрыш: ${(bet * odds).toFixed(0)}₽`);

    setTimeout(() => {
      const won = Math.random() > 0.5;
      if (won) {
        const winAmount = Math.floor(bet * odds);
        setBalance(prev => prev + winAmount);
        toast.success(`Ставка выиграла! +${winAmount}₽`);
      } else {
        toast.error('Ставка проиграла!');
      }
      setActiveBets(prev => prev.filter(b => b.id !== newBet.id));
    }, 10000);
  };

  const renderMatch = (match: Match, sport: 'football' | 'hockey') => (
    <Card key={match.id} className="p-4 hover:card-glow transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <p className="font-bold text-lg">{match.team1}</p>
          <p className="text-sm text-muted-foreground">VS</p>
          <p className="font-bold text-lg">{match.team2}</p>
        </div>
        <Badge variant="secondary">{match.time}</Badge>
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: sport === 'football' ? '1fr 1fr 1fr' : '1fr 1fr' }}>
        <Button 
          onClick={() => placeBet(match, 'team1', match.odds1)}
          variant="outline"
          className="flex flex-col h-auto py-3"
        >
          <span className="text-xs text-muted-foreground mb-1">П1</span>
          <span className="text-lg font-bold text-secondary">{match.odds1}</span>
        </Button>
        
        {sport === 'football' && match.oddsDraw && (
          <Button 
            onClick={() => placeBet(match, 'draw', match.oddsDraw)}
            variant="outline"
            className="flex flex-col h-auto py-3"
          >
            <span className="text-xs text-muted-foreground mb-1">X</span>
            <span className="text-lg font-bold text-secondary">{match.oddsDraw}</span>
          </Button>
        )}
        
        <Button 
          onClick={() => placeBet(match, 'team2', match.odds2)}
          variant="outline"
          className="flex flex-col h-auto py-3"
        >
          <span className="text-xs text-muted-foreground mb-1">П2</span>
          <span className="text-lg font-bold text-secondary">{match.odds2}</span>
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">⚽ Ставки на спорт</h2>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Ставка:</span>
            <Input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-32"
              min={1}
              max={balance}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <Button variant="outline" onClick={() => setBet(10)}>10₽</Button>
          <Button variant="outline" onClick={() => setBet(50)}>50₽</Button>
          <Button variant="outline" onClick={() => setBet(100)}>100₽</Button>
          <Button variant="outline" onClick={() => setBet(500)}>500₽</Button>
        </div>

        {activeBets.length > 0 && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Icon name="Clock" className="w-4 h-4" />
              Активные ставки ({activeBets.length})
            </h3>
            <div className="space-y-2">
              {activeBets.map(bet => (
                <div key={bet.id} className="flex items-center justify-between text-sm bg-card p-2 rounded">
                  <div>
                    <p className="font-semibold">{bet.match}</p>
                    <p className="text-muted-foreground">{bet.outcome} • {bet.odds}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{bet.amount}₽</p>
                    <p className="text-xs text-secondary">→ {bet.potentialWin.toFixed(0)}₽</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Tabs defaultValue="football" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="football">
            <Icon name="CircleDot" className="w-4 h-4 mr-2" />
            Футбол
          </TabsTrigger>
          <TabsTrigger value="hockey">
            <Icon name="Trophy" className="w-4 h-4 mr-2" />
            Хоккей
          </TabsTrigger>
        </TabsList>

        <TabsContent value="football" className="space-y-4">
          {footballMatches.map(match => renderMatch(match, 'football'))}
        </TabsContent>

        <TabsContent value="hockey" className="space-y-4">
          {hockeyMatches.map(match => renderMatch(match, 'hockey'))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SportsGame;
