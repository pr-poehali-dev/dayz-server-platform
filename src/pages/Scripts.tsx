import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { scriptsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

const CATEGORIES = [
  { value: '', label: 'Все категории' },
  { value: 'gameplay', label: 'Геймплей' },
  { value: 'admin', label: 'Администрирование' },
  { value: 'economy', label: 'Экономика' },
  { value: 'pvp', label: 'PvP' },
  { value: 'social', label: 'Социал' },
  { value: 'other', label: 'Прочее' },
];

export default function Scripts() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scripts, setScripts] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'created_at');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', content: '', category: 'gameplay', type: 'script', version: '1.0.0', is_vip_only: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  const load = async () => {
    setLoading(true);
    const params: Record<string, string> = { sort };
    if (category) params.category = category;
    if (type) params.type = type;
    if (search) params.search = search;
    const data = await scriptsApi.list(params);
    setScripts(data.scripts || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [category, type, sort, search]);

  const handleDownload = async (s: Record<string, unknown>) => {
    await scriptsApi.download(String(s.id));
    const detail = await scriptsApi.detail(String(s.id));
    setSelected(detail);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    const res = await scriptsApi.create(createForm);
    setSubmitting(false);
    if (res.error) { setError(res.error); return; }
    setShowCreate(false);
    load();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))',
    borderRadius: 2, padding: '9px 12px', color: 'white', fontSize: 13, outline: 'none',
    fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box'
  };

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map(i => (
      <Icon key={i} name="Star" size={11} style={{ color: i <= Math.round(rating) ? '#f59e0b' : 'hsl(var(--dayz-border))', fill: i <= Math.round(rating) ? '#f59e0b' : 'none' }} />
    ));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4" style={{ padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, height: 28, background: 'hsl(var(--dayz-green))' }} />
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Скрипты и Моды
            </h1>
            <span style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))' }}>{total} файлов</span>
          </div>
          {user && (
            <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)', border: 'none', borderRadius: 2, padding: '9px 18px', fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', cursor: 'pointer' }}>
              <Icon name="Upload" size={14} /> Загрузить
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, overflow: 'hidden' }}>
            <Icon name="Search" size={14} style={{ margin: '0 10px', color: 'hsl(var(--dayz-text-muted))', flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск скриптов..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '8px 0', fontSize: 13, color: 'white', fontFamily: "'Golos Text', sans-serif" }}
            />
          </div>
          <select value={type} onChange={e => setType(e.target.value)} style={{ ...inputStyle, width: 'auto', padding: '8px 12px' }}>
            <option value="">Тип: все</option>
            <option value="script">Скрипты</option>
            <option value="mod">Моды</option>
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, width: 'auto', padding: '8px 12px' }}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inputStyle, width: 'auto', padding: '8px 12px' }}>
            <option value="created_at">Новые</option>
            <option value="popular">Популярные</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'hsl(var(--dayz-text-muted))' }}>Загрузка...</div>
        ) : scripts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'hsl(var(--dayz-text-muted))' }}>
            <Icon name="Code2" size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
            Ничего не найдено
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scripts.map(s => (
              <div key={String(s.id)} style={{ background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green) / 0.4)'; (e.currentTarget).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'; (e.currentTarget).style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 4, background: 'hsl(var(--dayz-green) / 0.1)', border: '1px solid hsl(var(--dayz-green) / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={String(s.type) === 'mod' ? 'Package' : 'Code2'} size={20} style={{ color: 'hsl(var(--dayz-green))' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'white', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(s.title)}</span>
                      {s.is_vip_only && <span className="badge-gold">VIP</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>v{String(s.version)} · {String(s.category)}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', lineHeight: 1.5, flex: 1 }}>
                  {String(s.description || '').slice(0, 100)}{String(s.description || '').length > 100 ? '...' : ''}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 2 }}>{renderStars(Number(s.rating) || 0)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>
                    <Icon name="Download" size={10} /> {Number(s.downloads).toLocaleString()}
                  </div>
                </div>
                <button onClick={() => handleDownload(s)} style={{ width: '100%', background: s.locked ? 'hsl(35 90% 55% / 0.1)' : 'hsl(var(--dayz-green) / 0.1)', border: `1px solid ${s.locked ? 'hsl(35 90% 55% / 0.3)' : 'hsl(var(--dayz-green) / 0.3)'}`, color: s.locked ? '#f59e0b' : 'hsl(var(--dayz-green-bright))', borderRadius: 2, padding: '7px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {s.locked ? '🔒 Только VIP' : '↓ Скачать'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Script detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 620, background: 'hsl(220 20% 12%)', border: '1px solid hsl(var(--dayz-border))', borderTop: '2px solid hsl(var(--dayz-green))', borderRadius: 4, padding: 28, margin: 16, maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'hsl(var(--dayz-text-muted))', cursor: 'pointer' }}><Icon name="X" size={18} /></button>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 6 }}>{String(selected.title)}</div>
            <div style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 20 }}>v{String(selected.version)} · {String(selected.downloads)} скачиваний</div>
            <p style={{ fontSize: 14, color: 'hsl(var(--dayz-text))', lineHeight: 1.7, marginBottom: 20 }}>{String(selected.description || '')}</p>
            {selected.content && (
              <div>
                <div style={{ fontSize: 12, color: 'hsl(var(--dayz-green-bright))', marginBottom: 8, fontWeight: 600, letterSpacing: '0.1em' }}>КОД / ИНСТРУКЦИЯ</div>
                <pre style={{ background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, padding: 16, fontSize: 12, color: 'hsl(var(--dayz-text))', overflowX: 'auto', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {String(selected.content)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 560, background: 'hsl(220 20% 12%)', border: '1px solid hsl(var(--dayz-border))', borderTop: '2px solid hsl(var(--dayz-green))', borderRadius: 4, padding: 28, margin: 16, maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowCreate(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'hsl(var(--dayz-text-muted))', cursor: 'pointer' }}><Icon name="X" size={18} /></button>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 20, textTransform: 'uppercase' }}>Загрузить файл</div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>ТИП</label>
                  <select value={createForm.type} onChange={e => setCreateForm({ ...createForm, type: e.target.value })} style={inputStyle}>
                    <option value="script">Скрипт</option>
                    <option value="mod">Мод</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>КАТЕГОРИЯ</label>
                  <select value={createForm.category} onChange={e => setCreateForm({ ...createForm, category: e.target.value })} style={inputStyle}>
                    {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>НАЗВАНИЕ *</label>
                <input value={createForm.title} onChange={e => setCreateForm({ ...createForm, title: e.target.value })} required placeholder="Название скрипта" style={inputStyle}
                  onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                  onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>ОПИСАНИЕ</label>
                <textarea value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} rows={3}
                  placeholder="Что делает этот скрипт?" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                  onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                  onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>КОД / ИНСТРУКЦИЯ</label>
                <textarea value={createForm.content} onChange={e => setCreateForm({ ...createForm, content: e.target.value })} rows={6}
                  placeholder="Вставьте код или инструкцию по установке..." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, fontFamily: 'monospace' }}
                  onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                  onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'hsl(var(--dayz-text))' }}>
                <input type="checkbox" checked={createForm.is_vip_only} onChange={e => setCreateForm({ ...createForm, is_vip_only: e.target.checked })} />
                Только для VIP пользователей
              </label>
              {error && <div style={{ color: '#f87171', fontSize: 13 }}>{error}</div>}
              <button type="submit" disabled={submitting} style={{ background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)', border: 'none', borderRadius: 2, padding: 11, fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', cursor: 'pointer' }}>
                {submitting ? 'Загрузка...' : 'ОПУБЛИКОВАТЬ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
