import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import SlotsGame from '@/components/games/SlotsGame';
import AviatorGame from '@/components/games/AviatorGame';
import AviaMasterGame from '@/components/games/AviaMasterGame';
import MinecraftGame from '@/components/games/MinecraftGame';
import SportsGame from '@/components/games/SportsGame';
import ProfileSection from '@/components/ProfileSection';
import AdminPanel from '@/components/AdminPanel';
import LiveFeed from '@/components/LiveFeed';

const Index = () => {
  const [balance, setBalance] = useState(1000);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1247);
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');

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
          <TabsList className="grid grid-cols-8 w-full mb-6 bg-card/50 p-1 h-auto">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary">
              <Icon name="Home" className="w-4 h-4 mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="slots" className="data-[state=active]:bg-primary">
              <Icon name="Cherry" className="w-4 h-4 mr-2" />
              Слоты
            </TabsTrigger>
            <TabsTrigger value="aviator" className="data-[state=active]:bg-primary">
              <Icon name="Plane" className="w-4 h-4 mr-2" />
              Авиатор
            </TabsTrigger>
            <TabsTrigger value="minecraft" className="data-[state=active]:bg-primary">
              <Icon name="Package" className="w-4 h-4 mr-2" />
              Майнкрафт
            </TabsTrigger>
            <TabsTrigger value="sports" className="data-[state=active]:bg-primary">
              <Icon name="Trophy" className="w-4 h-4 mr-2" />
              Спорт
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
              <Icon name="User" className="w-4 h-4 mr-2" />
              Кабинет
            </TabsTrigger>
            <TabsTrigger value="bonuses" className="data-[state=active]:bg-primary">
              <Icon name="Gift" className="w-4 h-4 mr-2" />
              Бонусы
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-accent">
                <Icon name="Settings" className="w-4 h-4 mr-2" />
                Админ
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
            <SlotsGame balance={balance} setBalance={setBalance} />
          </TabsContent>

          <TabsContent value="aviator" className="animate-fade-in">
            <AviatorGame balance={balance} setBalance={setBalance} />
          </TabsContent>

          <TabsContent value="minecraft" className="animate-fade-in">
            <MinecraftGame balance={balance} setBalance={setBalance} />
          </TabsContent>

          <TabsContent value="sports" className="animate-fade-in">
            <SportsGame balance={balance} setBalance={setBalance} />
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <ProfileSection balance={balance} username={username} />
          </TabsContent>

          <TabsContent value="bonuses" className="animate-fade-in">
            <Card className="p-6 card-glow">
              <h2 className="text-2xl font-bold mb-6">🎁 Бонусы и акции</h2>
              <div className="space-y-4">
                <Card className="p-6 bg-gradient-to-r from-secondary/20 to-accent/20 border-2 border-secondary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Приветственный бонус</h3>
                      <p className="text-muted-foreground">Для новых игроков</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-secondary">500₽</p>
                      <Button className="mt-2 premium-gradient" onClick={() => {
                        setBalance(prev => prev + 500);
                        toast.success('Бонус получен!');
                      }}>
                        Получить
                      </Button>
                    </div>
                  </div>
                </Card>
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
