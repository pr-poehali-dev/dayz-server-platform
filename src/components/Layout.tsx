import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';
import AuthModal from '@/components/AuthModal';

const NAV_ITEMS = [
  {
    label: 'Обзор', icon: 'Menu', color: '#aaa',
    items: [
      { icon: 'LayoutDashboard', label: 'Главная', to: '/' },
      { icon: 'Info', label: 'О платформе', to: '/' },
    ],
  },
  {
    label: 'Активность', icon: 'Zap', color: '#f87171',
    items: [
      { icon: 'Activity', label: 'Лента активности', to: '/forum' },
      { icon: 'TrendingUp', label: 'Популярное', to: '/scripts?sort=popular' },
    ],
  },
  {
    label: 'Поддержка', icon: 'HeartHandshake', color: '#f87171',
    items: [
      { icon: 'HelpCircle', label: 'FAQ сайта', to: '/forum?category=3' },
      { icon: 'Scale', label: 'Арбитраж', to: '/forum?category=3' },
      { icon: 'Send', label: 'Обратная связь', to: '/messages' },
      { icon: 'Star', label: 'Отзыв', to: '/forum' },
    ],
  },
  {
    label: 'Торговая площадка', icon: 'LayoutGrid', color: '#4ade80',
    items: [
      { icon: 'Store', label: 'Все скрипты', to: '/scripts' },
      { icon: 'Code2', label: 'Только скрипты', to: '/scripts?type=script' },
      { icon: 'Package', label: 'Только моды', to: '/scripts?type=mod' },
      { icon: 'Crown', label: 'VIP подписка', to: '/vip' },
    ],
  },
  {
    label: 'Топ сервера', icon: 'Monitor', color: '#c084fc',
    items: [
      { icon: 'Trophy', label: 'Топ серверов DAYZ 👑', to: '/servers' },
      { icon: 'Megaphone', label: 'Реклама вашего сервера', to: '/servers/add' },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(var(--dayz-bg))', fontFamily: "'Golos Text', sans-serif" }}>
      {/* TOP BAR */}
      <div style={{ background: 'hsl(220 20% 6%)', borderBottom: '1px solid hsl(var(--dayz-border))' }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-9 gap-4">
          <span style={{ color: 'hsl(var(--dayz-text-muted))', fontSize: 12 }}>
            Платформа для администраторов DayZ
          </span>
          <div className="flex-1" />
          {!loading && !user && (
            <>
              <button onClick={() => setAuthModal('login')} style={{ color: 'hsl(var(--dayz-text-muted))', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>Войти</button>
              <button onClick={() => setAuthModal('register')} style={{ color: 'hsl(var(--dayz-green-bright))', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Регистрация</button>
            </>
          )}
          {user && (
            <span style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))' }}>
              Привет, <span style={{ color: 'hsl(var(--dayz-green-bright))' }}>{user.username}</span>
              {user.is_vip && ' 👑'}
            </span>
          )}
        </div>
      </div>

      {/* NAVBAR */}
      <nav style={{ background: 'hsl(220 18% 9%)', borderBottom: '2px solid hsl(220 15% 15%)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
          <Link to="/" className="flex items-center gap-2 mr-6 flex-shrink-0" style={{ textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'hsl(var(--dayz-green) / 0.1)', border: '1px solid hsl(var(--dayz-green) / 0.4)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Crosshair" size={18} style={{ color: 'hsl(var(--dayz-green-bright))' }} />
            </div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: 'white', letterSpacing: '0.05em' }}>
              DAYZ<span style={{ color: 'hsl(var(--dayz-green-bright))' }}>HUB</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center flex-1">
            {NAV_ITEMS.map((item, i) => (
              <div key={i} className="relative h-12 flex items-center"
                onMouseEnter={() => setActiveDropdown(i)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`nav-btn${activeDropdown === i ? ' active' : ''}`}>
                  <Icon name={item.icon} size={13} style={{ color: item.color }} />
                  {item.label}
                  <Icon name="ChevronDown" size={11} style={{ color: 'hsl(var(--dayz-text-muted))' }} />
                </button>
                {activeDropdown === i && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, minWidth: 220,
                    background: 'hsl(220 20% 12%)', border: '1px solid hsl(var(--dayz-border))',
                    borderTop: '2px solid hsl(var(--dayz-green))', zIndex: 1000, padding: '4px 0',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                  }}>
                    {item.items.map((sub, j) => (
                      <Link key={j} to={sub.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, color: 'hsl(var(--dayz-text))', textDecoration: 'none', fontFamily: "'Golos Text', sans-serif" }}
                        onMouseEnter={e => { (e.currentTarget).style.background = 'hsl(var(--dayz-surface-raised))'; (e.currentTarget).style.color = 'hsl(var(--dayz-green-bright))'; }}
                        onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'hsl(var(--dayz-text))'; }}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Icon name={sub.icon} size={13} style={{ color: 'hsl(var(--dayz-text-muted))', flexShrink: 0 }} />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            {user && (
              <>
                <Link to="/messages" style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', color: 'hsl(var(--dayz-text-muted))', textDecoration: 'none', borderRadius: 2 }}
                  onMouseEnter={e => (e.currentTarget).style.color = 'hsl(var(--dayz-green-bright))'}
                  onMouseLeave={e => (e.currentTarget).style.color = 'hsl(var(--dayz-text-muted))'}
                >
                  <Icon name="Mail" size={16} />
                </Link>
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px',
                    background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))',
                    borderRadius: 2, cursor: 'pointer', color: 'white', fontSize: 13,
                    fontFamily: "'Golos Text', sans-serif"
                  }}>
                    <Icon name="User" size={14} style={{ color: 'hsl(var(--dayz-green))' }} />
                    {user.username}
                    {user.is_vip && <span style={{ fontSize: 12 }}>👑</span>}
                  </button>
                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute', top: '110%', right: 0, minWidth: 180,
                      background: 'hsl(220 20% 12%)', border: '1px solid hsl(var(--dayz-border))',
                      borderTop: '2px solid hsl(var(--dayz-green))', zIndex: 1000, padding: '4px 0',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}>
                      {[
                        { icon: 'User', label: 'Мой профиль', to: '/profile' },
                        { icon: 'Code2', label: 'Мои скрипты', to: '/scripts?my=1' },
                        { icon: 'Server', label: 'Мои серверы', to: '/servers?my=1' },
                        { icon: 'Mail', label: 'Сообщения', to: '/messages' },
                        { icon: 'Trophy', label: 'Достижения', to: '/profile#achievements' },
                      ].map((m, i) => (
                        <Link key={i} to={m.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', fontSize: 13, color: 'hsl(var(--dayz-text))', textDecoration: 'none' }}
                          onMouseEnter={e => { (e.currentTarget).style.background = 'hsl(var(--dayz-surface-raised))'; (e.currentTarget).style.color = 'hsl(var(--dayz-green-bright))'; }}
                          onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'hsl(var(--dayz-text))'; }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Icon name={m.icon} size={13} style={{ color: 'hsl(var(--dayz-text-muted))', flexShrink: 0 }} />
                          {m.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid hsl(var(--dayz-border))', margin: '4px 0' }} />
                      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', fontSize: 13, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: "'Golos Text', sans-serif" }}>
                        <Icon name="LogOut" size={13} style={{ color: '#f87171' }} />
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {!loading && !user && (
              <button onClick={() => setAuthModal('login')} style={{
                background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)',
                border: 'none', padding: '5px 14px', borderRadius: 2, fontSize: 13,
                fontWeight: 700, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em'
              }}>ВОЙТИ</button>
            )}
          </div>

          <button className="md:hidden ml-auto" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>

        {/* Mobile */}
        {mobileOpen && (
          <div style={{ background: 'hsl(220 20% 10%)', borderTop: '1px solid hsl(var(--dayz-border))', padding: '8px 0', maxHeight: '80vh', overflowY: 'auto' }}>
            {NAV_ITEMS.map((item, i) => (
              <div key={i}>
                <div style={{ padding: '6px 16px', color: 'hsl(var(--dayz-green-bright))', fontSize: 11, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{item.label}</div>
                {item.items.map((sub, j) => (
                  <Link key={j} to={sub.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 24px', fontSize: 13, color: 'hsl(var(--dayz-text))', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                    <Icon name={sub.icon} size={13} style={{ color: 'hsl(var(--dayz-text-muted))' }} />
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
            <div style={{ padding: '8px 16px', borderTop: '1px solid hsl(var(--dayz-border))' }}>
              {user ? (
                <button onClick={handleLogout} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: "'Golos Text', sans-serif" }}>Выйти</button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => { setAuthModal('login'); setMobileOpen(false); }} style={{ color: 'hsl(var(--dayz-green-bright))', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Войти</button>
                  <button onClick={() => { setAuthModal('register'); setMobileOpen(false); }} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Регистрация</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main>
        {children}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid hsl(var(--dayz-border))', background: 'hsl(220 20% 6%)', padding: '28px 0 16px', marginTop: 60 }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 6 }}>
                DAYZ<span style={{ color: 'hsl(var(--dayz-green-bright))' }}>HUB</span>
              </div>
              <p style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', lineHeight: 1.6 }}>Платформа для администраторов серверов DayZ.</p>
            </div>
            {[
              { title: 'Каталог', links: [['Скрипты', '/scripts'], ['Моды', '/scripts?type=mod'], ['VIP', '/vip']] },
              { title: 'Сообщество', links: [['Форум', '/forum'], ['Профиль', '/profile'], ['Сообщения', '/messages']] },
              { title: 'Серверы', links: [['Топ серверов', '/servers'], ['Добавить сервер', '/servers/add']] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 600, color: 'hsl(var(--dayz-green-bright))', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{col.title}</div>
                {col.links.map(([label, to], j) => (
                  <Link key={j} to={to} style={{ display: 'block', fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget).style.color = 'white'}
                    onMouseLeave={e => (e.currentTarget).style.color = 'hsl(var(--dayz-text-muted))'}
                  >{label}</Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid hsl(var(--dayz-border))', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>© 2024 DayZ HUB. Не является официальным ресурсом Bohemia Interactive.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(var(--dayz-green-bright))' }} />
              <span style={{ fontSize: 11, color: 'hsl(var(--dayz-green-bright))' }}>Все системы работают</span>
            </div>
          </div>
        </div>
      </footer>

      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
    </div>
  );
}