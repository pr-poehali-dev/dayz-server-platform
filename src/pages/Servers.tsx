import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { serversApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

const MAPS = ['', 'Chernarus', 'Namalsk', 'Livonia', 'Takistan', 'Deer Isle'];

export default function Servers() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [servers, setServers] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mapFilter, setMapFilter] = useState('');
  const [showAdd, setShowAdd] = useState(searchParams.get('add') === '1');
  const [form, setForm] = useState({ name: '', description: '', ip: '', port: '2302', map: 'Chernarus', max_players: '64', is_modded: false, website_url: '', discord_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [votingId, setVotingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (mapFilter) params.map = mapFilter;
    const data = await serversApi.list(params);
    setServers(data.servers || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [mapFilter]);

  const handleVote = async (id: string) => {
    if (!user) return;
    setVotingId(id);
    await serversApi.vote(id);
    setVotingId(null);
    load();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    const res = await serversApi.add({ ...form, port: Number(form.port), max_players: Number(form.max_players) });
    setSubmitting(false);
    if (res.error) { setError(res.error); return; }
    setShowAdd(false);
    load();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))',
    borderRadius: 2, padding: '9px 12px', color: 'white', fontSize: 13, outline: 'none',
    fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box'
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4" style={{ padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, height: 28, background: 'hsl(35 90% 55%)' }} />
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Топ серверов</h1>
            <span style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))' }}>{total} серверов</span>
          </div>
          {user && (
            <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'hsl(35 90% 55%)', color: '#1a0f00', border: 'none', borderRadius: 2, padding: '9px 18px', fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', cursor: 'pointer' }}>
              <Icon name="Plus" size={14} /> Добавить сервер
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {MAPS.map(m => (
            <button key={m} onClick={() => setMapFilter(m)} style={{ padding: '6px 14px', background: mapFilter === m ? 'hsl(35 90% 55%)' : 'hsl(var(--dayz-surface))', color: mapFilter === m ? '#1a0f00' : 'hsl(var(--dayz-text-muted))', border: `1px solid ${mapFilter === m ? 'transparent' : 'hsl(var(--dayz-border))'}`, borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Golos Text', sans-serif" }}>
              {m || 'Все карты'}
            </button>
          ))}
        </div>

        {/* Info block */}
        <div style={{ background: 'hsl(var(--dayz-green) / 0.05)', border: '1px solid hsl(var(--dayz-green) / 0.2)', borderRadius: 4, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'hsl(var(--dayz-text-muted))' }}>
          <Icon name="Info" size={14} style={{ color: 'hsl(var(--dayz-green))', flexShrink: 0 }} />
          Голосуйте за серверы раз в сутки. Серверы с рекламой помечены 🔥 и показываются выше.
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'hsl(var(--dayz-text-muted))' }}>Загрузка...</div>
        ) : servers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'hsl(var(--dayz-text-muted))' }}>
            <Icon name="Server" size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
            Серверов пока нет. Добавьте свой!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {servers.map((s, idx) => (
              <div key={String(s.id)} style={{ background: 'hsl(var(--dayz-surface))', border: `1px solid ${Number(s.ad_boost) > 0 ? 'hsl(35 90% 55% / 0.3)' : 'hsl(var(--dayz-border))'}`, borderRadius: 4, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Rank */}
                <div style={{ width: 36, height: 36, borderRadius: 3, background: idx < 3 ? 'hsl(35 90% 55% / 0.15)' : 'hsl(var(--dayz-bg))', border: `1px solid ${idx < 3 ? 'hsl(35 90% 55% / 0.4)' : 'hsl(var(--dayz-border))'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 14, color: idx < 3 ? '#f59e0b' : 'hsl(var(--dayz-text-muted))' }}>#{idx + 1}</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'white', fontSize: 15, fontFamily: "'Golos Text', sans-serif" }}>{String(s.name)}</span>
                    {Number(s.ad_boost) > 0 && <span style={{ fontSize: 12 }}>🔥</span>}
                    {s.is_verified && <span className="badge-green">✓ Верифицирован</span>}
                    {s.is_modded && <span style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, padding: '1px 6px' }}>Modded</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span><Icon name="Map" size={11} style={{ display: 'inline', marginRight: 4 }} />{String(s.map)}</span>
                    {s.ip && <span style={{ fontFamily: 'monospace' }}>{String(s.ip)}:{String(s.port)}</span>}
                    {s.website_url && <a href={String(s.website_url)} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--dayz-green-bright))', textDecoration: 'none' }}>Сайт</a>}
                    {s.discord_url && <a href={String(s.discord_url)} target="_blank" rel="noopener noreferrer" style={{ color: '#7289da', textDecoration: 'none' }}>Discord</a>}
                  </div>
                </div>

                {/* Players */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(var(--dayz-green))' }} />
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 16, color: 'hsl(var(--dayz-green-bright))' }}>{Number(s.current_players)}/{Number(s.max_players)}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'hsl(var(--dayz-text-muted))' }}>онлайн</div>
                </div>

                {/* Vote */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18, color: 'white', marginBottom: 4 }}>{Number(s.votes)}</div>
                  <button onClick={() => handleVote(String(s.id))} disabled={!user || s.user_voted as boolean || votingId === String(s.id)} style={{ background: s.user_voted ? 'hsl(var(--dayz-surface-raised))' : 'hsl(35 90% 55%)', color: s.user_voted ? 'hsl(var(--dayz-text-muted))' : '#1a0f00', border: 'none', borderRadius: 2, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: (s.user_voted || !user) ? 'not-allowed' : 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em', opacity: (s.user_voted || !user) ? 0.6 : 1 }}>
                    {s.user_voted ? '✓ ГОЛОС' : '▲ ГОЛОС'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add server modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 540, background: 'hsl(220 20% 12%)', border: '1px solid hsl(var(--dayz-border))', borderTop: '2px solid hsl(35 90% 55%)', borderRadius: 4, padding: 28, margin: 16, maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowAdd(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'hsl(var(--dayz-text-muted))', cursor: 'pointer' }}><Icon name="X" size={18} /></button>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 20, textTransform: 'uppercase' }}>Добавить сервер</div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>НАЗВАНИЕ *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Мой DayZ сервер" style={inputStyle}
                  onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                  onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>ОПИСАНИЕ</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  placeholder="Расскажите о вашем сервере..." style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                  onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>IP</label>
                  <input value={form.ip} onChange={e => setForm({ ...form, ip: e.target.value })} placeholder="127.0.0.1" style={inputStyle}
                    onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                    onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>ПОРТ</label>
                  <input value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} style={inputStyle}
                    onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                    onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>КАРТА</label>
                  <select value={form.map} onChange={e => setForm({ ...form, map: e.target.value })} style={inputStyle}>
                    {MAPS.filter(m => m).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>САЙТ</label>
                  <input value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." style={inputStyle}
                    onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                    onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>DISCORD</label>
                  <input value={form.discord_url} onChange={e => setForm({ ...form, discord_url: e.target.value })} placeholder="https://discord.gg/..." style={inputStyle}
                    onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                    onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                  />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'hsl(var(--dayz-text))' }}>
                <input type="checkbox" checked={form.is_modded} onChange={e => setForm({ ...form, is_modded: e.target.checked })} />
                Моддированный сервер
              </label>
              {error && <div style={{ color: '#f87171', fontSize: 13 }}>{error}</div>}
              <button type="submit" disabled={submitting} style={{ background: 'hsl(35 90% 55%)', color: '#1a0f00', border: 'none', borderRadius: 2, padding: 11, fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', cursor: 'pointer' }}>
                {submitting ? 'Добавление...' : 'ДОБАВИТЬ СЕРВЕР'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
