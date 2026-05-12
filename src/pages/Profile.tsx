import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const ALL_ACHIEVEMENTS = [
  { code: 'newcomer', name: 'Новичок', icon: '👋', description: 'Зарегистрировался на платформе', points: 5 },
  { code: 'first_post', name: 'Первый пост', icon: '✍️', description: 'Написал первую тему на форуме', points: 10 },
  { code: 'active', name: 'Активный', icon: '⚡', description: '10 постов на форуме', points: 20 },
  { code: 'veteran', name: 'Ветеран', icon: '🏆', description: '50 постов на форуме', points: 50 },
  { code: 'scripter', name: 'Скриптер', icon: '🔧', description: 'Загрузил первый скрипт или мод', points: 30 },
  { code: 'popular', name: 'Популярный', icon: '🌟', description: 'Скрипт набрал 100 скачиваний', points: 50 },
  { code: 'vip', name: 'VIP', icon: '👑', description: 'Оформил VIP подписку', points: 100 },
  { code: 'helper', name: 'Помощник', icon: '🛡️', description: 'Ответил на 20 вопросов', points: 40 },
];

export default function Profile() {
  const { user, refresh } = useAuth();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await authApi.updateProfile({ bio });
    await refresh();
    setSaving(false);
    setEditing(false);
  };

  if (!user) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 80, color: 'hsl(var(--dayz-text-muted))' }}>
          <Icon name="User" size={40} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
          <div style={{ fontSize: 18, marginBottom: 12, color: 'white' }}>Войдите в аккаунт</div>
          <p>Чтобы просматривать профиль</p>
        </div>
      </Layout>
    );
  }

  const earnedCodes = new Set(user.achievements?.map(a => a.code) || []);
  const totalPoints = user.achievements?.reduce((s, a) => s + a.points, 0) || 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4" style={{ padding: '32px 16px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 24, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'hsl(var(--dayz-green) / 0.1)', border: '2px solid hsl(var(--dayz-green) / 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 28, color: 'hsl(var(--dayz-green-bright))' }}>
                {user.username[0].toUpperCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: 'white' }}>{user.username}</span>
                {user.is_vip && <span className="badge-gold">VIP</span>}
                {user.is_admin && <span className="badge-green">ADMIN</span>}
              </div>
              <div style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 16 }}>{user.email}</div>

              {editing ? (
                <div>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Расскажите о себе..."
                    style={{ width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-green))', borderRadius: 2, padding: '8px 10px', color: 'white', fontSize: 13, outline: 'none', resize: 'none', marginBottom: 10, fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)', border: 'none', borderRadius: 2, padding: '7px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Oswald', sans-serif" }}>
                      {saving ? '...' : 'СОХРАНИТЬ'}
                    </button>
                    <button onClick={() => setEditing(false)} style={{ flex: 1, background: 'hsl(var(--dayz-surface-raised))', color: 'hsl(var(--dayz-text-muted))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, padding: '7px', fontSize: 12, cursor: 'pointer' }}>
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: 'hsl(var(--dayz-text-muted))', marginBottom: 14, fontStyle: 'italic', lineHeight: 1.5 }}>
                    {user.bio || 'Нет описания'}
                  </div>
                  <button onClick={() => setEditing(true)} style={{ background: 'hsl(var(--dayz-surface-raised))', border: '1px solid hsl(var(--dayz-border))', color: 'hsl(var(--dayz-text-muted))', borderRadius: 2, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: "'Golos Text', sans-serif" }}>
                    Редактировать профиль
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div style={{ background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 20 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, color: 'hsl(var(--dayz-green-bright))', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Статистика</div>
              {[
                { label: 'Репутация', value: user.reputation, icon: 'TrendingUp' },
                { label: 'Очков за достижения', value: totalPoints, icon: 'Trophy' },
                { label: 'Достижений', value: `${user.achievements?.length || 0} / ${ALL_ACHIEVEMENTS.length}`, icon: 'Award' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid hsl(var(--dayz-border))' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'hsl(var(--dayz-text-muted))' }}>
                    <Icon name={s.icon} size={13} />
                    {s.label}
                  </div>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: 'white', fontSize: 15 }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 16 }}>
              {[
                { icon: 'Mail', label: 'Мои сообщения', to: '/messages' },
                { icon: 'Code2', label: 'Мои скрипты', to: '/scripts' },
                { icon: 'Server', label: 'Мои серверы', to: '/servers' },
                { icon: 'MessageSquare', label: 'Форум', to: '/forum' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid hsl(var(--dayz-border))' : 'none', color: 'hsl(var(--dayz-text))', textDecoration: 'none', fontSize: 13 }}
                  onMouseEnter={e => (e.currentTarget).style.color = 'hsl(var(--dayz-green-bright))'}
                  onMouseLeave={e => (e.currentTarget).style.color = 'hsl(var(--dayz-text))'}
                >
                  <Icon name={l.icon} size={13} style={{ color: 'hsl(var(--dayz-text-muted))' }} />
                  {l.label}
                  <Icon name="ChevronRight" size={11} style={{ marginLeft: 'auto', color: 'hsl(var(--dayz-text-muted))' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-2" id="achievements">
            <div style={{ background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Icon name="Trophy" size={18} style={{ color: 'hsl(35 90% 55%)' }} />
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Достижения</span>
                <span style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))' }}>{user.achievements?.length || 0}/{ALL_ACHIEVEMENTS.length}</span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 6 }}>
                  <span>Прогресс</span>
                  <span>{Math.round(((user.achievements?.length || 0) / ALL_ACHIEVEMENTS.length) * 100)}%</span>
                </div>
                <div style={{ height: 6, background: 'hsl(var(--dayz-bg))', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((user.achievements?.length || 0) / ALL_ACHIEVEMENTS.length) * 100}%`, background: 'hsl(var(--dayz-green))', borderRadius: 3, transition: 'width 0.5s ease' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ALL_ACHIEVEMENTS.map(ach => {
                  const earned = earnedCodes.has(ach.code);
                  return (
                    <div key={ach.code} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: earned ? 'hsl(var(--dayz-green) / 0.06)' : 'hsl(var(--dayz-bg))', border: `1px solid ${earned ? 'hsl(var(--dayz-green) / 0.3)' : 'hsl(var(--dayz-border))'}`, borderRadius: 4, opacity: earned ? 1 : 0.45, position: 'relative' }}>
                      <div style={{ fontSize: 28, flexShrink: 0 }}>{ach.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: earned ? 'white' : 'hsl(var(--dayz-text-muted))', fontSize: 13, marginBottom: 2 }}>{ach.name}</div>
                        <div style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', lineHeight: 1.3 }}>{ach.description}</div>
                        <div style={{ fontSize: 11, color: earned ? 'hsl(var(--dayz-green-bright))' : 'hsl(var(--dayz-text-muted))', marginTop: 4, fontWeight: 600 }}>+{ach.points} очков</div>
                      </div>
                      {!earned && <Icon name="Lock" size={14} style={{ color: 'hsl(var(--dayz-text-muted))', position: 'absolute', top: 8, right: 8 }} />}
                      {earned && <Icon name="CheckCircle" size={14} style={{ color: 'hsl(var(--dayz-green-bright))', position: 'absolute', top: 8, right: 8 }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VIP block */}
            {!user.is_vip && (
              <div style={{ marginTop: 16, background: 'linear-gradient(135deg, hsl(35 70% 12%), hsl(220 18% 11%))', border: '1px solid hsl(35 90% 40% / 0.4)', borderRadius: 4, padding: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <Icon name="Crown" size={32} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, color: 'white', textTransform: 'uppercase', marginBottom: 4 }}>Получите VIP подписку</div>
                  <div style={{ fontSize: 13, color: 'hsl(var(--dayz-text-muted))' }}>Доступ ко всем скриптам, приоритетная поддержка и достижение VIP</div>
                </div>
                <Link to="/vip" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a0f00', padding: '10px 20px', borderRadius: 2, fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.05em', flexShrink: 0 }}>
                  Оформить VIP
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
