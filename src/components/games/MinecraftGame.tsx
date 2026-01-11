import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface MinecraftGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

const MinecraftGame = ({ balance, setBalance }: MinecraftGameProps) => {
  const [bet, setBet] = useState(10);
  const [minesGrid, setMinesGrid] = useState<string[]>(Array(25).fill('⬛'));
  const [minesRevealed, setMinesRevealed] = useState(0);
  const [minesActive, setMinesActive] = useState(false);
  const [towerLevel, setTowerLevel] = useState(0);
  const [towerActive, setTowerActive] = useState(false);
  const [caseOpened, setCaseOpened] = useState(false);

  const startMines = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }
    setBalance(prev => prev - bet);
    setMinesGrid(Array(25).fill('⬛'));
    setMinesRevealed(0);
    setMinesActive(true);
  };

  const clickMine = (index: number) => {
    if (!minesActive || minesGrid[index] !== '⬛') return;

    const isBomb = Math.random() < 0.2;
    const newGrid = [...minesGrid];
    newGrid[index] = isBomb ? '💣' : '💎';
    setMinesGrid(newGrid);

    if (isBomb) {
      toast.error('Бомба! Вы проиграли!');
      setMinesActive(false);
    } else {
      const newRevealed = minesRevealed + 1;
      setMinesRevealed(newRevealed);
      const multiplier = 1 + (newRevealed * 0.3);
      toast.success(`Алмаз! x${multiplier.toFixed(1)}`);
    }
  };

  const cashoutMines = () => {
    if (!minesActive) return;
    const multiplier = 1 + (minesRevealed * 0.3);
    const winAmount = Math.floor(bet * multiplier);
    setBalance(prev => prev + winAmount);
    toast.success(`Выигрыш: ${winAmount}₽`);
    setMinesActive(false);
  };

  const startTower = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }
    setBalance(prev => prev - bet);
    setTowerLevel(0);
    setTowerActive(true);
  };

  const climbTower = () => {
    const success = Math.random() > 0.3;
    if (success) {
      const newLevel = towerLevel + 1;
      setTowerLevel(newLevel);
      const multiplier = 1 + (newLevel * 0.5);
      toast.success(`Уровень ${newLevel}! x${multiplier.toFixed(1)}`);
    } else {
      toast.error('Упали! Проиграли!');
      setTowerActive(false);
    }
  };

  const cashoutTower = () => {
    if (!towerActive) return;
    const multiplier = 1 + (towerLevel * 0.5);
    const winAmount = Math.floor(bet * multiplier);
    setBalance(prev => prev + winAmount);
    toast.success(`Выигрыш: ${winAmount}₽`);
    setTowerActive(false);
  };

  const openCase = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }
    setBalance(prev => prev - bet);
    
    const rand = Math.random();
    let multiplier = 0;
    let item = '';

    if (rand < 0.01) {
      multiplier = 100;
      item = '💎 ЛЕГЕНДАРНОЕ';
    } else if (rand < 0.05) {
      multiplier = 20;
      item = '⭐ ЭПИЧЕСКОЕ';
    } else if (rand < 0.2) {
      multiplier = 5;
      item = '🔮 РЕДКОЕ';
    } else {
      multiplier = 0.5;
      item = '📦 ОБЫЧНОЕ';
    }

    const winAmount = Math.floor(bet * multiplier);
    setBalance(prev => prev + winAmount);
    setCaseOpened(true);
    
    setTimeout(() => {
      toast.success(`Выпало: ${item}! Выигрыш: ${winAmount}₽`);
      setCaseOpened(false);
    }, 2000);
  };

  return (
    <Tabs defaultValue="mines" className="w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="mines">⛏️ Шахты</TabsTrigger>
        <TabsTrigger value="tower">🏗️ Башни</TabsTrigger>
        <TabsTrigger value="cases">📦 Кейсы</TabsTrigger>
      </TabsList>

      <TabsContent value="mines">
        <Card className="p-8 card-glow">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">⛏️ Майнкрафт: Шахты</h2>
            <p className="text-muted-foreground">Найди алмазы, избегай бомб!</p>
          </div>

          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-6">
            {minesGrid.map((cell, i) => (
              <button
                key={i}
                onClick={() => clickMine(i)}
                disabled={!minesActive || cell !== '⬛'}
                className="aspect-square text-3xl bg-card border-2 border-primary rounded hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {cell}
              </button>
            ))}
          </div>

          {minesRevealed > 0 && minesActive && (
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-secondary">
                Множитель: x{(1 + minesRevealed * 0.3).toFixed(1)}
              </p>
            </div>
          )}

          <div className="max-w-md mx-auto space-y-4">
            <Input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={minesActive}
              placeholder="Ставка"
              min={1}
              max={balance}
            />
            <div className="flex gap-2">
              {!minesActive ? (
                <Button onClick={startMines} className="premium-gradient w-full">Начать игру</Button>
              ) : (
                <Button onClick={cashoutMines} disabled={minesRevealed === 0} className="premium-gradient w-full">
                  Забрать {(bet * (1 + minesRevealed * 0.3)).toFixed(0)}₽
                </Button>
              )}
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="tower">
        <Card className="p-8 card-glow">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">🏗️ Майнкрафт: Башни</h2>
            <p className="text-muted-foreground">Поднимайся выше, увеличивай выигрыш!</p>
          </div>

          <div className="max-w-md mx-auto mb-6">
            <div className="space-y-2">
              {Array.from({length: 10}, (_, i) => 9 - i).map((level) => (
                <div 
                  key={level}
                  className={`h-12 flex items-center justify-center rounded border-2 transition-all ${
                    level < towerLevel 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : level === towerLevel 
                      ? 'bg-secondary border-secondary animate-pulse-glow' 
                      : 'bg-card border-border'
                  }`}
                >
                  <span className="font-bold">Уровень {level} - x{(1 + level * 0.5).toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <Input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={towerActive}
              placeholder="Ставка"
              min={1}
              max={balance}
            />
            <div className="flex gap-2">
              {!towerActive ? (
                <Button onClick={startTower} className="premium-gradient w-full">Начать подъём</Button>
              ) : (
                <>
                  <Button onClick={climbTower} className="premium-gradient flex-1">
                    <Icon name="ArrowUp" className="mr-2" />
                    Подняться
                  </Button>
                  <Button onClick={cashoutTower} disabled={towerLevel === 0} variant="outline" className="flex-1">
                    Забрать {(bet * (1 + towerLevel * 0.5)).toFixed(0)}₽
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="cases">
        <Card className="p-8 card-glow">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">📦 Майнкрафт: Кейсы</h2>
            <p className="text-muted-foreground">Открывай кейсы, получай призы!</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className={`text-9xl ${caseOpened ? 'animate-spin-slow' : ''}`}>
              {caseOpened ? '✨' : '📦'}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-card rounded border border-muted">
                <p className="font-bold text-muted-foreground">📦 Обычное</p>
                <p className="text-xl">x0.5</p>
              </div>
              <div className="p-4 bg-card rounded border border-blue-500">
                <p className="font-bold text-blue-500">🔮 Редкое</p>
                <p className="text-xl">x5</p>
              </div>
              <div className="p-4 bg-card rounded border border-purple-500">
                <p className="font-bold text-purple-500">⭐ Эпическое</p>
                <p className="text-xl">x20</p>
              </div>
              <div className="p-4 bg-card rounded border border-secondary">
                <p className="font-bold text-secondary">💎 Легендарное</p>
                <p className="text-xl">x100</p>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <Input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={caseOpened}
              placeholder="Ставка"
              min={1}
              max={balance}
            />
            <Button onClick={openCase} disabled={caseOpened} className="premium-gradient w-full h-14 text-lg">
              {caseOpened ? 'Открываем...' : 'Открыть кейс'}
            </Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MinecraftGame;
