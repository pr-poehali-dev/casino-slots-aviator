import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Aviator2GameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const Aviator2Game = ({ balance, setBalance }: Aviator2GameProps) => {
  const [bet, setBet] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [hasActiveBet, setHasActiveBet] = useState(false);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [history, setHistory] = useState<number[]>([2.34, 1.67, 5.21, 1.04, 3.89]);
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
    
    crashPointRef.current = 1.0 + Math.random() * 14;
    
    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const increment = 0.01 + Math.random() * 0.02;
        const newValue = prev + increment;
        
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
    
    if (crashed) {
      setHistory(prev => [crashPointRef.current, ...prev.slice(0, 4)]);
      if (hasActiveBet) {
        toast.error(`💥 Упал на x${multiplier.toFixed(2)}!`);
        setHasActiveBet(false);
      }
      
      if (autoPlay && !hasActiveBet) {
        setTimeout(() => startFlight(), 2000);
      }
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
    <Card className="p-8 card-glow bg-gradient-to-br from-blue-500/10 to-purple-500/10">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🚀 Авиатор 2</h2>
        <p className="text-muted-foreground">Улучшенная версия с автоигрой!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="relative h-96 bg-gradient-to-b from-sky-500/20 to-indigo-900/20 rounded-lg overflow-hidden border-2 border-primary">
            <div className={`absolute transition-all duration-100 ${isFlying ? 'animate-pulse-glow' : ''}`}
                 style={{ 
                   left: isFlying ? `${Math.min((multiplier - 1) * 8, 90)}%` : '10%',
                   bottom: isFlying ? `${Math.min((multiplier - 1) * 6, 80)}%` : '10%',
                   transform: `rotate(${isFlying ? Math.min((multiplier - 1) * 3, 45) : 0}deg)`
                 }}>
              <div className="text-7xl">🚀</div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full opacity-20">
                <line x1="0" y1="100%" x2="100%" y2="0" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className={`text-9xl font-bold ${isFlying ? 'gold-glow text-secondary animate-pulse-glow' : 'text-muted-foreground'}`}>
                {multiplier.toFixed(2)}x
              </div>
              {!isFlying && (
                <p className="text-xl text-muted-foreground mt-4">Ожидание старта...</p>
              )}
            </div>

            {!isFlying && multiplier > 1 && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg text-3xl font-bold animate-pulse">
                  💥 УПАЛ НА {multiplier.toFixed(2)}x
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <Card className="p-4 bg-card/50">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Icon name="History" className="w-4 h-4" />
              История раундов
            </h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded text-center font-bold text-lg ${
                    h >= 2 ? 'bg-secondary/20 text-secondary' : 'bg-destructive/20 text-destructive'
                  }`}
                >
                  {h.toFixed(2)}x
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Автоигра</label>
            <div className="flex items-center gap-3 h-10">
              <Switch 
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
                disabled={isFlying}
              />
              <span className="text-sm">{autoPlay ? 'Включена' : 'Выключена'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!isFlying ? (
            <Button onClick={startFlight} className="premium-gradient w-full h-14 text-lg">
              <Icon name="Rocket" className="mr-2" />
              Старт
            </Button>
          ) : (
            <Button 
              onClick={() => cashout()} 
              disabled={!hasActiveBet}
              className="premium-gradient w-full h-14 text-lg animate-pulse-glow"
            >
              {hasActiveBet ? `🎯 Вывести ${(bet * multiplier).toFixed(0)}₽` : 'Ставка не сделана'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" onClick={() => setBet(10)} disabled={isFlying}>10₽</Button>
          <Button variant="outline" onClick={() => setBet(50)} disabled={isFlying}>50₽</Button>
          <Button variant="outline" onClick={() => setBet(100)} disabled={isFlying}>100₽</Button>
          <Button variant="outline" onClick={() => setBet(500)} disabled={isFlying}>500₽</Button>
        </div>
      </div>
    </Card>
  );
};

export default Aviator2Game;
