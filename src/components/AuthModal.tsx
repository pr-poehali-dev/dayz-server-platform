import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

interface Props {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitch: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ mode, onClose, onSwitch }: Props) {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ login: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let result;
    if (mode === 'login') {
      result = await login(form.login, form.password);
    } else {
      result = await register(form.username, form.email, form.password);
    }
    setLoading(false);
    if (result.error) setError(result.error);
    else onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 420, background: 'hsl(220 20% 12%)', border: '1px solid hsl(var(--dayz-border))', borderTop: '2px solid hsl(var(--dayz-green))', borderRadius: 4, padding: 32, margin: 16 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'hsl(var(--dayz-text-muted))', cursor: 'pointer' }}>
          <Icon name="X" size={18} />
        </button>

        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
        </div>
        <div style={{ fontSize: 13, color: 'hsl(var(--dayz-text-muted))', marginBottom: 24 }}>
          {mode === 'login' ? 'Введите логин и пароль' : 'Создайте аккаунт'}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block', letterSpacing: '0.05em' }}>НИКНЕЙМ</label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="DayZAdmin" required minLength={3}
                style={{ width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, padding: '9px 12px', color: 'white', fontSize: 14, outline: 'none', fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
              />
            </div>
          )}
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block', letterSpacing: '0.05em' }}>EMAIL</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@example.com" required
                style={{ width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, padding: '9px 12px', color: 'white', fontSize: 14, outline: 'none', fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
              />
            </div>
          )}
          {mode === 'login' && (
            <div>
              <label style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block', letterSpacing: '0.05em' }}>ЛОГИН ИЛИ EMAIL</label>
              <input value={form.login} onChange={e => setForm({ ...form, login: e.target.value })}
                placeholder="DayZAdmin" required
                style={{ width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, padding: '9px 12px', color: 'white', fontSize: 14, outline: 'none', fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block', letterSpacing: '0.05em' }}>ПАРОЛЬ</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" required minLength={6}
              style={{ width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, padding: '9px 12px', color: 'white', fontSize: 14, outline: 'none', fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box' }}
              onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
              onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
            />
          </div>

          {error && (
            <div style={{ background: 'hsl(0 70% 50% / 0.1)', border: '1px solid hsl(0 70% 50% / 0.3)', borderRadius: 2, padding: '8px 12px', fontSize: 13, color: '#f87171' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)', border: 'none',
            borderRadius: 2, padding: '11px', fontSize: 14, fontWeight: 700,
            fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4
          }}>
            {loading ? 'Загрузка...' : mode === 'login' ? 'ВОЙТИ' : 'СОЗДАТЬ АККАУНТ'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'hsl(var(--dayz-text-muted))' }}>
          {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button onClick={() => onSwitch(mode === 'login' ? 'register' : 'login')} style={{ color: 'hsl(var(--dayz-green-bright))', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: "'Golos Text', sans-serif" }}>
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
