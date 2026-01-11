import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface SlotsGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const fruits = ['🍒', '🍋', '🍊', '🍇', '🍉', '⭐', '💎'];
const fish = ['🐟', '🐠', '🐡', '🦈', '🐙', '⭐', '💎'];
const dogs = ['🐶', '🐕', '🦴', '🎾', '🐾', '⭐', '💎'];

const SlotsGame = ({ balance, setBalance }: SlotsGameProps) => {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [vipReels, setVipReels] = useState(['🍒', '🍒', '🍒', '🍒', '🍒']);
  const [slotType, setSlotType] = useState<'fruits' | 'fish' | 'dogs' | 'vip' | 'fishvip' | 'dogsvip'>('fruits');

  const spin = (isVip: boolean = false) => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - bet);
    setSpinning(true);

    let symbols = fruits;
    if (slotType === 'fish' || slotType === 'fishvip') symbols = fish;
    if (slotType === 'dogs' || slotType === 'dogsvip') symbols = dogs;

    const duration = 2000;
    const interval = setInterval(() => {
      if (isVip) {
        setVipReels(Array(5).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)]));
      } else {
        setReels(Array(3).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)]));
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const result = isVip 
        ? Array(5).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)])
        : Array(3).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      
      if (isVip) {
        setVipReels(result);
      } else {
        setReels(result);
      }
      setSpinning(false);

      const uniqueSymbols = new Set(result).size;
      let winMultiplier = 0;

      if (isVip) {
        if (uniqueSymbols === 1) {
          if (result[0] === '💎') winMultiplier = 100;
          else if (result[0] === '⭐') winMultiplier = 50;
          else winMultiplier = 20;
          toast.success(`🎰 ДЖЕКПОТ! x${winMultiplier}`);
        } else if (uniqueSymbols === 2) {
          winMultiplier = 5;
          toast.success(`Выигрыш! x${winMultiplier}`);
        }
      } else {
        if (uniqueSymbols === 1) {
          if (result[0] === '💎') winMultiplier = 50;
          else if (result[0] === '⭐') winMultiplier = 25;
          else winMultiplier = 10;
          toast.success(`🎰 Выигрыш! x${winMultiplier}`);
        }
      }

      if (winMultiplier > 0) {
        setBalance(prev => prev + bet * winMultiplier);
      }
    }, duration);
  };

  return (
    <div className="space-y-6">
      <Tabs value={slotType} onValueChange={(v) => setSlotType(v as any)} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full gap-1">
          <TabsTrigger value="fruits">🍒 Фрукты</TabsTrigger>
          <TabsTrigger value="fish">🐟 Рыбка</TabsTrigger>
          <TabsTrigger value="dogs">🐶 Собачка</TabsTrigger>
          <TabsTrigger value="vip">💎 Фрукты VIP</TabsTrigger>
          <TabsTrigger value="fishvip">🐠 Рыбка VIP</TabsTrigger>
          <TabsTrigger value="dogsvip">🦴 Собачка VIP</TabsTrigger>
        </TabsList>

        {['fruits', 'fish', 'dogs'].map(type => (
          <TabsContent key={type} value={type}>
            <Card className="p-8 card-glow">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">
                  {type === 'fruits' && '🍒 Фруктовый слот'}
                  {type === 'fish' && '🐟 Рыбный слот'}
                  {type === 'dogs' && '🐶 Собачий слот'}
                </h2>
                <p className="text-muted-foreground">3 одинаковых = выигрыш!</p>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {reels.map((symbol, i) => (
                  <div key={i} className={`w-32 h-32 flex items-center justify-center bg-card border-4 border-primary rounded-lg text-6xl ${spinning ? 'animate-spin-slow' : ''}`}>
                    {symbol}
                  </div>
                ))}
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={bet} 
                    onChange={(e) => setBet(Number(e.target.value))}
                    placeholder="Ставка"
                    min={1}
                    max={balance}
                  />
                  <Button onClick={() => spin(false)} disabled={spinning} className="premium-gradient w-full">
                    {spinning ? 'Крутим...' : 'Крутить'}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setBet(10)} className="flex-1">10₽</Button>
                  <Button variant="outline" onClick={() => setBet(50)} className="flex-1">50₽</Button>
                  <Button variant="outline" onClick={() => setBet(100)} className="flex-1">100₽</Button>
                  <Button variant="outline" onClick={() => setBet(500)} className="flex-1">500₽</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        ))}

        {['vip', 'fishvip', 'dogsvip'].map(vipType => (
          <TabsContent key={vipType} value={vipType}>
            <Card className="p-8 card-glow bg-gradient-to-br from-secondary/20 to-accent/20">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 gold-glow">
                  {vipType === 'vip' && '💎 Фрукты VIP - 5 барабанов'}
                  {vipType === 'fishvip' && '🐠 Рыбка VIP - 5 барабанов'}
                  {vipType === 'dogsvip' && '🦴 Собачка VIP - 5 барабанов'}
                </h2>
                <p className="text-muted-foreground">5 одинаковых = ДЖЕКПОТ x100!</p>
              </div>

            <div className="flex justify-center gap-2 mb-8">
              {vipReels.map((symbol, i) => (
                <div key={i} className={`w-24 h-24 flex items-center justify-center bg-card border-4 border-secondary rounded-lg text-5xl ${spinning ? 'animate-spin-slow' : ''}`}>
                  {symbol}
                </div>
              ))}
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  value={bet} 
                  onChange={(e) => setBet(Number(e.target.value))}
                  placeholder="Ставка"
                  min={1}
                  max={balance}
                />
                <Button onClick={() => spin(true)} disabled={spinning} className="premium-gradient w-full">
                  {spinning ? 'Крутим...' : 'Крутить'}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setBet(50)} className="flex-1">50₽</Button>
                <Button variant="outline" onClick={() => setBet(100)} className="flex-1">100₽</Button>
                <Button variant="outline" onClick={() => setBet(500)} className="flex-1">500₽</Button>
                <Button variant="outline" onClick={() => setBet(1000)} className="flex-1">1000₽</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SlotsGame;