import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface DiceGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const DiceGame = ({ balance, setBalance }: DiceGameProps) => {
  const [bet, setBet] = useState(10);
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState([1, 1]);
  const [prediction, setPrediction] = useState<'high' | 'low' | 'even' | 'odd'>('high');

  const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const rollDice = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - bet);
    setRolling(true);

    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const result = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      setDice(result);
      setRolling(false);

      const sum = result[0] + result[1];
      let won = false;
      let multiplier = 0;

      if (prediction === 'high' && sum >= 8) {
        won = true;
        multiplier = 2;
      } else if (prediction === 'low' && sum <= 6) {
        won = true;
        multiplier = 2;
      } else if (prediction === 'even' && sum % 2 === 0) {
        won = true;
        multiplier = 1.9;
      } else if (prediction === 'odd' && sum % 2 === 1) {
        won = true;
        multiplier = 1.9;
      }

      if (result[0] === result[1]) {
        multiplier += 1;
        toast.success(`🎲 Дубль! Бонус x1!`);
      }

      if (won) {
        const winAmount = Math.floor(bet * multiplier);
        setBalance(prev => prev + winAmount);
        toast.success(`✅ Выигрыш! Сумма: ${sum}. Получено: ${winAmount}₽ (x${multiplier})`);
      } else {
        toast.error(`❌ Проигрыш! Сумма: ${sum}`);
      }
    }, 2000);
  };

  return (
    <Card className="p-8 card-glow">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🎲 Кости</h2>
        <p className="text-muted-foreground">Предскажи результат броска!</p>
      </div>

      <div className="flex justify-center gap-8 mb-8">
        {dice.map((value, i) => (
          <div 
            key={i} 
            className={`w-32 h-32 flex items-center justify-center bg-card border-4 border-primary rounded-2xl text-8xl ${rolling ? 'animate-spin-slow' : 'animate-pulse-glow'}`}
          >
            {diceEmojis[value - 1]}
          </div>
        ))}
      </div>

      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-secondary">
          Сумма: {dice[0] + dice[1]}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <Tabs value={prediction} onValueChange={(v) => setPrediction(v as any)} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="high">
              <div className="text-center">
                <Icon name="TrendingUp" className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Больше (8-12)</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="low">
              <div className="text-center">
                <Icon name="TrendingDown" className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Меньше (2-6)</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="even">
              <div className="text-center">
                <span className="text-lg mb-1">2️⃣</span>
                <span className="text-xs block">Чётное</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="odd">
              <div className="text-center">
                <span className="text-lg mb-1">3️⃣</span>
                <span className="text-xs block">Нечётное</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Input 
            type="number" 
            value={bet} 
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={rolling}
            min={1}
            max={balance}
            placeholder="Ставка"
          />
          <Button 
            onClick={rollDice} 
            disabled={rolling} 
            className="premium-gradient w-full"
          >
            {rolling ? 'Бросаем...' : 'Бросить кости'}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBet(10)} disabled={rolling} className="flex-1">10₽</Button>
          <Button variant="outline" onClick={() => setBet(50)} disabled={rolling} className="flex-1">50₽</Button>
          <Button variant="outline" onClick={() => setBet(100)} disabled={rolling} className="flex-1">100₽</Button>
          <Button variant="outline" onClick={() => setBet(500)} disabled={rolling} className="flex-1">500₽</Button>
        </div>

        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <h3 className="font-bold mb-2 text-center">📊 Правила выплат</h3>
          <div className="space-y-1 text-sm">
            <p>🔼 Больше (8-12): <span className="text-secondary font-bold">x2</span></p>
            <p>🔽 Меньше (2-6): <span className="text-secondary font-bold">x2</span></p>
            <p>2️⃣ Чётное: <span className="text-secondary font-bold">x1.9</span></p>
            <p>3️⃣ Нечётное: <span className="text-secondary font-bold">x1.9</span></p>
            <p className="text-accent font-bold">🎁 Дубль (одинаковые кости): +x1 к выигрышу!</p>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default DiceGame;
