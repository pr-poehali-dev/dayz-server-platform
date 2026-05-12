import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { messagesApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч`;
  return d.toLocaleDateString('ru');
}

export default function Messages() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ to: '', subject: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    setSelected(null);
    if (tab === 'inbox') {
      const d = await messagesApi.inbox();
      setMessages(d.messages || []);
    } else if (tab === 'sent') {
      const d = await messagesApi.sent();
      setMessages(d.messages || []);
    }
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [tab, user]);

  const openMessage = async (m: Record<string, unknown>) => {
    setSelected(m);
    if (tab === 'inbox' && !m.is_read) {
      await messagesApi.read(String(m.id));
      setMessages(prev => prev.map(x => x.id === m.id ? { ...x, is_read: true } : x));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(''); setSuccess('');
    const res = await messagesApi.send(form);
    setSubmitting(false);
    if (res.error) { setError(res.error); return; }
    setSuccess('Сообщение отправлено!');
    setForm({ to: '', subject: '', body: '' });
    setTimeout(() => { setSuccess(''); setTab('sent'); }, 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))',
    borderRadius: 2, padding: '9px 12px', color: 'white', fontSize: 13, outline: 'none',
    fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box'
  };

  if (!user) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 80, color: 'hsl(var(--dayz-text-muted))' }}>
          <Icon name="Mail" size={40} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
          <div style={{ fontSize: 18, marginBottom: 12, color: 'white' }}>Личные сообщения</div>
          <Link to="/" style={{ color: 'hsl(var(--dayz-green-bright))' }}>Войдите</Link>, чтобы просматривать сообщения
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4" style={{ padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 3, height: 28, background: 'hsl(var(--dayz-green))' }} />
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Личные сообщения</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {(['inbox', 'sent', 'compose'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: tab === t ? 'hsl(var(--dayz-green) / 0.1)' : 'hsl(var(--dayz-surface))', border: `1px solid ${tab === t ? 'hsl(var(--dayz-green) / 0.4)' : 'hsl(var(--dayz-border))'}`, borderRadius: 2, cursor: 'pointer', color: tab === t ? 'white' : 'hsl(var(--dayz-text-muted))', fontSize: 13, fontFamily: "'Golos Text', sans-serif", fontWeight: tab === t ? 600 : 400 }}>
                <Icon name={t === 'inbox' ? 'Inbox' : t === 'sent' ? 'Send' : 'Plus'} size={14} style={{ color: tab === t ? 'hsl(var(--dayz-green-bright))' : 'hsl(var(--dayz-text-muted))' }} />
                {t === 'inbox' ? 'Входящие' : t === 'sent' ? 'Отправленные' : 'Написать'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            {tab === 'compose' ? (
              <div style={{ background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 24 }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 20, textTransform: 'uppercase' }}>Новое сообщение</div>
                <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>КОМУ (никнейм)</label>
                    <input value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} required placeholder="username" style={inputStyle}
                      onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                      onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>ТЕМА (необязательно)</label>
                    <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Тема сообщения" style={inputStyle}
                      onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                      onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>СООБЩЕНИЕ</label>
                    <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required rows={6}
                      placeholder="Введите текст сообщения..." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                      onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                      onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                    />
                  </div>
                  {error && <div style={{ color: '#f87171', fontSize: 13 }}>{error}</div>}
                  {success && <div style={{ color: 'hsl(var(--dayz-green-bright))', fontSize: 13 }}>{success}</div>}
                  <button type="submit" disabled={submitting} style={{ alignSelf: 'flex-start', background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)', border: 'none', borderRadius: 2, padding: '10px 24px', fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', cursor: 'pointer' }}>
                    {submitting ? 'Отправка...' : 'ОТПРАВИТЬ'}
                  </button>
                </form>
              </div>
            ) : selected ? (
              <div style={{ background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 24 }}>
                <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'hsl(var(--dayz-text-muted))', cursor: 'pointer', fontSize: 13, marginBottom: 16, fontFamily: "'Golos Text', sans-serif" }}>
                  <Icon name="ArrowLeft" size={13} /> Назад
                </button>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 8 }}>{String(selected.subject || 'Без темы')}</div>
                <div style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 20, display: 'flex', gap: 12 }}>
                  <span>{tab === 'inbox' ? `От: ${(selected.sender as Record<string, unknown>)?.username || '?'}` : `Кому: ${(selected.receiver as Record<string, unknown>)?.username || '?'}`}</span>
                  <span>{timeAgo(String(selected.created_at))}</span>
                </div>
                <div style={{ fontSize: 14, color: 'hsl(var(--dayz-text))', lineHeight: 1.7, whiteSpace: 'pre-wrap', borderTop: '1px solid hsl(var(--dayz-border))', paddingTop: 16 }}>
                  {String(selected.body)}
                </div>
                {tab === 'inbox' && (
                  <button onClick={() => { setForm({ to: String((selected.sender as Record<string, unknown>)?.username || ''), subject: `Re: ${String(selected.subject || '')}`, body: '' }); setTab('compose'); }} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, background: 'hsl(var(--dayz-surface-raised))', border: '1px solid hsl(var(--dayz-border))', color: 'hsl(var(--dayz-text))', borderRadius: 2, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontFamily: "'Golos Text', sans-serif" }}>
                    <Icon name="Reply" size={12} /> Ответить
                  </button>
                )}
              </div>
            ) : (
              <div>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'hsl(var(--dayz-text-muted))' }}>Загрузка...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, color: 'hsl(var(--dayz-text-muted))' }}>
                    <Icon name="Inbox" size={36} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                    {tab === 'inbox' ? 'Нет входящих сообщений' : 'Нет отправленных сообщений'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {messages.map(m => (
                      <button key={String(m.id)} onClick={() => openMessage(m)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: !m.is_read && tab === 'inbox' ? 'hsl(var(--dayz-green) / 0.05)' : 'hsl(var(--dayz-surface))', border: `1px solid ${!m.is_read && tab === 'inbox' ? 'hsl(var(--dayz-green) / 0.2)' : 'hsl(var(--dayz-border))'}`, borderRadius: 2, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                        onMouseEnter={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green) / 0.4)'}
                        onMouseLeave={e => (e.currentTarget).style.borderColor = !m.is_read && tab === 'inbox' ? 'hsl(var(--dayz-green) / 0.2)' : 'hsl(var(--dayz-border))'}
                      >
                        {!m.is_read && tab === 'inbox' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(var(--dayz-green))', flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: !m.is_read && tab === 'inbox' ? 700 : 500, color: 'white', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {String(m.subject || 'Без темы')}
                          </div>
                          <div style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>
                            {tab === 'inbox' ? `От: ${(m.sender as Record<string, unknown>)?.username || '?'}` : `Кому: ${(m.receiver as Record<string, unknown>)?.username || '?'}`}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', flexShrink: 0 }}>{timeAgo(String(m.created_at))}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
