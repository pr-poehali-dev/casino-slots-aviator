import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PokerGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const suits = ['♠️', '♥️', '♦️', '♣️'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

interface CardType {
  suit: string;
  rank: string;
}

const PokerGame = ({ balance, setBalance }: PokerGameProps) => {
  const [bet, setBet] = useState(10);
  const [dealing, setDealing] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [gameState, setGameState] = useState<'betting' | 'holding' | 'result'>('betting');

  const generateCard = (): CardType => ({
    suit: suits[Math.floor(Math.random() * suits.length)],
    rank: ranks[Math.floor(Math.random() * ranks.length)]
  });

  const checkHand = (hand: CardType[]) => {
    const rankCounts: { [key: string]: number } = {};
    const suitCounts: { [key: string]: number } = {};
    
    hand.forEach(card => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    });

    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const isFlush = Object.values(suitCounts).some(count => count === 5);
    
    const rankValues = hand.map(card => ranks.indexOf(card.rank)).sort((a, b) => a - b);
    const isStraight = rankValues.every((val, i) => i === 0 || val === rankValues[i - 1] + 1);

    if (isFlush && isStraight) return { name: 'Стрит-флеш', multiplier: 50 };
    if (counts[0] === 4) return { name: 'Каре', multiplier: 25 };
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Фулл-хаус', multiplier: 9 };
    if (isFlush) return { name: 'Флеш', multiplier: 6 };
    if (isStraight) return { name: 'Стрит', multiplier: 4 };
    if (counts[0] === 3) return { name: 'Тройка', multiplier: 3 };
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Две пары', multiplier: 2 };
    if (counts[0] === 2) return { name: 'Пара', multiplier: 1 };
    
    return { name: 'Старшая карта', multiplier: 0 };
  };

  const deal = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - bet);
    setDealing(true);
    setGameState('holding');
    setHeld([false, false, false, false, false]);

    const newCards = Array(5).fill(0).map(() => generateCard());
    setCards(newCards);
    setDealing(false);
  };

  const draw = () => {
    setDealing(true);
    
    const newCards = cards.map((card, i) => 
      held[i] ? card : generateCard()
    );
    
    setTimeout(() => {
      setCards(newCards);
      setDealing(false);
      setGameState('result');

      const result = checkHand(newCards);
      
      if (result.multiplier > 0) {
        const winAmount = Math.floor(bet * result.multiplier);
        setBalance(prev => prev + winAmount);
        toast.success(`🃏 ${result.name}! Выигрыш: ${winAmount}₽ (x${result.multiplier})`);
      } else {
        toast.error(`❌ ${result.name}. Проигрыш!`);
      }

      setTimeout(() => {
        setGameState('betting');
        setCards([]);
      }, 3000);
    }, 500);
  };

  const toggleHold = (index: number) => {
    if (gameState !== 'holding') return;
    const newHeld = [...held];
    newHeld[index] = !newHeld[index];
    setHeld(newHeld);
  };

  return (
    <Card className="p-8 card-glow">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🃏 Видео Покер</h2>
        <p className="text-muted-foreground">Собери выигрышную комбинацию!</p>
      </div>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {cards.length > 0 ? (
          cards.map((card, i) => (
            <div key={i} className="relative">
              <div 
                onClick={() => toggleHold(i)}
                className={`w-24 h-36 flex flex-col items-center justify-center bg-card border-4 ${
                  held[i] ? 'border-secondary' : 'border-primary'
                } rounded-lg cursor-pointer hover:scale-105 transition-transform ${
                  dealing ? 'animate-spin-slow' : ''
                }`}
              >
                <div className={`text-4xl ${card.suit === '♥️' || card.suit === '♦️' ? 'text-red-500' : ''}`}>
                  {card.suit}
                </div>
                <div className="text-2xl font-bold">{card.rank}</div>
              </div>
              {held[i] && gameState === 'holding' && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-secondary font-bold text-sm">
                  HOLD
                </div>
              )}
            </div>
          ))
        ) : (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="w-24 h-36 flex items-center justify-center bg-card/50 border-2 border-dashed border-primary/50 rounded-lg">
              <Icon name="CircleHelp" className="w-8 h-8 text-muted-foreground" />
            </div>
          ))
        )}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {gameState === 'betting' && (
          <>
            <div className="flex gap-2">
              <Input 
                type="number" 
                value={bet} 
                onChange={(e) => setBet(Number(e.target.value))}
                min={1}
                max={balance}
                placeholder="Ставка"
              />
              <Button onClick={deal} className="premium-gradient w-full">
                <Icon name="Play" className="mr-2" />
                Раздать карты
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBet(10)} className="flex-1">10₽</Button>
              <Button variant="outline" onClick={() => setBet(50)} className="flex-1">50₽</Button>
              <Button variant="outline" onClick={() => setBet(100)} className="flex-1">100₽</Button>
              <Button variant="outline" onClick={() => setBet(500)} className="flex-1">500₽</Button>
            </div>
          </>
        )}

        {gameState === 'holding' && (
          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">Нажмите на карты, которые хотите оставить</p>
            <Button onClick={draw} className="premium-gradient w-full" disabled={dealing}>
              <Icon name="RefreshCw" className="mr-2" />
              Обменять карты
            </Button>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary animate-pulse-glow">
              {checkHand(cards).name}
            </p>
          </div>
        )}

        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <h3 className="font-bold mb-2 text-center">💰 Таблица выплат</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Стрит-флеш</span>
              <span className="text-secondary font-bold">x50</span>
            </div>
            <div className="flex justify-between">
              <span>Каре</span>
              <span className="text-secondary font-bold">x25</span>
            </div>
            <div className="flex justify-between">
              <span>Фулл-хаус</span>
              <span className="text-secondary font-bold">x9</span>
            </div>
            <div className="flex justify-between">
              <span>Флеш</span>
              <span className="text-secondary font-bold">x6</span>
            </div>
            <div className="flex justify-between">
              <span>Стрит</span>
              <span className="text-secondary font-bold">x4</span>
            </div>
            <div className="flex justify-between">
              <span>Тройка</span>
              <span className="text-secondary font-bold">x3</span>
            </div>
            <div className="flex justify-between">
              <span>Две пары</span>
              <span className="text-secondary font-bold">x2</span>
            </div>
            <div className="flex justify-between">
              <span>Пара</span>
              <span className="text-secondary font-bold">x1</span>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default PokerGame;
