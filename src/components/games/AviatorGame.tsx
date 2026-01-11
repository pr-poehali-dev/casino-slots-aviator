import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AviatorGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const AviatorGame = ({ balance, setBalance }: AviatorGameProps) => {
  const [bet, setBet] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [hasActiveBet, setHasActiveBet] = useState(false);
  const [autoCashout, setAutoCashout] = useState(2.0);
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
    
    crashPointRef.current = 1.0 + Math.random() * 9;
    
    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const newValue = prev + 0.01;
        
        if (newValue >= crashPointRef.current) {
          stopFlight(true);
          return prev;
        }
        
        if (newValue >= autoCashout && hasActiveBet) {
          cashout(newValue);
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
      toast.error(`💥 Упал на x${multiplier.toFixed(2)}! Проиграли ${bet}₽`);
      setHasActiveBet(false);
    }
  };

  const cashout = (multi?: number) => {
    if (!hasActiveBet) return;
    
    const finalMulti = multi || multiplier;
    const winAmount = Math.floor(bet * finalMulti);
    
    setBalance(prev => prev + winAmount);
    setHasActiveBet(false);
    toast.success(`✅ Вывели на x${finalMulti.toFixed(2)}! Выигрыш: ${winAmount}₽`);
    
    if (!multi) {
      stopFlight();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Card className="p-8 card-glow">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">✈️ Авиатор</h2>
        <p className="text-muted-foreground">Успей вывести до падения!</p>
      </div>

      <div className="relative h-96 bg-gradient-to-b from-blue-500/20 to-blue-900/20 rounded-lg mb-6 overflow-hidden border-2 border-primary">
        <div className={`absolute transition-all duration-100 ${isFlying ? 'animate-pulse-glow' : ''}`}
             style={{ 
               left: isFlying ? `${Math.min((multiplier - 1) * 10, 90)}%` : '10%',
               bottom: isFlying ? `${Math.min((multiplier - 1) * 8, 80)}%` : '10%'
             }}>
          <div className="text-6xl">✈️</div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className={`text-8xl font-bold ${isFlying ? 'gold-glow text-secondary' : ''}`}>
            {multiplier.toFixed(2)}x
          </div>
          {!isFlying && (
            <p className="text-xl text-muted-foreground mt-4">Ожидание раунда...</p>
          )}
        </div>

        {!isFlying && multiplier > 1 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg text-2xl font-bold animate-pulse">
              💥 УПАЛ НА {multiplier.toFixed(2)}x
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Автовывод на</label>
            <Input 
              type="number" 
              value={autoCashout} 
              onChange={(e) => setAutoCashout(Number(e.target.value))}
              disabled={isFlying}
              step={0.1}
              min={1.1}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!isFlying ? (
            <Button onClick={startFlight} className="premium-gradient w-full h-14 text-lg">
              <Icon name="Plane" className="mr-2" />
              Начать полёт
            </Button>
          ) : (
            <Button 
              onClick={() => cashout()} 
              disabled={!hasActiveBet}
              className="premium-gradient w-full h-14 text-lg"
            >
              {hasActiveBet ? `Вывести ${(bet * multiplier).toFixed(0)}₽` : 'Ставка не сделана'}
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

export default AviatorGame;
