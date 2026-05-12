import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";
import { scriptsApi, forumApi, serversApi } from "@/lib/api";

const HERO_BG = "https://cdn.poehali.dev/projects/7bcd6475-4727-4934-a9a4-ba072f5408b0/files/ca359079-a12a-436d-a410-e1662eea12be.jpg";

const FEATURES = [
  { icon: "Code2", title: "Скрипты", desc: "Готовые скрипты для вашего сервера DayZ.", count: "340+", to: "/scripts?type=script", color: "hsl(90 60% 42%)" },
  { icon: "Package", title: "Моды", desc: "Каталог модов с инструкциями по установке.", count: "1 200+", to: "/scripts?type=mod", color: "hsl(90 60% 42%)" },
  { icon: "MessageCircle", title: "Консультации", desc: "Опытные администраторы помогут с настройкой.", count: "24/7", to: "/forum", color: "hsl(35 90% 55%)" },
  { icon: "Trophy", title: "Достижения", desc: "Система наград для активных участников.", count: "50+", to: "/profile#achievements", color: "hsl(35 90% 55%)" },
  { icon: "Crown", title: "VIP Подписка", desc: "Расширенный доступ и приоритетная поддержка.", count: "от 299₽", to: "/vip", color: "hsl(35 90% 55%)" },
  { icon: "Users", title: "Форум", desc: "Активное сообщество администраторов.", count: "12 000+", to: "/forum", color: "hsl(90 60% 42%)" },
];

export default function Index() {
  const [scripts, setScripts] = useState<Record<string, unknown>[]>([]);
  const [topics, setTopics] = useState<Record<string, unknown>[]>([]);
  const [servers, setServers] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    scriptsApi.list({ limit: '4', sort: 'created_at' }).then(d => setScripts(d.scripts || []));
    forumApi.topics({ limit: '4' }).then(d => setTopics(d.topics || []));
    serversApi.list({ limit: '3' }).then(d => setServers(d.servers || []));
  }, []);

  function timeAgo(dateStr: string) {
    const d = new Date(dateStr);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return `${Math.floor(diff / 86400)} дн назад`;
  }

  return (
    <Layout>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: 520, overflow: "hidden" }}>
        <img src={HERO_BG} alt="DayZ" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div className="hero-overlay" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 0% / 0.03) 2px, hsl(0 0% 0% / 0.03) 4px)", pointerEvents: "none" }} />

        <div className="max-w-7xl mx-auto px-4 relative" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "hsl(var(--dayz-green-bright))", boxShadow: "0 0 10px hsl(var(--dayz-green))" }} />
              <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "hsl(var(--dayz-green-bright))", fontFamily: "'Oswald', sans-serif" }}>
                Платформа для администраторов серверов
              </span>
            </div>

            <h1 className="animate-fade-in-up animate-delay-100" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 700, lineHeight: 1.05, color: "white", marginBottom: 16, textTransform: "uppercase" }}>
              DAYZ<span style={{ color: "hsl(var(--dayz-green-bright))" }}>HUB</span>
              <br />
              <span style={{ fontSize: "0.55em", fontWeight: 400, color: "hsl(var(--dayz-text-muted))", letterSpacing: "0.15em" }}>ВЫЖИВАЙ. УПРАВЛЯЙ. РАЗВИВАЙСЯ.</span>
            </h1>

            <p className="animate-fade-in-up animate-delay-200" style={{ fontSize: 16, color: "hsl(var(--dayz-text-muted))", marginBottom: 32, lineHeight: 1.6, maxWidth: 480 }}>
              Скрипты, моды, форум и консультации для администраторов серверов DayZ. Всё в одном месте.
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-in-up animate-delay-300">
              <Link to="/scripts" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "hsl(var(--dayz-green))", color: "hsl(220 15% 8%)", padding: "11px 24px", fontSize: 14, fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, textDecoration: "none" }} className="glow-green">
                <Icon name="Code2" size={16} /> Скрипты и Моды
              </Link>
              <Link to="/servers" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "white", border: "1px solid hsl(var(--dayz-border))", padding: "11px 24px", fontSize: 14, fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, textDecoration: "none" }}>
                <Icon name="Trophy" size={16} /> Топ серверов
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 animate-fade-in-up animate-delay-400">
              {[{ val: "12 000+", label: "Участников" }, { val: "1 500+", label: "Скриптов и модов" }, { val: "38+", label: "Серверов" }].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color: "hsl(var(--dayz-green-bright))", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "56px 0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 3, height: 28, background: "hsl(var(--dayz-green))" }} />
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>Возможности платформы</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Link key={i} to={f.to} className="dayz-card" style={{ padding: 20, borderRadius: 4, textDecoration: "none", display: "block" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 4, background: `${f.color}15`, border: `1px solid ${f.color}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={f.icon} size={20} style={{ color: f.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, color: "white", textTransform: "uppercase" }}>{f.title}</span>
                      <span style={{ fontSize: 11, color: f.color, fontWeight: 600 }}>{f.count}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))", lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SCRIPTS + SERVERS + FORUM */}
      <section style={{ padding: "0 0 56px" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Scripts */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div style={{ width: 3, height: 20, background: "hsl(var(--dayz-green))" }} />
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: "white", textTransform: "uppercase" }}>Новые скрипты</h2>
              </div>
              <Link to="/scripts" style={{ fontSize: 12, color: "hsl(var(--dayz-green-bright))", textDecoration: "none" }}>Все →</Link>
            </div>
            {scripts.length === 0 ? (
              <div style={{ textAlign: "center", padding: 32, color: "hsl(var(--dayz-text-muted))", fontSize: 13, background: "hsl(var(--dayz-surface))", border: "1px solid hsl(var(--dayz-border))", borderRadius: 4 }}>
                Пока нет скриптов. <Link to="/scripts" style={{ color: "hsl(var(--dayz-green-bright))" }}>Добавить первый?</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {scripts.map(s => (
                  <div key={String(s.id)} className="dayz-card" style={{ padding: "12px 16px", borderRadius: 2, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 3, background: "hsl(var(--dayz-green) / 0.08)", border: "1px solid hsl(var(--dayz-green) / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={String(s.type) === "mod" ? "Package" : "FileCode2"} size={14} style={{ color: "hsl(var(--dayz-green))" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(s.title)}</div>
                      <div style={{ fontSize: 11, color: "hsl(var(--dayz-text-muted))" }}>{String(s.category)} · v{String(s.version)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: "hsl(var(--dayz-text-muted))", display: "flex", alignItems: "center", gap: 3 }}>
                        <Icon name="Download" size={10} /> {Number(s.downloads).toLocaleString()}
                      </span>
                      <Link to="/scripts" style={{ background: "hsl(var(--dayz-green) / 0.1)", border: "1px solid hsl(var(--dayz-green) / 0.3)", color: "hsl(var(--dayz-green-bright))", padding: "3px 10px", borderRadius: 2, fontSize: 11, cursor: "pointer", textDecoration: "none", fontWeight: 600 }}>
                        Скачать
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Forum preview */}
            <div style={{ marginTop: 20 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ width: 3, height: 20, background: "hsl(var(--dayz-green))" }} />
                  <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: "white", textTransform: "uppercase" }}>Форум</h2>
                </div>
                <Link to="/forum" style={{ fontSize: 12, color: "hsl(var(--dayz-green-bright))", textDecoration: "none" }}>Все →</Link>
              </div>
              {topics.length === 0 ? (
                <div style={{ textAlign: "center", padding: 32, color: "hsl(var(--dayz-text-muted))", fontSize: 13, background: "hsl(var(--dayz-surface))", border: "1px solid hsl(var(--dayz-border))", borderRadius: 4 }}>
                  <Link to="/forum" style={{ color: "hsl(var(--dayz-green-bright))" }}>Начните первое обсуждение</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {topics.map(t => (
                    <Link key={String(t.id)} to={`/forum?topic=${t.id}`} className="dayz-card" style={{ padding: "10px 14px", borderRadius: 2, display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                      <Icon name="MessageSquare" size={13} style={{ color: "hsl(var(--dayz-green))", flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, color: "hsl(var(--dayz-text))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(t.title)}</span>
                      <span style={{ fontSize: 11, color: "hsl(var(--dayz-text-muted))", flexShrink: 0 }}>{timeAgo(String(t.last_reply_at))}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Servers + VIP */}
          <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ width: 3, height: 20, background: "hsl(35 90% 55%)" }} />
                  <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: "white", textTransform: "uppercase" }}>Топ серверов</h2>
                </div>
                <Link to="/servers" style={{ fontSize: 12, color: "hsl(var(--dayz-green-bright))", textDecoration: "none" }}>Все →</Link>
              </div>
              {servers.length === 0 ? (
                <div style={{ textAlign: "center", padding: 28, color: "hsl(var(--dayz-text-muted))", fontSize: 13, background: "hsl(var(--dayz-surface))", border: "1px solid hsl(var(--dayz-border))", borderRadius: 4 }}>
                  <Link to="/servers/add" style={{ color: "hsl(var(--dayz-green-bright))" }}>Добавить сервер</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {servers.map((srv, i) => (
                    <div key={String(srv.id)} className="dayz-card" style={{ padding: "12px 14px", borderRadius: 2 }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 26, height: 26, borderRadius: 3, background: i === 0 ? "hsl(35 90% 55% / 0.15)" : "hsl(var(--dayz-bg))", border: `1px solid ${i === 0 ? "hsl(35 90% 55% / 0.4)" : "hsl(var(--dayz-border))"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 11, color: i === 0 ? "#f59e0b" : "hsl(var(--dayz-text-muted))" }}>#{i + 1}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{String(srv.name)}</span>
                          <span style={{ fontSize: 11, color: "hsl(var(--dayz-text-muted))" }}>{String(srv.map)}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "hsl(var(--dayz-green))" }} />
                          <span style={{ fontSize: 11, color: "hsl(var(--dayz-green-bright))", fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>{Number(srv.current_players)}/{Number(srv.max_players)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/servers/add" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8, padding: 10, background: "hsl(var(--dayz-green) / 0.05)", border: "1px dashed hsl(var(--dayz-green) / 0.3)", borderRadius: 2, fontSize: 12, color: "hsl(var(--dayz-green-bright))", textDecoration: "none" }}>
                <Icon name="Plus" size={12} /> Добавить сервер
              </Link>
            </div>

            {/* VIP */}
            <div style={{ background: "linear-gradient(135deg, hsl(35 70% 12%), hsl(220 18% 11%))", border: "1px solid hsl(35 90% 40% / 0.4)", borderRadius: 4, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Icon name="Crown" size={22} style={{ color: "#f59e0b" }} />
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, color: "white", textTransform: "uppercase" }}>VIP Подписка</span>
              </div>
              <p style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))", marginBottom: 14, lineHeight: 1.5 }}>Доступ ко всем скриптам, приоритетная поддержка и достижение VIP.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, color: "#f59e0b" }}>299₽</span>
                <span style={{ fontSize: 11, color: "hsl(var(--dayz-text-muted))" }}>/ месяц</span>
                <Link to="/vip" style={{ marginLeft: "auto", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0f00", padding: "7px 16px", borderRadius: 2, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Oswald', sans-serif", textTransform: "uppercase", textDecoration: "none" }}>
                  Оформить
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
