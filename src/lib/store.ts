import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Game {
  id: number;
  name: string;
  enabled: boolean;
  players: number;
}

interface Bonus {
  id: number;
  name: string;
  amount: number;
  description: string;
  active: boolean;
  type: 'welcome' | 'cashback' | 'freespins' | 'custom';
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  active: boolean;
  period: 'daily' | 'weekend' | 'monthly';
}

interface AppStore {
  games: Game[];
  bonuses: Bonus[];
  promotions: Promotion[];
  toggleGame: (id: number) => void;
  updateGame: (id: number, updates: Partial<Game>) => void;
  addBonus: (bonus: Omit<Bonus, 'id'>) => void;
  updateBonus: (id: number, updates: Partial<Bonus>) => void;
  deleteBonus: (id: number) => void;
  toggleBonus: (id: number) => void;
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: number, updates: Partial<Promotion>) => void;
  deletePromotion: (id: number) => void;
  togglePromotion: (id: number) => void;
}

const defaultGames: Game[] = [
  { id: 1, name: 'Слоты - Фрукты', enabled: true, players: 45 },
  { id: 2, name: 'Слоты - Рыбка', enabled: true, players: 32 },
  { id: 3, name: 'Слоты - Собачка', enabled: true, players: 28 },
  { id: 4, name: 'Слоты - Фрукты VIP', enabled: true, players: 67 },
  { id: 5, name: 'Слоты - Рыбка VIP', enabled: true, players: 54 },
  { id: 6, name: 'Слоты - Собачка VIP', enabled: true, players: 61 },
  { id: 7, name: 'Авиатор', enabled: true, players: 124 },
  { id: 8, name: 'Авиатор 2', enabled: true, players: 98 },
  { id: 9, name: 'AviaMaster', enabled: true, players: 89 },
  { id: 10, name: 'Майнкрафт - Шахты', enabled: true, players: 56 },
  { id: 11, name: 'Майнкрафт - Кирки', enabled: true, players: 72 },
  { id: 12, name: 'Майнкрафт - Башни', enabled: true, players: 43 },
  { id: 13, name: 'Майнкрафт - Кейсы', enabled: true, players: 71 },
  { id: 14, name: 'Спорт - Футбол', enabled: true, players: 92 },
  { id: 15, name: 'Спорт - Хоккей', enabled: true, players: 78 },
  { id: 16, name: 'Рыбалка', enabled: true, players: 103 },
  { id: 17, name: 'Кости', enabled: true, players: 87 },
  { id: 18, name: 'Покер', enabled: true, players: 95 },
  { id: 19, name: 'Дартс', enabled: true, players: 76 },
  { id: 20, name: 'Сапёр', enabled: true, players: 112 },
  { id: 21, name: 'Колесо Фортуны', enabled: true, players: 134 },
];

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      games: defaultGames,
      bonuses: [
        { id: 1, name: 'Приветственный бонус', amount: 500, description: 'Для новых игроков', active: true, type: 'welcome' },
        { id: 2, name: 'Кэшбэк 5%', amount: 100, description: 'Еженедельный возврат', active: false, type: 'cashback' },
        { id: 3, name: '10 фриспинов', amount: 10, description: 'Бесплатные вращения', active: false, type: 'freespins' },
      ],
      promotions: [
        { id: 1, title: 'Счастливые часы', description: 'Удвоенные выигрыши 20:00-22:00', active: true, period: 'daily' },
        { id: 2, title: 'Турнир выходного дня', description: 'Призовой фонд 100,000₽', active: true, period: 'weekend' },
      ],
      toggleGame: (id) =>
        set((state) => ({
          games: state.games.map((game) =>
            game.id === id ? { ...game, enabled: !game.enabled } : game
          ),
        })),
      updateGame: (id, updates) =>
        set((state) => ({
          games: state.games.map((game) =>
            game.id === id ? { ...game, ...updates } : game
          ),
        })),
      addBonus: (bonus) =>
        set((state) => ({
          bonuses: [...state.bonuses, { ...bonus, id: Date.now() }],
        })),
      updateBonus: (id, updates) =>
        set((state) => ({
          bonuses: state.bonuses.map((bonus) =>
            bonus.id === id ? { ...bonus, ...updates } : bonus
          ),
        })),
      deleteBonus: (id) =>
        set((state) => ({
          bonuses: state.bonuses.filter((bonus) => bonus.id !== id),
        })),
      toggleBonus: (id) =>
        set((state) => ({
          bonuses: state.bonuses.map((bonus) =>
            bonus.id === id ? { ...bonus, active: !bonus.active } : bonus
          ),
        })),
      addPromotion: (promo) =>
        set((state) => ({
          promotions: [...state.promotions, { ...promo, id: Date.now() }],
        })),
      updatePromotion: (id, updates) =>
        set((state) => ({
          promotions: state.promotions.map((promo) =>
            promo.id === id ? { ...promo, ...updates } : promo
          ),
        })),
      deletePromotion: (id) =>
        set((state) => ({
          promotions: state.promotions.filter((promo) => promo.id !== id),
        })),
      togglePromotion: (id) =>
        set((state) => ({
          promotions: state.promotions.map((promo) =>
            promo.id === id ? { ...promo, active: !promo.active } : promo
          ),
        })),
    }),
    {
      name: 'casino-store-v2',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2 || !persistedState) {
          return {
            games: defaultGames,
            bonuses: persistedState?.bonuses || [
              { id: 1, name: 'Приветственный бонус', amount: 500, description: 'Для новых игроков', active: true, type: 'welcome' },
              { id: 2, name: 'Кэшбэк 5%', amount: 100, description: 'Еженедельный возврат', active: false, type: 'cashback' },
              { id: 3, name: '10 фриспинов', amount: 10, description: 'Бесплатные вращения', active: false, type: 'freespins' },
            ],
            promotions: persistedState?.promotions || [
              { id: 1, title: 'Счастливые часы', description: 'Удвоенные выигрыши 20:00-22:00', active: true, period: 'daily' },
              { id: 2, title: 'Турнир выходного дня', description: 'Призовой фонд 100,000₽', active: true, period: 'weekend' },
            ],
          };
        }
        
        const existingGames = persistedState?.games || [];
        const existingGameIds = new Set(existingGames.map((g: Game) => g.id));
        const newGames = defaultGames.filter(g => !existingGameIds.has(g.id));
        
        return {
          ...persistedState,
          games: [...existingGames, ...newGames],
        };
      },
    }
  )
);