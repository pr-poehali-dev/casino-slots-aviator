import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface MinesGameProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

interface Cell {
  id: number;
  revealed: boolean;
  isMine: boolean;
  isDiamond: boolean;
}

const MinesGame = ({ balance, setBalance }: MinesGameProps) => {
  const [bet, setBet] = useState(10);
  const [minesCount, setMinesCount] = useState(5);
  const [gameActive, setGameActive] = useState(false);
  const [cells, setCells] = useState<Cell[]>([]);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [diamondsFound, setDiamondsFound] = useState(0);

  const startGame = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - bet);
    setGameActive(true);
    setCurrentMultiplier(1);
    setDiamondsFound(0);

    const newCells: Cell[] = Array(25).fill(0).map((_, i) => ({
      id: i,
      revealed: false,
      isMine: false,
      isDiamond: false
    }));

    const minePositions = new Set<number>();
    while (minePositions.size < minesCount) {
      minePositions.add(Math.floor(Math.random() * 25));
    }

    minePositions.forEach(pos => {
      newCells[pos].isMine = true;
    });

    newCells.forEach(cell => {
      if (!cell.isMine) {
        cell.isDiamond = true;
      }
    });

    setCells(newCells);
  };

  const revealCell = (id: number) => {
    if (!gameActive) return;

    const cell = cells[id];
    if (cell.revealed) return;

    const newCells = [...cells];
    newCells[id].revealed = true;
    setCells(newCells);

    if (cell.isMine) {
      setGameActive(false);
      newCells.forEach(c => { c.revealed = true; });
      setCells(newCells);
      toast.error(`💥 Бомба! Проигрыш ${bet}₽`);
    } else {
      const newDiamondsFound = diamondsFound + 1;
      setDiamondsFound(newDiamondsFound);
      
      const safeSpots = 25 - minesCount;
      const newMultiplier = 1 + (newDiamondsFound / safeSpots) * (minesCount * 2);
      setCurrentMultiplier(Number(newMultiplier.toFixed(2)));
      
      toast.success(`💎 Бриллант! Множитель: x${newMultiplier.toFixed(2)}`);

      if (newDiamondsFound === safeSpots) {
        cashout(newMultiplier);
      }
    }
  };

  const cashout = (multiplier?: number) => {
    if (!gameActive) return;

    const finalMultiplier = multiplier || currentMultiplier;
    const winAmount = Math.floor(bet * finalMultiplier);
    
    setBalance(prev => prev + winAmount);
    setGameActive(false);
    
    const newCells = [...cells];
    newCells.forEach(c => { c.revealed = true; });
    setCells(newCells);
    
    toast.success(`✅ Забрали выигрыш! ${winAmount}₽ (x${finalMultiplier.toFixed(2)})`);
  };

  return (
    <Card className="p-8 card-glow">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">💣 Сапёр</h2>
        <p className="text-muted-foreground">Найди бриллианты, избегай бомб!</p>
      </div>

      {gameActive && (
        <div className="text-center mb-4">
          <div className="flex justify-center gap-8">
            <div>
              <p className="text-sm text-muted-foreground">Бриллиантов найдено</p>
              <p className="text-3xl font-bold text-secondary">{diamondsFound}/{25 - minesCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Текущий множитель</p>
              <p className="text-3xl font-bold text-accent">x{currentMultiplier.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Выигрыш</p>
              <p className="text-3xl font-bold text-secondary">{Math.floor(bet * currentMultiplier)}₽</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto mb-6">
        <div className="grid grid-cols-5 gap-2">
          {cells.length > 0 ? (
            cells.map((cell) => (
              <button
                key={cell.id}
                onClick={() => revealCell(cell.id)}
                disabled={cell.revealed || !gameActive}
                className={`aspect-square flex items-center justify-center text-4xl rounded-lg border-2 transition-all ${
                  !cell.revealed
                    ? 'bg-card border-primary hover:scale-105 hover:border-secondary cursor-pointer'
                    : cell.isMine
                    ? 'bg-destructive border-destructive-foreground'
                    : 'bg-secondary/20 border-secondary'
                }`}
              >
                {cell.revealed ? (cell.isMine ? '💣' : '💎') : '❓'}
              </button>
            ))
          ) : (
            Array(25).fill(0).map((_, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center text-4xl rounded-lg border-2 border-dashed border-primary/30 bg-card/50"
              >
                ❓
              </div>
            ))
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {!gameActive ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
                <Input 
                  type="number" 
                  value={bet} 
                  onChange={(e) => setBet(Number(e.target.value))}
                  min={1}
                  max={balance}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Количество бомб</label>
                <Input 
                  type="number" 
                  value={minesCount} 
                  onChange={(e) => setMinesCount(Math.min(20, Math.max(1, Number(e.target.value))))}
                  min={1}
                  max={20}
                />
              </div>
            </div>
            
            <Button onClick={startGame} className="premium-gradient w-full h-12">
              <Icon name="Play" className="mr-2" />
              Начать игру
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBet(10)} className="flex-1">10₽</Button>
              <Button variant="outline" onClick={() => setBet(50)} className="flex-1">50₽</Button>
              <Button variant="outline" onClick={() => setBet(100)} className="flex-1">100₽</Button>
              <Button variant="outline" onClick={() => setBet(500)} className="flex-1">500₽</Button>
            </div>
          </>
        ) : (
          <Button onClick={() => cashout()} className="premium-gradient w-full h-14 text-lg">
            <Icon name="DollarSign" className="mr-2" />
            Забрать {Math.floor(bet * currentMultiplier)}₽
          </Button>
        )}

        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <h3 className="font-bold mb-2 text-center">📊 Как играть</h3>
          <div className="space-y-1 text-sm">
            <p>1️⃣ Выберите ставку и количество бомб (1-20)</p>
            <p>2️⃣ Открывайте клетки с бриллиантами 💎</p>
            <p>3️⃣ Избегайте бомб 💣 - одна бомба = проигрыш</p>
            <p>4️⃣ Чем больше бомб, тем выше множитель за каждый бриллиант</p>
            <p>5️⃣ Заберите выигрыш в любой момент или рискните найти все бриллианты!</p>
            <p className="text-accent font-bold mt-2">
              💡 Больше бомб = больше риск, но выше награда!
            </p>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default MinesGame;
