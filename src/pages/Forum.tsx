import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { forumApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return `${Math.floor(diff / 86400)} дн назад`;
}

export default function Forum() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const catId = searchParams.get('category');
  const topicId = searchParams.get('topic');

  const [categories, setCategories] = useState<Record<string, unknown>[]>([]);
  const [topics, setTopics] = useState<Record<string, unknown>[]>([]);
  const [topic, setTopic] = useState<Record<string, unknown> | null>(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', body: '', category_id: catId || '' });
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    forumApi.categories().then(d => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    if (topicId) {
      setLoading(true);
      forumApi.topic(topicId).then(d => { setTopic(d); setLoading(false); });
    } else {
      setLoading(true);
      const params: Record<string, string> = {};
      if (catId) params.category_id = catId;
      if (search) params.search = search;
      forumApi.topics(params).then(d => { setTopics(d.topics || []); setTotal(d.total || 0); setLoading(false); });
    }
  }, [catId, topicId, search]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true); setError('');
    const res = await forumApi.createTopic({ title: newTopic.title, body: newTopic.body, category_id: Number(newTopic.category_id) });
    setSubmitting(false);
    if (res.error) { setError(res.error); return; }
    setShowNewTopic(false);
    setNewTopic({ title: '', body: '', category_id: catId || '' });
    searchParams.set('topic', res.id);
    setSearchParams(searchParams);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !topic) return;
    setSubmitting(true); setError('');
    const res = await forumApi.reply({ topic_id: topic.id, body: replyText });
    setSubmitting(false);
    if (res.error) { setError(res.error); return; }
    setReplyText('');
    forumApi.topic(String(topic.id)).then(d => setTopic(d));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'hsl(var(--dayz-bg))', border: '1px solid hsl(var(--dayz-border))',
    borderRadius: 2, padding: '9px 12px', color: 'white', fontSize: 14, outline: 'none',
    fontFamily: "'Golos Text', sans-serif", boxSizing: 'border-box'
  };

  const S = {
    card: { background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 20 } as React.CSSProperties,
  };

  // Topic view
  if (topicId && topic) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4" style={{ padding: '32px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: 'hsl(var(--dayz-text-muted))' }}>
            <Link to="/forum" style={{ color: 'hsl(var(--dayz-green-bright))', textDecoration: 'none' }}>Форум</Link>
            <Icon name="ChevronRight" size={12} />
            <span onClick={() => { searchParams.delete('topic'); setSearchParams(searchParams); }} style={{ cursor: 'pointer', color: 'hsl(var(--dayz-green-bright))' }}>{topic.category_name}</span>
            <Icon name="ChevronRight" size={12} />
            <span style={{ color: 'hsl(var(--dayz-text))' }}>{topic.title}</span>
          </div>

          {/* Topic header */}
          <div style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'hsl(var(--dayz-green) / 0.15)', border: '1px solid hsl(var(--dayz-green) / 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: 'hsl(var(--dayz-green-bright))', fontSize: 16 }}>
                {topic.author?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>{topic.author?.username || 'Аноним'}</span>
                  {topic.author?.is_vip && <span className="badge-gold">VIP</span>}
                  <span style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>{timeAgo(topic.created_at)}</span>
                </div>
                <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, color: 'white', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{topic.title}</h1>
                <p style={{ fontSize: 14, color: 'hsl(var(--dayz-text))', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{topic.body}</p>
              </div>
            </div>
          </div>

          {/* Replies */}
          {(topic.replies as Record<string, unknown>[])?.map((r, i: number) => (
            <div key={r.id} style={{ ...S.card, marginBottom: 8, borderLeft: r.is_best_answer ? '3px solid hsl(var(--dayz-green))' : '1px solid hsl(var(--dayz-border))' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'hsl(220 15% 20%)', border: '1px solid hsl(var(--dayz-border))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: 'hsl(var(--dayz-text-muted))', fontSize: 14 }}>
                  {r.author?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: 'white', fontSize: 13 }}>{r.author?.username || 'Аноним'}</span>
                    {r.author?.is_vip && <span className="badge-gold">VIP</span>}
                    {r.is_best_answer && <span className="badge-green">✓ Лучший ответ</span>}
                    <span style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>#{i + 1} · {timeAgo(r.created_at)}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'hsl(var(--dayz-text))', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{r.body}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Reply form */}
          {!topic.is_locked ? (
            user ? (
              <div style={{ ...S.card, marginTop: 16 }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 14, textTransform: 'uppercase' }}>Ответить</div>
                <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)} required
                    placeholder="Напишите ваш ответ..." rows={5}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                    onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                    onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                  />
                  {error && <div style={{ color: '#f87171', fontSize: 13 }}>{error}</div>}
                  <button type="submit" disabled={submitting} style={{ alignSelf: 'flex-start', background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)', border: 'none', borderRadius: 2, padding: '9px 20px', fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    {submitting ? 'Отправка...' : 'ОТПРАВИТЬ'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ ...S.card, marginTop: 16, textAlign: 'center', color: 'hsl(var(--dayz-text-muted))' }}>
                <Link to="/" style={{ color: 'hsl(var(--dayz-green-bright))' }}>Войдите</Link>, чтобы ответить
              </div>
            )
          ) : (
            <div style={{ ...S.card, marginTop: 16, textAlign: 'center', color: 'hsl(var(--dayz-text-muted))' }}>
              <Icon name="Lock" size={16} style={{ margin: '0 auto 8px', display: 'block' }} />
              Тема закрыта
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4" style={{ padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, height: 28, background: 'hsl(var(--dayz-green))' }} />
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {catId ? categories.find(c => String(c.id) === catId)?.name || 'Форум' : 'Форум'}
            </h1>
          </div>
          {user && (
            <button onClick={() => setShowNewTopic(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)', border: 'none', borderRadius: 2, padding: '9px 18px', fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif', letterSpacing: '0.08em", textTransform: 'uppercase', cursor: 'pointer' }}>
              <Icon name="Plus" size={14} /> Новая тема
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories sidebar */}
          <div className="lg:col-span-1">
            <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid hsl(var(--dayz-border))', fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, color: 'hsl(var(--dayz-green-bright))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Разделы</div>
              <button onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: !catId ? 'hsl(var(--dayz-green) / 0.08)' : 'transparent', border: 'none', cursor: 'pointer', borderLeft: !catId ? '2px solid hsl(var(--dayz-green))' : '2px solid transparent', color: !catId ? 'white' : 'hsl(var(--dayz-text-muted))', fontSize: 13, fontFamily: "'Golos Text', sans-serif", textAlign: 'left' }}>
                <Icon name="MessageSquare" size={13} /> Все темы
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { searchParams.set('category', String(cat.id)); searchParams.delete('topic'); setSearchParams(searchParams); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: catId === String(cat.id) ? 'hsl(var(--dayz-green) / 0.08)' : 'transparent', border: 'none', cursor: 'pointer', borderLeft: catId === String(cat.id) ? '2px solid hsl(var(--dayz-green))' : '2px solid transparent', color: catId === String(cat.id) ? 'white' : 'hsl(var(--dayz-text-muted))', fontSize: 13, fontFamily: "'Golos Text', sans-serif", textAlign: 'left' }}>
                  <Icon name={cat.icon} size={13} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{cat.name}</span>
                  <span style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>{cat.topics_count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topics list */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, overflow: 'hidden' }}>
                <Icon name="Search" size={14} style={{ margin: '0 10px', color: 'hsl(var(--dayz-text-muted))' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск по темам..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '8px 0', fontSize: 13, color: 'white', fontFamily: "'Golos Text', sans-serif" }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'hsl(var(--dayz-text-muted))' }}>Загрузка...</div>
            ) : topics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'hsl(var(--dayz-text-muted))' }}>
                <Icon name="MessageSquare" size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                Тем пока нет. {user ? 'Создайте первую!' : 'Войдите, чтобы создать тему.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {topics.map(t => (
                  <button key={t.id} onClick={() => { searchParams.set('topic', String(t.id)); setSearchParams(searchParams); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 2, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green) / 0.4)'; (e.currentTarget).style.background = 'hsl(var(--dayz-surface-raised))'; }}
                    onMouseLeave={e => { (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'; (e.currentTarget).style.background = 'hsl(var(--dayz-surface))'; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'hsl(var(--dayz-green) / 0.1)', border: '1px solid hsl(var(--dayz-green) / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: 'hsl(var(--dayz-green-bright))', fontSize: 14 }}>
                      {t.author?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        {t.is_pinned && <Icon name="Pin" size={11} style={{ color: 'hsl(var(--dayz-green))' }} />}
                        {t.is_locked && <Icon name="Lock" size={11} style={{ color: 'hsl(var(--dayz-text-muted))' }} />}
                        <span style={{ fontWeight: 600, color: 'white', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>
                        {t.author?.username} · {t.category_name} · {timeAgo(t.created_at)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'hsl(var(--dayz-text-muted))' }}>
                        <Icon name="MessageSquare" size={11} /> {t.replies_count}
                      </div>
                      <div style={{ fontSize: 11, color: 'hsl(var(--dayz-text-muted))' }}>{timeAgo(t.last_reply_at)}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New topic modal */}
      {showNewTopic && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowNewTopic(false); }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 560, background: 'hsl(220 20% 12%)', border: '1px solid hsl(var(--dayz-border))', borderTop: '2px solid hsl(var(--dayz-green))', borderRadius: 4, padding: 28, margin: 16 }}>
            <button onClick={() => setShowNewTopic(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'hsl(var(--dayz-text-muted))', cursor: 'pointer' }}><Icon name="X" size={18} /></button>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 20, textTransform: 'uppercase' }}>Новая тема</div>
            <form onSubmit={handleCreateTopic} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>РАЗДЕЛ</label>
                <select value={newTopic.category_id} onChange={e => setNewTopic({ ...newTopic, category_id: e.target.value })} required
                  style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Выберите раздел</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>ЗАГОЛОВОК</label>
                <input value={newTopic.title} onChange={e => setNewTopic({ ...newTopic, title: e.target.value })} required
                  placeholder="Тема обсуждения..." style={inputStyle}
                  onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                  onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 4, display: 'block' }}>ТЕКСТ</label>
                <textarea value={newTopic.body} onChange={e => setNewTopic({ ...newTopic, body: e.target.value })} required
                  placeholder="Опишите вашу тему подробно..." rows={6}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                  onFocus={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-green))'}
                  onBlur={e => (e.currentTarget).style.borderColor = 'hsl(var(--dayz-border))'}
                />
              </div>
              {error && <div style={{ color: '#f87171', fontSize: 13 }}>{error}</div>}
              <button type="submit" disabled={submitting} style={{ background: 'hsl(var(--dayz-green))', color: 'hsl(220 15% 8%)', border: 'none', borderRadius: 2, padding: '11px', fontSize: 13, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', cursor: 'pointer' }}>
                {submitting ? 'Создание...' : 'СОЗДАТЬ ТЕМУ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}