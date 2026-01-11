import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import SlotsGame from '@/components/games/SlotsGame';
import AviatorGame from '@/components/games/AviatorGame';
import Aviator2Game from '@/components/games/Aviator2Game';
import AviaMasterGame from '@/components/games/AviaMasterGame';
import MinecraftGame from '@/components/games/MinecraftGame';
import SportsGame from '@/components/games/SportsGame';
import FishingGame from '@/components/games/FishingGame';
import DiceGame from '@/components/games/DiceGame';
import PokerGame from '@/components/games/PokerGame';
import DartsGame from '@/components/games/DartsGame';
import MinesGame from '@/components/games/MinesGame';
import WheelGame from '@/components/games/WheelGame';
import ProfileSection from '@/components/ProfileSection';
import AdminPanel from '@/components/AdminPanel';
import LiveFeed from '@/components/LiveFeed';

const Index = () => {
  const { games, bonuses, promotions } = useAppStore();
  const [balance, setBalance] = useState(1000);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1247);
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [claimedBonuses, setClaimedBonuses] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDeposit = () => {
    const amount = prompt('Введите сумму пополнения (₽):');
    if (amount && !isNaN(Number(amount))) {
      setBalance(prev => prev + Number(amount));
      toast.success(`Баланс пополнен на ${amount}₽`);
    }
  };

  const handleLogin = () => {
    const user = prompt('Введите имя пользователя:');
    const pass = prompt('Введите пароль:');
    
    if (user && pass) {
      if (user === 'admin' && pass === 'admin123') {
        setIsAdmin(true);
        setUsername('Администратор');
        toast.success('Вход выполнен как администратор');
      } else {
        setUsername(user);
        toast.success('Добро пожаловать!');
      }
      setIsLoggedIn(true);
      setShowLogin(false);
      setBalance(1500);
    }
  };

  const handleRegister = () => {
    const user = prompt('Придумайте имя пользователя:');
    const email = prompt('Введите email:');
    const pass = prompt('Придумайте пароль:');
    
    if (user && email && pass) {
      setUsername(user);
      setIsLoggedIn(true);
      setShowLogin(false);
      setBalance(2000);
      toast.success('Регистрация успешна! Бонус 500₽ зачислен!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <Card className="w-full max-w-md p-8 card-glow animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 premium-gradient bg-clip-text text-transparent gold-glow">
              PREMIUM CASINO
            </h1>
            <p className="text-muted-foreground">Роскошное игровое пространство</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full h-12 text-lg premium-gradient hover:opacity-90 transition-opacity"
            >
              <Icon name="LogIn" className="mr-2" />
              Войти
            </Button>
            
            <Button 
              onClick={handleRegister}
              variant="outline"
              className="w-full h-12 text-lg border-2 border-secondary hover:bg-secondary/10"
            >
              <Icon name="UserPlus" className="mr-2" />
              Регистрация
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>🎁 Приветственный бонус 500₽</p>
            <p className="mt-2">👥 Онлайн: {onlineCount}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold premium-gradient bg-clip-text text-transparent">
                PREMIUM CASINO
              </h1>
              <Badge variant="secondary" className="animate-pulse-glow">
                <Icon name="Users" className="w-3 h-3 mr-1" />
                {onlineCount}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border card-glow">
                <Icon name="Coins" className="w-5 h-5 text-secondary" />
                <span className="font-bold text-lg">{balance.toLocaleString()}₽</span>
              </div>
              
              <Button onClick={handleDeposit} className="premium-gradient">
                <Icon name="Plus" className="mr-2" />
                Пополнить
              </Button>

              <Button variant="ghost" onClick={() => setActiveTab('profile')}>
                <Icon name="User" className="mr-2" />
                {username}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-15 w-full mb-6 bg-card/50 p-1 h-auto gap-1">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Home" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="slots" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Cherry" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Слоты</span>
            </TabsTrigger>
            <TabsTrigger value="aviator" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Plane" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Авиатор</span>
            </TabsTrigger>
            <TabsTrigger value="aviator2" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Rocket" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Авиатор 2</span>
            </TabsTrigger>
            <TabsTrigger value="minecraft" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Package" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Майнкрафт</span>
            </TabsTrigger>
            <TabsTrigger value="sports" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Trophy" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Спорт</span>
            </TabsTrigger>
            <TabsTrigger value="fishing" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Fish" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Рыбалка</span>
            </TabsTrigger>
            <TabsTrigger value="dice" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <span className="text-sm md:text-base">🎲</span>
              <span className="hidden md:inline ml-1">Кости</span>
            </TabsTrigger>
            <TabsTrigger value="poker" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <span className="text-sm md:text-base">🃏</span>
              <span className="hidden md:inline ml-1">Покер</span>
            </TabsTrigger>
            <TabsTrigger value="darts" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Target" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Дартс</span>
            </TabsTrigger>
            <TabsTrigger value="mines" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Bomb" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Сапёр</span>
            </TabsTrigger>
            <TabsTrigger value="wheel" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Circle" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Колесо</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="User" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Кабинет</span>
            </TabsTrigger>
            <TabsTrigger value="bonuses" className="data-[state=active]:bg-primary text-xs md:text-sm">
              <Icon name="Gift" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Бонусы</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-accent text-xs md:text-sm">
                <Icon name="Settings" className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Админ</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card className="p-6 card-glow bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20">
                  <h2 className="text-3xl font-bold mb-4 gold-glow">🎰 Добро пожаловать в Premium Casino!</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Испытайте удачу в лучших играх с премиальным сервисом
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <Button onClick={() => setActiveTab('slots')} className="h-20 premium-gradient">
                      <div className="text-center">
                        <Icon name="Cherry" className="w-8 h-8 mx-auto mb-1" />
                        <span>Слоты</span>
                      </div>
                    </Button>
                    <Button onClick={() => setActiveTab('aviator')} className="h-20 premium-gradient">
                      <div className="text-center">
                        <Icon name="Plane" className="w-8 h-8 mx-auto mb-1" />
                        <span>Авиатор</span>
                      </div>
                    </Button>
                    <Button onClick={() => setActiveTab('minecraft')} className="h-20 premium-gradient">
                      <div className="text-center">
                        <Icon name="Package" className="w-8 h-8 mx-auto mb-1" />
                        <span>Майнкрафт</span>
                      </div>
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 card-glow">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="TrendingUp" className="text-secondary" />
                    Популярные игры
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Фрукты', 'Рыбка', 'Собачка', 'Фрукты VIP'].map((game, i) => (
                      <Card key={i} className="p-4 hover:scale-105 transition-transform cursor-pointer" onClick={() => setActiveTab('slots')}>
                        <div className="text-4xl mb-2 text-center">🎰</div>
                        <p className="text-center font-semibold">{game}</p>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <LiveFeed />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="slots" className="animate-fade-in">
            {games.find(g => g.name.includes('Слоты'))?.enabled ? (
              <SlotsGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Слоты отключены администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="aviator" className="animate-fade-in">
            {games.find(g => g.name === 'Авиатор')?.enabled ? (
              <AviatorGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Авиатор отключён администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="aviator2" className="animate-fade-in">
            {games.find(g => g.name === 'Авиатор 2')?.enabled ? (
              <Aviator2Game balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Авиатор 2 отключён администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="minecraft" className="animate-fade-in">
            {games.find(g => g.name.includes('Майнкрафт'))?.enabled ? (
              <MinecraftGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Майнкрафт отключён администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sports" className="animate-fade-in">
            {games.find(g => g.name.includes('Спорт'))?.enabled ? (
              <SportsGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Ставки на спорт отключены администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="fishing" className="animate-fade-in">
            {games.find(g => g.name === 'Рыбалка')?.enabled ? (
              <FishingGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Рыбалка отключена администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dice" className="animate-fade-in">
            {games.find(g => g.name === 'Кости')?.enabled ? (
              <DiceGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Кости отключены администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="poker" className="animate-fade-in">
            {games.find(g => g.name === 'Покер')?.enabled ? (
              <PokerGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Покер отключён администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="darts" className="animate-fade-in">
            {games.find(g => g.name === 'Дартс')?.enabled ? (
              <DartsGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Дартс отключён администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="mines" className="animate-fade-in">
            {games.find(g => g.name === 'Сапёр')?.enabled ? (
              <MinesGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Сапёр отключён администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wheel" className="animate-fade-in">
            {games.find(g => g.name === 'Колесо Фортуны')?.enabled ? (
              <WheelGame balance={balance} setBalance={setBalance} />
            ) : (
              <Card className="p-12 card-glow text-center">
                <Icon name="Lock" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">Игра временно недоступна</h3>
                <p className="text-muted-foreground">Колесо Фортуны отключено администратором</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <ProfileSection balance={balance} username={username} />
          </TabsContent>

          <TabsContent value="bonuses" className="animate-fade-in">
            <Card className="p-6 card-glow">
              <h2 className="text-2xl font-bold mb-6">🎁 Бонусы и акции</h2>
              
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-bold">Активные бонусы</h3>
                {bonuses.filter(b => b.active).map(bonus => (
                  <Card key={bonus.id} className="p-6 bg-gradient-to-r from-secondary/20 to-accent/20 border-2 border-secondary">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{bonus.name}</h3>
                        <p className="text-muted-foreground">{bonus.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-secondary">
                          {bonus.type === 'freespins' ? `${bonus.amount} спинов` : `${bonus.amount}₽`}
                        </p>
                        <Button 
                          className="mt-2 premium-gradient" 
                          disabled={claimedBonuses.includes(bonus.id)}
                          onClick={() => {
                            setBalance(prev => prev + bonus.amount);
                            setClaimedBonuses(prev => [...prev, bonus.id]);
                            toast.success(`Бонус "${bonus.name}" получен!`);
                          }}
                        >
                          {claimedBonuses.includes(bonus.id) ? 'Получен' : 'Получить'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {bonuses.filter(b => b.active).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Нет активных бонусов</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Активные акции</h3>
                {promotions.filter(p => p.active).map(promo => (
                  <Card key={promo.id} className="p-6 bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-bold mb-2">{promo.title}</h4>
                        <p className="text-muted-foreground">{promo.description}</p>
                        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground">
                          {promo.period === 'daily' ? '📅 Ежедневно' :
                           promo.period === 'weekend' ? '🎉 Выходные' : '📆 Ежемесячно'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
                {promotions.filter(p => p.active).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Нет активных акций</p>
                )}
              </div>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="animate-fade-in">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;