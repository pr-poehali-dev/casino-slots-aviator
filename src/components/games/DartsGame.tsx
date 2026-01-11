import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface DartsGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

interface Dart {
  x: number;
  y: number;
  points: number;
}

const DartsGame = ({ balance, setBalance }: DartsGameProps) => {
  const [bet, setBet] = useState(10);
  const [throwing, setThrowing] = useState(false);
  const [darts, setDarts] = useState<Dart[]>([]);
  const [dartsLeft, setDartsLeft] = useState(3);
  const [totalPoints, setTotalPoints] = useState(0);

  const calculatePoints = (x: number, y: number) => {
    const centerX = 50;
    const centerY = 50;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    if (distance < 5) return 50;
    if (distance < 10) return 25;
    if (distance < 20) return 15;
    if (distance < 30) return 10;
    if (distance < 40) return 5;
    return 1;
  };

  const throwDart = () => {
    if (dartsLeft === 3 && bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    if (dartsLeft === 3) {
      setBalance(prev => prev - bet);
      setDarts([]);
      setTotalPoints(0);
    }

    setThrowing(true);

    setTimeout(() => {
      const x = 50 + (Math.random() - 0.5) * 60;
      const y = 50 + (Math.random() - 0.5) * 60;
      const points = calculatePoints(x, y);

      const newDart = { x, y, points };
      const newDarts = [...darts, newDart];
      setDarts(newDarts);
      
      const newTotal = totalPoints + points;
      setTotalPoints(newTotal);
      setThrowing(false);

      toast.success(`🎯 Попадание! +${points} очков`);

      if (dartsLeft === 1) {
        const multiplier = newTotal / 50;
        const winAmount = Math.floor(bet * multiplier);
        
        if (winAmount > bet) {
          setBalance(prev => prev + winAmount);
          toast.success(`✅ Игра окончена! Очков: ${newTotal}. Выигрыш: ${winAmount}₽ (x${multiplier.toFixed(2)})`);
        } else {
          toast.error(`❌ Игра окончена! Очков: ${newTotal}. Недостаточно для выигрыша!`);
        }
        
        setDartsLeft(3);
      } else {
        setDartsLeft(prev => prev - 1);
      }
    }, 800);
  };

  return (
    <Card className="p-8 card-glow">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🎯 Дартс</h2>
        <p className="text-muted-foreground">Попади в центр мишени!</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-96 h-96">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="#1a1a2e" stroke="#ffd700" strokeWidth="0.5" />
            
            <circle cx="50" cy="50" r="40" fill="#2a2a4e" stroke="#9b87f5" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="30" fill="#3a3a6e" stroke="#9b87f5" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="20" fill="#4a4a8e" stroke="#9b87f5" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="10" fill="#D946EF" stroke="#FFD700" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="5" fill="#FFD700" stroke="#fff" strokeWidth="0.5" className="animate-pulse-glow" />

            <line x1="50" y1="0" x2="50" y2="100" stroke="#9b87f5" strokeWidth="0.2" opacity="0.3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#9b87f5" strokeWidth="0.2" opacity="0.3" />
            <line x1="15" y1="15" x2="85" y2="85" stroke="#9b87f5" strokeWidth="0.2" opacity="0.3" />
            <line x1="85" y1="15" x2="15" y2="85" stroke="#9b87f5" strokeWidth="0.2" opacity="0.3" />

            {darts.map((dart, i) => (
              <g key={i}>
                <circle 
                  cx={dart.x} 
                  cy={dart.y} 
                  r="1.5" 
                  fill="#ff0000" 
                  className="animate-pulse"
                />
                <line
                  x1={dart.x}
                  y1={dart.y - 3}
                  x2={dart.x}
                  y2={dart.y}
                  stroke="#ff0000"
                  strokeWidth="0.3"
                />
                <text
                  x={dart.x + 3}
                  y={dart.y - 2}
                  fill="#FFD700"
                  fontSize="4"
                  fontWeight="bold"
                >
                  {dart.points}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="flex justify-center gap-8 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Дротиков осталось</p>
            <p className="text-3xl font-bold text-secondary">{dartsLeft}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Всего очков</p>
            <p className="text-3xl font-bold text-accent">{totalPoints}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {dartsLeft === 3 ? (
          <>
            <div className="flex gap-2">
              <Input 
                type="number" 
                value={bet} 
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={throwing}
                min={1}
                max={balance}
                placeholder="Ставка"
              />
              <Button 
                onClick={throwDart} 
                disabled={throwing} 
                className="premium-gradient w-full"
              >
                {throwing ? (
                  <>
                    <Icon name="Loader" className="mr-2 animate-spin" />
                    Бросок...
                  </>
                ) : (
                  <>
                    <Icon name="Target" className="mr-2" />
                    Начать игру
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBet(10)} disabled={throwing} className="flex-1">10₽</Button>
              <Button variant="outline" onClick={() => setBet(50)} disabled={throwing} className="flex-1">50₽</Button>
              <Button variant="outline" onClick={() => setBet(100)} disabled={throwing} className="flex-1">100₽</Button>
              <Button variant="outline" onClick={() => setBet(500)} disabled={throwing} className="flex-1">500₽</Button>
            </div>
          </>
        ) : (
          <Button 
            onClick={throwDart} 
            disabled={throwing} 
            className="premium-gradient w-full h-14 text-lg"
          >
            {throwing ? (
              <>
                <Icon name="Loader" className="mr-2 animate-spin" />
                Бросок...
              </>
            ) : (
              <>
                <Icon name="Target" className="mr-2" />
                Бросить дротик ({dartsLeft} осталось)
              </>
            )}
          </Button>
        )}

        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <h3 className="font-bold mb-2 text-center">🎯 Очки за зоны</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span>🎯 Яблочко (центр)</span>
              <span className="text-secondary font-bold">50 очков</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🟡 Внутренняя зона</span>
              <span className="text-secondary font-bold">25 очков</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🔵 Средняя зона</span>
              <span className="text-secondary font-bold">15 очков</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🟣 Внешняя зона</span>
              <span className="text-secondary font-bold">10 очков</span>
            </div>
            <div className="flex justify-between items-center">
              <span>⚫ Край мишени</span>
              <span className="text-secondary font-bold">5 очков</span>
            </div>
            <div className="flex justify-between items-center">
              <span>⚪ За пределами</span>
              <span className="text-muted-foreground">1 очко</span>
            </div>
            <p className="text-center text-accent font-bold mt-3">
              Множитель = Очки / 50. Нужно набрать минимум 50 очков для выигрыша!
            </p>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default DartsGame;
