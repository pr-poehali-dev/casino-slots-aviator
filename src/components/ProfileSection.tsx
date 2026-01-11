import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ProfileSectionProps {
  balance: number;
  username: string;
}

const ProfileSection = ({ balance, username }: ProfileSectionProps) => {
  const stats = [
    { label: 'Всего ставок', value: '127', icon: 'TrendingUp' },
    { label: 'Выигрышей', value: '68', icon: 'Trophy' },
    { label: 'Проигрышей', value: '59', icon: 'TrendingDown' },
    { label: 'Лучший выигрыш', value: '15,000₽', icon: 'Award' },
  ];

  const history = [
    { game: '🎰 Слоты', result: '+500₽', time: '10 мин назад', win: true },
    { game: '✈️ Авиатор', result: '-100₽', time: '25 мин назад', win: false },
    { game: '⛏️ Шахты', result: '+1,200₽', time: '1 час назад', win: true },
    { game: '📦 Кейсы', result: '-50₽', time: '2 часа назад', win: false },
    { game: '⚽ Футбол', result: '+800₽', time: '3 часа назад', win: true },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 card-glow">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-muted-foreground">ID: {Math.floor(Math.random() * 100000)}</p>
          </div>
          <Badge className="text-lg px-4 py-2 premium-gradient">VIP</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="p-4 text-center">
              <Icon name={stat.icon as any} className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 card-glow">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="History" className="text-primary" />
          История игр
        </h3>
        <div className="space-y-3">
          {history.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-card rounded border border-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.game.split(' ')[0]}</span>
                <div>
                  <p className="font-semibold">{item.game}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <div className={`font-bold text-lg ${item.win ? 'text-secondary' : 'text-destructive'}`}>
                {item.result}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 card-glow">
        <h3 className="text-xl font-bold mb-4">⚙️ Настройки</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Bell" className="mr-2" />
            Уведомления
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Lock" className="mr-2" />
            Безопасность
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="CreditCard" className="mr-2" />
            Платежи
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive">
            <Icon name="LogOut" className="mr-2" />
            Выйти
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;
