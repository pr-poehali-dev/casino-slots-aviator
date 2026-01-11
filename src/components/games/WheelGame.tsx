import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface WheelGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const segments = [
  { multiplier: 1.5, color: '#9b87f5', label: 'x1.5' },
  { multiplier: 0, color: '#1a1a2e', label: '0' },
  { multiplier: 2, color: '#D946EF', label: 'x2' },
  { multiplier: 0, color: '#1a1a2e', label: '0' },
  { multiplier: 5, color: '#FFD700', label: 'x5' },
  { multiplier: 0, color: '#1a1a2e', label: '0' },
  { multiplier: 3, color: '#9b87f5', label: 'x3' },
  { multiplier: 0, color: '#1a1a2e', label: '0' },
  { multiplier: 10, color: '#FF6B6B', label: 'x10' },
  { multiplier: 0, color: '#1a1a2e', label: '0' },
  { multiplier: 2.5, color: '#D946EF', label: 'x2.5' },
  { multiplier: 0, color: '#1a1a2e', label: '0' },
];

const WheelGame = ({ balance, setBalance }: WheelGameProps) => {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<{ multiplier: number; amount: number } | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - bet);
    setSpinning(true);
    setLastWin(null);

    const spins = 5 + Math.random() * 3;
    const segmentAngle = 360 / segments.length;
    const randomSegment = Math.floor(Math.random() * segments.length);
    const finalAngle = spins * 360 + randomSegment * segmentAngle + segmentAngle / 2;

    setRotation(finalAngle);

    setTimeout(() => {
      setSpinning(false);
      const resultSegment = segments[randomSegment];

      if (resultSegment.multiplier > 0) {
        const winAmount = Math.floor(bet * resultSegment.multiplier);
        setBalance(prev => prev + winAmount);
        setLastWin({ multiplier: resultSegment.multiplier, amount: winAmount });
        toast.success(`🎡 Выигрыш! x${resultSegment.multiplier} = ${winAmount}₽`);
      } else {
        toast.error(`❌ Проигрыш! Попробуй ещё раз!`);
      }
    }, 4000);
  };

  return (
    <Card className="p-8 card-glow">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🎡 Колесо Фортуны</h2>
        <p className="text-muted-foreground">Крути колесо и выигрывай!</p>
      </div>

      <div className="flex justify-center mb-6 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
          <div className="text-4xl">👇</div>
        </div>

        <div className="relative w-96 h-96">
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {segments.map((segment, i) => {
                const angle = (360 / segments.length) * i;
                const nextAngle = (360 / segments.length) * (i + 1);
                
                const startX = 50 + 48 * Math.cos((angle - 90) * Math.PI / 180);
                const startY = 50 + 48 * Math.sin((angle - 90) * Math.PI / 180);
                const endX = 50 + 48 * Math.cos((nextAngle - 90) * Math.PI / 180);
                const endY = 50 + 48 * Math.sin((nextAngle - 90) * Math.PI / 180);

                const textAngle = (angle + nextAngle) / 2 - 90;
                const textX = 50 + 32 * Math.cos(textAngle * Math.PI / 180);
                const textY = 50 + 32 * Math.sin(textAngle * Math.PI / 180);

                return (
                  <g key={i}>
                    <path
                      d={`M 50 50 L ${startX} ${startY} A 48 48 0 0 1 ${endX} ${endY} Z`}
                      fill={segment.color}
                      stroke="#ffffff"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
              
              <circle cx="50" cy="50" r="10" fill="#FFD700" stroke="#ffffff" strokeWidth="1" />
              <circle cx="50" cy="50" r="5" fill="#ffffff" />
            </svg>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold">🎰</span>
            </div>
          </div>
        </div>
      </div>

      {lastWin && (
        <div className="text-center mb-6 animate-fade-in">
          <Card className="p-4 bg-gradient-to-r from-secondary/20 to-accent/20 inline-block">
            <p className="text-2xl font-bold text-secondary">
              🎉 Выигрыш: {lastWin.amount}₽ (x{lastWin.multiplier})
            </p>
          </Card>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex gap-2">
          <Input 
            type="number" 
            value={bet} 
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={spinning}
            min={1}
            max={balance}
            placeholder="Ставка"
          />
          <Button 
            onClick={spin} 
            disabled={spinning} 
            className="premium-gradient w-full"
          >
            {spinning ? (
              <>
                <Icon name="Loader" className="mr-2 animate-spin" />
                Крутим...
              </>
            ) : (
              <>
                <Icon name="Circle" className="mr-2" />
                Крутить колесо
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBet(10)} disabled={spinning} className="flex-1">10₽</Button>
          <Button variant="outline" onClick={() => setBet(50)} disabled={spinning} className="flex-1">50₽</Button>
          <Button variant="outline" onClick={() => setBet(100)} disabled={spinning} className="flex-1">100₽</Button>
          <Button variant="outline" onClick={() => setBet(500)} disabled={spinning} className="flex-1">500₽</Button>
        </div>

        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <h3 className="font-bold mb-2 text-center">🎰 Множители на колесе</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="flex justify-between items-center bg-[#FF6B6B] text-white p-2 rounded">
              <span>🔥 x10</span>
              <span className="font-bold">Редкий!</span>
            </div>
            <div className="flex justify-between items-center bg-[#FFD700] text-black p-2 rounded">
              <span>⭐ x5</span>
              <span className="font-bold">Удача!</span>
            </div>
            <div className="flex justify-between items-center bg-[#9b87f5] text-white p-2 rounded">
              <span>💜 x3</span>
              <span className="font-bold">Отлично!</span>
            </div>
            <div className="flex justify-between items-center bg-[#D946EF] text-white p-2 rounded">
              <span>💖 x2.5</span>
              <span className="font-bold">Хорошо!</span>
            </div>
            <div className="flex justify-between items-center bg-[#D946EF] text-white p-2 rounded">
              <span>💎 x2</span>
              <span className="font-bold">Неплохо!</span>
            </div>
            <div className="flex justify-between items-center bg-[#9b87f5] text-white p-2 rounded">
              <span>🎯 x1.5</span>
              <span className="font-bold">Базовый</span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            ⚠️ Остерегайся чёрных секторов - они не дают выигрыша!
          </p>
        </Card>
      </div>
    </Card>
  );
};

export default WheelGame;
