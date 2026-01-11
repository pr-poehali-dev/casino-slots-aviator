import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [games, setGames] = useState([
    { id: 1, name: 'Слоты - Фрукты', enabled: true, players: 45 },
    { id: 2, name: 'Слоты - Рыбка', enabled: true, players: 32 },
    { id: 3, name: 'Слоты - Собачка', enabled: true, players: 28 },
    { id: 4, name: 'Слоты - Фрукты VIP', enabled: true, players: 67 },
    { id: 5, name: 'Авиатор', enabled: true, players: 124 },
    { id: 6, name: 'AviaMaster', enabled: true, players: 89 },
    { id: 7, name: 'Майнкрафт - Шахты', enabled: true, players: 56 },
    { id: 8, name: 'Майнкрафт - Башни', enabled: true, players: 43 },
    { id: 9, name: 'Майнкрафт - Кейсы', enabled: true, players: 71 },
    { id: 10, name: 'Спорт - Футбол', enabled: true, players: 92 },
    { id: 11, name: 'Спорт - Хоккей', enabled: true, players: 78 },
  ]);

  const [users, setUsers] = useState([
    { id: 1, username: 'Player123', balance: 5000, status: 'active' },
    { id: 2, username: 'Lucky777', balance: 12500, status: 'active' },
    { id: 3, username: 'Winner456', balance: 3200, status: 'active' },
    { id: 4, username: 'Gamer999', balance: 8900, status: 'blocked' },
  ]);

  const toggleGame = (id: number) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, enabled: !game.enabled } : game
    ));
    toast.success('Статус игры изменён');
  };

  const blockUser = (id: number) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } : user
    ));
    toast.success('Статус пользователя изменён');
  };

  const stats = [
    { label: 'Всего игроков', value: '1,247', icon: 'Users', color: 'text-primary' },
    { label: 'Активных игр', value: games.filter(g => g.enabled).length.toString(), icon: 'Gamepad2', color: 'text-secondary' },
    { label: 'Оборот за день', value: '₽2,450,000', icon: 'TrendingUp', color: 'text-accent' },
    { label: 'Прибыль', value: '₽450,000', icon: 'DollarSign', color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 card-glow bg-gradient-to-br from-accent/20 to-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">🛠️ Панель администратора</h2>
            <p className="text-muted-foreground">Управление казино</p>
          </div>
          <Icon name="ShieldCheck" className="w-12 h-12 text-accent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="p-4">
              <Icon name={stat.icon as any} className={`w-6 h-6 mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="games" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="games">
            <Icon name="Gamepad2" className="w-4 h-4 mr-2" />
            Игры
          </TabsTrigger>
          <TabsTrigger value="users">
            <Icon name="Users" className="w-4 h-4 mr-2" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Icon name="Settings" className="w-4 h-4 mr-2" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games">
          <Card className="p-6 card-glow">
            <h3 className="text-xl font-bold mb-4">Управление играми</h3>
            <div className="space-y-3">
              {games.map(game => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-card rounded border border-border">
                  <div className="flex items-center gap-4">
                    <Switch 
                      checked={game.enabled}
                      onCheckedChange={() => toggleGame(game.id)}
                    />
                    <div>
                      <p className="font-semibold">{game.name}</p>
                      <p className="text-sm text-muted-foreground">Игроков: {game.players}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {game.enabled ? (
                      <span className="text-sm text-secondary font-semibold">Включена</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Отключена</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6 card-glow">
            <h3 className="text-xl font-bold mb-4">Управление пользователями</h3>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-card rounded border border-border">
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-muted-foreground">Баланс: {user.balance}₽</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${user.status === 'active' ? 'text-secondary' : 'text-destructive'}`}>
                      {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </span>
                    <Button 
                      variant={user.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => blockUser(user.id)}
                    >
                      {user.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6 card-glow">
            <h3 className="text-xl font-bold mb-4">Общие настройки</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Минимальная ставка (₽)</label>
                <Input type="number" defaultValue={10} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Максимальная ставка (₽)</label>
                <Input type="number" defaultValue={10000} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Процент удержания (%)</label>
                <Input type="number" defaultValue={5} step={0.1} />
              </div>

              <div className="flex items-center justify-between p-4 bg-card rounded border border-border">
                <div>
                  <p className="font-semibold">Режим обслуживания</p>
                  <p className="text-sm text-muted-foreground">Закрыть доступ к казино</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 bg-card rounded border border-border">
                <div>
                  <p className="font-semibold">Приветственный бонус</p>
                  <p className="text-sm text-muted-foreground">Новым игрокам</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="w-full premium-gradient" onClick={() => toast.success('Настройки сохранены!')}>
                <Icon name="Save" className="mr-2" />
                Сохранить изменения
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
