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
  
  const [pickaxeSpinning, setPickaxeSpinning] = useState(false);
  const [currentPickaxe, setCurrentPickaxe] = useState('⛏️');
  const [blocks, setBlocks] = useState<{id: number, broken: boolean, hp: number}[]>(
    Array(9).fill(0).map((_, i) => ({ id: i, broken: false, hp: 3 }))
  );
  const [pickaxeScore, setPickaxeScore] = useState(0);
  const [pickaxeActive, setPickaxeActive] = useState(false);

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

  const startPickaxeGame = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }
    setBalance(prev => prev - bet);
    setPickaxeActive(true);
    setPickaxeScore(0);
    setBlocks(Array(9).fill(0).map((_, i) => ({ id: i, broken: false, hp: 3 })));
    spinPickaxe();
  };

  const spinPickaxe = () => {
    setPickaxeSpinning(true);
    const pickaxes = ['🪓', '⛏️', '💎'];
    let spinCount = 0;
    
    const spinInterval = setInterval(() => {
      setCurrentPickaxe(pickaxes[Math.floor(Math.random() * pickaxes.length)]);
      spinCount++;
      
      if (spinCount > 20) {
        clearInterval(spinInterval);
        const finalPickaxe = pickaxes[Math.floor(Math.random() * pickaxes.length)];
        setCurrentPickaxe(finalPickaxe);
        setPickaxeSpinning(false);
      }
    }, 100);
  };

  const smashBlock = (blockId: number) => {
    if (!pickaxeActive || pickaxeSpinning) return;
    
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.broken) return;

    let damage = 1;
    if (currentPickaxe === '⛏️') damage = 2;
    if (currentPickaxe === '💎') damage = 3;

    const newBlocks = blocks.map(b => {
      if (b.id === blockId) {
        const newHp = b.hp - damage;
        if (newHp <= 0) {
          const points = currentPickaxe === '🪓' ? 10 : currentPickaxe === '⛏️' ? 25 : 50;
          setPickaxeScore(prev => prev + points);
          toast.success(`Блок сломан! +${points} очков`);
          return { ...b, hp: 0, broken: true };
        }
        return { ...b, hp: newHp };
      }
      return b;
    });

    setBlocks(newBlocks);
    
    const allBroken = newBlocks.every(b => b.broken);
    if (allBroken) {
      const multiplier = 1 + (pickaxeScore / 100);
      const winAmount = Math.floor(bet * multiplier);
      setBalance(prev => prev + winAmount);
      toast.success(`Все блоки разбиты! Выигрыш: ${winAmount}₽`);
      setPickaxeActive(false);
    } else {
      spinPickaxe();
    }
  };

  const cashoutPickaxe = () => {
    if (!pickaxeActive) return;
    const brokenCount = blocks.filter(b => b.broken).length;
    const multiplier = 1 + (brokenCount * 0.2);
    const winAmount = Math.floor(bet * multiplier);
    setBalance(prev => prev + winAmount);
    toast.success(`Забрали выигрыш: ${winAmount}₽`);
    setPickaxeActive(false);
  };

  return (
    <Tabs defaultValue="mines" className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="mines">⛏️ Шахты</TabsTrigger>
        <TabsTrigger value="pickaxe">⚒️ Кирки</TabsTrigger>
        <TabsTrigger value="tower">🏗️ Башни</TabsTrigger>
        <TabsTrigger value="cases">📦 Кейсы</TabsTrigger>
      </TabsList>

      <TabsContent value="pickaxe">
        <Card className="p-8 card-glow bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">⚒️ Майнкрафт: Кирки</h2>
            <p className="text-muted-foreground">Крути кирку, разбивай блоки!</p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-center mb-6">
              <div className={`text-9xl ${pickaxeSpinning ? 'animate-spin-slow' : ''}`}>
                {currentPickaxe}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center p-4 bg-card rounded-lg border-2 border-border">
                <div className="text-4xl mb-2">🪓</div>
                <p className="text-sm font-semibold">Деревянная</p>
                <p className="text-xs text-muted-foreground">Урон: 1, +10 очков</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border-2 border-primary">
                <div className="text-4xl mb-2">⛏️</div>
                <p className="text-sm font-semibold">Железная</p>
                <p className="text-xs text-muted-foreground">Урон: 2, +25 очков</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border-2 border-secondary">
                <div className="text-4xl mb-2">💎</div>
                <p className="text-sm font-semibold">Алмазная</p>
                <p className="text-xs text-muted-foreground">Урон: 3, +50 очков</p>
              </div>
            </div>

            {pickaxeActive && (
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-secondary">Очки: {pickaxeScore}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Разбито блоков: {blocks.filter(b => b.broken).length} / 9
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-6">
              {blocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => smashBlock(block.id)}
                  disabled={!pickaxeActive || pickaxeSpinning || block.broken}
                  className={`aspect-square text-6xl rounded-lg border-4 transition-all ${
                    block.broken 
                      ? 'bg-muted border-muted opacity-30' 
                      : 'bg-card border-primary hover:border-secondary hover:scale-105 animate-pulse-glow'
                  } disabled:cursor-not-allowed`}
                >
                  {block.broken ? '💨' : (
                    <div className="relative">
                      <div className="text-6xl">🟫</div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-lg font-bold text-white bg-black/50 px-2 rounded">
                          {block.hp}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <Input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={pickaxeActive}
              placeholder="Ставка"
              min={1}
              max={balance}
            />
            <div className="flex gap-2">
              {!pickaxeActive ? (
                <Button onClick={startPickaxeGame} className="premium-gradient w-full h-14 text-lg">
                  Начать игру
                </Button>
              ) : (
                <Button 
                  onClick={cashoutPickaxe} 
                  disabled={blocks.filter(b => b.broken).length === 0}
                  className="premium-gradient w-full h-14 text-lg"
                >
                  Забрать выигрыш {(bet * (1 + blocks.filter(b => b.broken).length * 0.2)).toFixed(0)}₽
                </Button>
              )}
            </div>
          </div>
        </Card>
      </TabsContent>

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