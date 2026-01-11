import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AviaMasterGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const AviaMasterGame = ({ balance, setBalance }: AviaMasterGameProps) => {
  const [bet, setBet] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [hasActiveBet, setHasActiveBet] = useState(false);
  const [bonuses, setBonuses] = useState<{x: number, y: number, type: 'coin' | 'rocket'}[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const crashPointRef = useRef(1.0);

  const startFlight = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - bet);
    setHasActiveBet(true);
    setIsFlying(true);
    setMultiplier(1.00);
    setBonuses([]);
    
    crashPointRef.current = 1.0 + Math.random() * 15;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setBonuses(prev => [...prev, {
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 10,
          type: Math.random() > 0.5 ? 'coin' : 'rocket'
        }]);
      }, i * 1000);
    }
    
    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const newValue = prev + 0.02;
        
        if (newValue >= crashPointRef.current) {
          stopFlight(true);
          return prev;
        }
        
        return newValue;
      });
    }, 50);
  };

  const stopFlight = (crashed: boolean = false) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsFlying(false);
    
    if (crashed && hasActiveBet) {
      toast.error(`🌊 Упал в воду! Проиграли ${bet}₽`);
      setHasActiveBet(false);
    }
  };

  const cashout = () => {
    if (!hasActiveBet) return;
    
    const winAmount = Math.floor(bet * multiplier);
    setBalance(prev => prev + winAmount);
    setHasActiveBet(false);
    toast.success(`✅ Успешная посадка! Выигрыш: ${winAmount}₽`);
    stopFlight();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Card className="p-8 card-glow bg-gradient-to-br from-accent/20 to-primary/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🚁 AviaMaster</h2>
        <p className="text-muted-foreground">Собирай бонусы и успей приземлиться!</p>
      </div>

      <div className="relative h-96 bg-gradient-to-b from-sky-400/20 to-blue-600/20 rounded-lg mb-6 overflow-hidden border-2 border-accent">
        <div className="absolute bottom-0 w-full h-16 bg-blue-800/40" />
        
        {bonuses.map((bonus, i) => (
          <div 
            key={i} 
            className="absolute text-3xl animate-pulse-glow"
            style={{ left: `${bonus.x}%`, top: `${bonus.y}%` }}
          >
            {bonus.type === 'coin' ? '💰' : '🚀'}
          </div>
        ))}

        <div className={`absolute transition-all duration-100 ${isFlying ? 'animate-pulse-glow' : ''}`}
             style={{ 
               left: isFlying ? `${Math.min((multiplier - 1) * 6, 85)}%` : '10%',
               bottom: isFlying ? `${Math.min((multiplier - 1) * 5, 75)}%` : '15%'
             }}>
          <div className="text-6xl">🚁</div>
        </div>
        
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className={`text-7xl font-bold ${isFlying ? 'gold-glow text-secondary' : ''}`}>
            {multiplier.toFixed(2)}x
          </div>
        </div>

        {!isFlying && multiplier > 1 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2">
            <div className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg text-2xl font-bold animate-pulse">
              🌊 УПАЛ В ВОДУ!
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
          <Input 
            type="number" 
            value={bet} 
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={isFlying}
            min={1}
            max={balance}
          />
        </div>

        <div className="flex gap-2">
          {!isFlying ? (
            <Button onClick={startFlight} className="premium-gradient w-full h-14 text-lg">
              <Icon name="Plane" className="mr-2" />
              Взлететь
            </Button>
          ) : (
            <Button 
              onClick={cashout} 
              disabled={!hasActiveBet}
              className="premium-gradient w-full h-14 text-lg animate-pulse-glow"
            >
              {hasActiveBet ? `🛬 Приземлиться ${(bet * multiplier).toFixed(0)}₽` : 'Ставка не сделана'}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBet(10)} disabled={isFlying} className="flex-1">10₽</Button>
          <Button variant="outline" onClick={() => setBet(50)} disabled={isFlying} className="flex-1">50₽</Button>
          <Button variant="outline" onClick={() => setBet(100)} disabled={isFlying} className="flex-1">100₽</Button>
          <Button variant="outline" onClick={() => setBet(500)} disabled={isFlying} className="flex-1">500₽</Button>
        </div>
      </div>
    </Card>
  );
};

export default AviaMasterGame;
