import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface FishingGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const fishes = [
  { emoji: '🐟', name: 'Мелкая рыбка', weight: '0.5 кг', multiplier: 1.2 },
  { emoji: '🐠', name: 'Тропическая рыбка', weight: '1 кг', multiplier: 2 },
  { emoji: '🐡', name: 'Рыба-шар', weight: '1.5 кг', multiplier: 3 },
  { emoji: '🦈', name: 'Акула', weight: '5 кг', multiplier: 8 },
  { emoji: '🐋', name: 'Кит', weight: '20 кг', multiplier: 20 },
  { emoji: '💎', name: 'Сундук с сокровищами', weight: '???', multiplier: 50 },
];

const FishingGame = ({ balance, setBalance }: FishingGameProps) => {
  const [bet, setBet] = useState(10);
  const [isFishing, setIsFishing] = useState(false);
  const [caughtFish, setCaughtFish] = useState<typeof fishes[0] | null>(null);
  const [rodAngle, setRodAngle] = useState(0);
  const [reeling, setReeling] = useState(false);

  const startFishing = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - bet);
    setIsFishing(true);
    setCaughtFish(null);
    
    setRodAngle(45);
    setTimeout(() => setRodAngle(0), 500);

    const waitTime = 2000 + Math.random() * 2000;
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * 100);
      let fishIndex;
      
      if (randomIndex < 35) fishIndex = 0;
      else if (randomIndex < 60) fishIndex = 1;
      else if (randomIndex < 78) fishIndex = 2;
      else if (randomIndex < 90) fishIndex = 3;
      else if (randomIndex < 98) fishIndex = 4;
      else fishIndex = 5;

      const fish = fishes[fishIndex];
      setCaughtFish(fish);
      setReeling(true);

      setTimeout(() => {
        setReeling(false);
        setIsFishing(false);
        
        const winAmount = Math.floor(bet * fish.multiplier);
        setBalance(prev => prev + winAmount);
        
        toast.success(`🎣 Поймали ${fish.name}! Выигрыш: ${winAmount}₽ (x${fish.multiplier})`);
      }, 1500);
    }, waitTime);
  };

  return (
    <Card className="p-8 card-glow">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🎣 Рыбалка</h2>
        <p className="text-muted-foreground">Закиньте удочку и поймайте крупный улов!</p>
      </div>

      <div className="relative h-96 bg-gradient-to-b from-blue-300/20 via-blue-500/30 to-blue-900/40 rounded-lg mb-6 overflow-hidden border-2 border-primary">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div 
            className="text-6xl transition-all duration-500"
            style={{ 
              transform: `rotate(${rodAngle}deg)`,
              transformOrigin: 'bottom center'
            }}
          >
            🎣
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2">
          <div className="text-5xl animate-bounce">🧑‍🦱</div>
          <p className="text-center text-sm mt-2 font-semibold">Рыбак</p>
        </div>

        {isFishing && !caughtFish && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="text-4xl animate-pulse">⏳</div>
            <p className="text-center text-sm mt-2">Ожидание поклёвки...</p>
          </div>
        )}

        {reeling && caughtFish && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-slide-up">
            <div className="text-7xl animate-bounce">{caughtFish.emoji}</div>
            <p className="text-center text-lg font-bold mt-2">{caughtFish.name}</p>
            <p className="text-center text-sm text-secondary">{caughtFish.weight}</p>
          </div>
        )}

        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-blue-900/60 to-transparent flex items-center justify-center gap-4">
          {['🌊', '🐟', '🌊', '🐠', '🌊', '🐡', '🌊'].map((emoji, i) => (
            <span key={i} className="text-2xl opacity-50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
              {emoji}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
            <Input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={isFishing}
              min={1}
              max={balance}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={startFishing} 
              disabled={isFishing} 
              className="premium-gradient w-full h-10"
            >
              {isFishing ? (
                <>
                  <Icon name="Loader" className="mr-2 animate-spin" />
                  Ловим...
                </>
              ) : (
                <>
                  <Icon name="Fish" className="mr-2" />
                  Забросить удочку
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBet(10)} disabled={isFishing} className="flex-1">10₽</Button>
          <Button variant="outline" onClick={() => setBet(50)} disabled={isFishing} className="flex-1">50₽</Button>
          <Button variant="outline" onClick={() => setBet(100)} disabled={isFishing} className="flex-1">100₽</Button>
          <Button variant="outline" onClick={() => setBet(500)} disabled={isFishing} className="flex-1">500₽</Button>
        </div>

        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <h3 className="font-bold mb-3 text-center">📊 Таблица выплат</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {fishes.map((fish, i) => (
              <div key={i} className="flex items-center gap-2 bg-card/50 p-2 rounded">
                <span className="text-2xl">{fish.emoji}</span>
                <div>
                  <p className="font-semibold text-xs">{fish.name}</p>
                  <p className="text-secondary font-bold">x{fish.multiplier}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default FishingGame;
