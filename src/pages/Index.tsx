import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_BG = "https://cdn.poehali.dev/projects/7bcd6475-4727-4934-a9a4-ba072f5408b0/files/ca359079-a12a-436d-a410-e1662eea12be.jpg";

const NAV_ITEMS = [
  {
    label: "Обзор",
    icon: "Menu",
    color: "text-gray-300",
    items: [
      { icon: "LayoutDashboard", label: "Главная" },
      { icon: "Newspaper", label: "Новости" },
      { icon: "Info", label: "О платформе" },
    ],
  },
  {
    label: "Активность",
    icon: "Zap",
    color: "text-red-400",
    items: [
      { icon: "Activity", label: "Лента активности" },
      { icon: "TrendingUp", label: "Популярное" },
      { icon: "Bell", label: "Уведомления" },
    ],
  },
  {
    label: "Поддержка",
    icon: "HeartHandshake",
    color: "text-red-400",
    items: [
      { icon: "HelpCircle", label: "FAQ сайта" },
      { icon: "Megaphone", label: "Реклама на сайте" },
      { icon: "Scale", label: "Арбитраж" },
      { icon: "Send", label: "Обратная связь" },
      { icon: "Star", label: "Отзыв" },
      { icon: "CreditCard", label: "Пожертвования 🪙" },
    ],
  },
  {
    label: "Торговая площадка",
    icon: "LayoutGrid",
    color: "text-green-400",
    items: [
      { icon: "AlertTriangle", label: "Правила торговой площадки" },
      { icon: "Store", label: "Торговая площадка" },
      { icon: "Crown", label: "VIP подписка 🪙" },
      { icon: "ShoppingCart", label: "Совместные покупки" },
    ],
  },
  {
    label: "Топ сервера",
    icon: "Monitor",
    color: "text-purple-400",
    items: [
      { icon: "Trophy", label: "Топ серверов DAYZ 👑" },
      { icon: "Megaphone", label: "Реклама вашего сервера" },
    ],
  },
];

const FEATURES = [
  {
    icon: "Code2",
    title: "Скрипты",
    desc: "Готовые скрипты для вашего сервера DayZ. Проверены и обновляются.",
    count: "340+ скриптов",
    color: "hsl(90 60% 42%)",
  },
  {
    icon: "Package",
    title: "Моды",
    desc: "Каталог модов с описаниями, инструкциями по установке и совместимостью.",
    count: "1 200+ модов",
    color: "hsl(90 60% 42%)",
  },
  {
    icon: "MessageCircle",
    title: "Консультации",
    desc: "Опытные администраторы помогут настроить сервер и решить любые вопросы.",
    count: "24/7 онлайн",
    color: "hsl(35 90% 55%)",
  },
  {
    icon: "Trophy",
    title: "Достижения",
    desc: "Система наград для активных участников. Зарабатывайте репутацию.",
    count: "50+ наград",
    color: "hsl(35 90% 55%)",
  },
  {
    icon: "Crown",
    title: "VIP Подписка",
    desc: "Расширенный доступ к скриптам, приоритетная поддержка и эксклюзивные материалы.",
    count: "от 299 ₽/мес",
    color: "hsl(35 90% 55%)",
  },
  {
    icon: "Users",
    title: "Форум",
    desc: "Активное сообщество администраторов. Обменивайтесь опытом и находите помощников.",
    count: "12 000 участников",
    color: "hsl(90 60% 42%)",
  },
];

const LATEST_SCRIPTS = [
  { name: "Базовый рейд-таймер", category: "Геймплей", rating: 4.9, downloads: 1240, isNew: true },
  { name: "Система кланов v3", category: "Социал", rating: 4.8, downloads: 980, isNew: true },
  { name: "Авто-рестарт сервера", category: "Администрация", rating: 4.7, downloads: 2100, isNew: false },
  { name: "Улучшенный лут", category: "Геймплей", rating: 4.9, downloads: 3400, isNew: false },
];

const TOP_SERVERS = [
  { rank: 1, name: "HARDZONE.RU | PvP", players: "64/64", map: "Chernarus", crown: true },
  { rank: 2, name: "DAYZ-RUSSIA.COM | Vanilla", players: "48/64", map: "Namalsk", crown: false },
  { rank: 3, name: "SURVIVAL.PRO | Modded", players: "60/64", map: "Livonia", crown: false },
];

export default function Index() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--dayz-bg))", fontFamily: "'Golos Text', sans-serif" }}>

      {/* TOP BAR */}
      <div style={{ background: "hsl(220 20% 6%)", borderBottom: "1px solid hsl(var(--dayz-border))" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-9 gap-4">
          <span style={{ color: "hsl(var(--dayz-text-muted))", fontSize: 12 }}>Онлайн: <span style={{ color: "hsl(var(--dayz-green-bright))" }}>1 247</span></span>
          <span style={{ color: "hsl(var(--dayz-border))" }}>|</span>
          <span style={{ color: "hsl(var(--dayz-text-muted))", fontSize: 12 }}>Серверов в топе: <span style={{ color: "hsl(var(--dayz-green-bright))" }}>38</span></span>
          <div className="flex-1" />
          <a href="#" style={{ color: "hsl(var(--dayz-text-muted))", fontSize: 12 }} className="hover:text-white transition-colors">Войти</a>
          <a href="#" style={{ color: "hsl(var(--dayz-green-bright))", fontSize: 12, fontWeight: 600 }} className="hover:opacity-80 transition-opacity">Регистрация</a>
        </div>
      </div>

      {/* NAVBAR */}
      <nav style={{ background: "hsl(220 18% 9%)", borderBottom: "2px solid hsl(220 15% 15%)", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 mr-6 flex-shrink-0">
            <div style={{ width: 32, height: 32, background: "hsl(var(--dayz-green) / 0.1)", border: "1px solid hsl(var(--dayz-green) / 0.4)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Crosshair" size={18} style={{ color: "hsl(var(--dayz-green-bright))" }} />
            </div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: "white", letterSpacing: "0.05em" }}>DAYZ<span style={{ color: "hsl(var(--dayz-green-bright))" }}>HUB</span></span>
          </a>

          {/* Nav items */}
          <div className="hidden md:flex items-center flex-1">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={i}
                className="relative h-12 flex items-center"
                onMouseEnter={() => setActiveDropdown(i)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="flex items-center gap-1.5 px-3 h-full text-sm font-medium transition-colors"
                  style={{
                    fontFamily: "'Golos Text', sans-serif",
                    color: activeDropdown === i ? "white" : "hsl(var(--dayz-text-muted))",
                    background: activeDropdown === i ? "hsl(var(--dayz-surface))" : "transparent",
                    borderBottom: activeDropdown === i ? `2px solid hsl(var(--dayz-green))` : "2px solid transparent",
                    cursor: "pointer",
                    border: "none",
                    outline: "none",
                  }}
                >
                  <Icon name={item.icon} size={14} className={item.color} />
                  {item.label}
                  <Icon name="ChevronDown" size={12} style={{ color: "hsl(var(--dayz-text-muted))" }} />
                </button>

                {/* Dropdown */}
                {activeDropdown === i && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    minWidth: 230,
                    background: "hsl(220 20% 12%)",
                    border: "1px solid hsl(var(--dayz-border))",
                    borderTop: `2px solid hsl(var(--dayz-green))`,
                    zIndex: 1000,
                    padding: "4px 0",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
                  }}>
                    {item.items.map((sub, j) => (
                      <a
                        key={j}
                        href="#"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                        style={{ color: "hsl(var(--dayz-text))", fontFamily: "'Golos Text', sans-serif", textDecoration: "none" }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLAnchorElement).style.background = "hsl(var(--dayz-surface-raised))";
                          (e.currentTarget as HTMLAnchorElement).style.color = "hsl(var(--dayz-green-bright))";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                          (e.currentTarget as HTMLAnchorElement).style.color = "hsl(var(--dayz-text))";
                        }}
                      >
                        <Icon name={sub.icon} size={14} style={{ color: "hsl(var(--dayz-text-muted))", flexShrink: 0 }} />
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center ml-4" style={{ background: "hsl(var(--dayz-surface))", border: "1px solid hsl(var(--dayz-green) / 0.5)", borderRadius: 2, overflow: "hidden" }}>
            <input
              placeholder="Поиск..."
              style={{ background: "transparent", border: "none", outline: "none", padding: "5px 12px", fontSize: 13, color: "hsl(var(--dayz-text))", width: 160, fontFamily: "'Golos Text', sans-serif" }}
            />
            <button style={{ padding: "5px 10px", background: "hsl(var(--dayz-green) / 0.15)", color: "hsl(var(--dayz-green-bright))", border: "none", cursor: "pointer" }}>
              <Icon name="Search" size={14} />
            </button>
          </div>

          {/* Mobile menu */}
          <button className="md:hidden ml-auto" style={{ color: "hsl(var(--dayz-text))", background: "none", border: "none", cursor: "pointer" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div style={{ background: "hsl(220 20% 10%)", borderTop: "1px solid hsl(var(--dayz-border))", padding: "8px 0" }}>
            {NAV_ITEMS.map((item, i) => (
              <div key={i}>
                <div style={{ padding: "6px 16px", color: "hsl(var(--dayz-green-bright))", fontSize: 12, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                  {item.label}
                </div>
                {item.items.map((sub, j) => (
                  <a key={j} href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 24px", fontSize: 13, color: "hsl(var(--dayz-text))", fontFamily: "'Golos Text', sans-serif", textDecoration: "none" }}>
                    <Icon name={sub.icon} size={13} style={{ color: "hsl(var(--dayz-text-muted))" }} />
                    {sub.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", minHeight: 560, overflow: "hidden" }}>
        <img
          src={HERO_BG}
          alt="DayZ"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div className="hero-overlay" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 0% / 0.03) 2px, hsl(0 0% 0% / 0.03) 4px)", pointerEvents: "none" }} />

        <div className="max-w-7xl mx-auto px-4 relative" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "hsl(var(--dayz-green-bright))", boxShadow: "0 0 10px hsl(var(--dayz-green))" }} />
              <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "hsl(var(--dayz-green-bright))", fontFamily: "'Oswald', sans-serif", fontWeight: 400 }}>
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
              <a href="#features" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "hsl(var(--dayz-green))", color: "hsl(220 15% 8%)",
                padding: "11px 24px", fontSize: 14, fontWeight: 700,
                fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em",
                textTransform: "uppercase", borderRadius: 2, textDecoration: "none",
                transition: "all 0.2s",
              }} className="glow-green">
                <Icon name="Code2" size={16} />
                Скрипты и Моды
              </a>
              <a href="#servers" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "white",
                border: "1px solid hsl(var(--dayz-border))",
                padding: "11px 24px", fontSize: 14, fontWeight: 700,
                fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em",
                textTransform: "uppercase", borderRadius: 2, textDecoration: "none",
                transition: "all 0.2s",
              }}>
                <Icon name="Trophy" size={16} />
                Топ серверов
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-10 animate-fade-in-up animate-delay-400">
              {[
                { val: "12 000+", label: "Участников" },
                { val: "1 500+", label: "Скриптов и модов" },
                { val: "38", label: "Серверов в топе" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color: "hsl(var(--dayz-green-bright))", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))", marginTop: 2, letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "60px 0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 3, height: 28, background: "hsl(var(--dayz-green))" }} />
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Возможности платформы
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="dayz-card" style={{ padding: 24, borderRadius: 4 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 4, background: `${f.color}20`, border: `1px solid ${f.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={f.icon} size={22} style={{ color: f.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.title}</h3>
                      <span style={{ fontSize: 11, color: f.color, fontWeight: 600, fontFamily: "'Golos Text', sans-serif" }}>{f.count}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "hsl(var(--dayz-text-muted))", lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCRIPTS + TOP SERVERS */}
      <section style={{ padding: "0 0 60px" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Latest scripts */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div style={{ width: 3, height: 22, background: "hsl(var(--dayz-green))" }} />
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>Новые скрипты</h2>
              </div>
              <a href="#" style={{ fontSize: 12, color: "hsl(var(--dayz-green-bright))", textDecoration: "none", fontFamily: "'Golos Text', sans-serif" }}>Все скрипты →</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {LATEST_SCRIPTS.map((s, i) => (
                <div key={i} className="dayz-card" style={{ padding: "14px 16px", borderRadius: 2, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 3, background: "hsl(var(--dayz-green) / 0.08)", border: "1px solid hsl(var(--dayz-green) / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="FileCode2" size={16} style={{ color: "hsl(var(--dayz-green))" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14, fontWeight: 600, color: "white", fontFamily: "'Golos Text', sans-serif" }}>{s.name}</span>
                      {s.isNew && <span className="badge-green">НОВЫЙ</span>}
                    </div>
                    <span style={{ fontSize: 11, color: "hsl(var(--dayz-text-muted))" }}>{s.category}</span>
                  </div>
                  <div className="flex items-center gap-4" style={{ flexShrink: 0 }}>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                      <span style={{ fontSize: 12, color: "hsl(var(--dayz-text))" }}>{s.rating}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <Icon name="Download" size={12} style={{ color: "hsl(var(--dayz-text-muted))" }} />
                      <span style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))" }}>{s.downloads.toLocaleString()}</span>
                    </div>
                    <button style={{ background: "hsl(var(--dayz-green) / 0.1)", border: "1px solid hsl(var(--dayz-green) / 0.3)", color: "hsl(var(--dayz-green-bright))", padding: "3px 10px", borderRadius: 2, fontSize: 12, cursor: "pointer", fontFamily: "'Golos Text', sans-serif", fontWeight: 600 }}>
                      Скачать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top servers */}
          <div className="lg:col-span-2" id="servers">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div style={{ width: 3, height: 22, background: "hsl(35 90% 55%)" }} />
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>Топ серверов</h2>
              </div>
              <a href="#" style={{ fontSize: 12, color: "hsl(var(--dayz-green-bright))", textDecoration: "none" }}>Все →</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {TOP_SERVERS.map((srv, i) => (
                <div key={i} className="dayz-card" style={{ padding: "12px 14px", borderRadius: 2 }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 28, height: 28, borderRadius: 3, background: srv.rank === 1 ? "hsl(35 90% 55% / 0.15)" : "hsl(var(--dayz-surface-raised))", border: `1px solid ${srv.rank === 1 ? "hsl(35 90% 55% / 0.4)" : "hsl(var(--dayz-border))"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 13, color: srv.rank === 1 ? "#f59e0b" : "hsl(var(--dayz-text-muted))" }}>#{srv.rank}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: 13, fontWeight: 600, color: "white", fontFamily: "'Golos Text', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{srv.name}</span>
                        {srv.crown && <span style={{ fontSize: 14 }}>👑</span>}
                      </div>
                      <span style={{ fontSize: 11, color: "hsl(var(--dayz-text-muted))" }}>{srv.map}</span>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(var(--dayz-green))" }} />
                        <span style={{ fontSize: 12, color: "hsl(var(--dayz-green-bright))", fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>{srv.players}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 8, padding: "14px", background: "hsl(var(--dayz-green) / 0.05)", border: "1px dashed hsl(var(--dayz-green) / 0.3)", borderRadius: 2, textAlign: "center" }}>
              <Icon name="Megaphone" size={18} style={{ color: "hsl(var(--dayz-green))", margin: "0 auto 6px" }} />
              <div style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))", marginBottom: 8 }}>Хотите попасть в топ?</div>
              <button style={{ background: "hsl(var(--dayz-green))", color: "hsl(220 15% 8%)", padding: "6px 18px", borderRadius: 2, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Реклама сервера
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FORUM + VIP + ACHIEVEMENTS */}
      <section style={{ padding: "0 0 60px" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Forum */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 3, height: 22, background: "hsl(var(--dayz-green))" }} />
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>Форум</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { title: "Как настроить экономику на сервере?", replies: 24, views: 1240, hot: true },
                { title: "Баг с моддингом инвентаря в 1.25", replies: 8, views: 430, hot: false },
                { title: "Ищу опытного скриптера для проекта", replies: 15, views: 890, hot: true },
                { title: "Гайд по настройке SpawnEconomy", replies: 41, views: 3200, hot: false },
              ].map((t, i) => (
                <a href="#" key={i} className="dayz-card" style={{ padding: "12px 16px", borderRadius: 2, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                  <Icon name="MessageSquare" size={16} style={{ color: t.hot ? "hsl(var(--dayz-green))" : "hsl(var(--dayz-text-muted))", flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: "hsl(var(--dayz-text))", fontFamily: "'Golos Text', sans-serif" }}>{t.title}</span>
                  <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
                    {t.hot && <span className="badge-green">🔥 ТОП</span>}
                    <span style={{ fontSize: 11, color: "hsl(var(--dayz-text-muted))" }}>{t.replies} отв.</span>
                  </div>
                </a>
              ))}
              <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", fontSize: 12, color: "hsl(var(--dayz-green-bright))", textDecoration: "none", marginTop: 4, fontFamily: "'Golos Text', sans-serif" }}>
                Все темы форума →
              </a>
            </div>
          </div>

          {/* VIP + Achievements */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* VIP */}
            <div style={{ background: "linear-gradient(135deg, hsl(35 70% 12%), hsl(220 18% 11%))", border: "1px solid hsl(35 90% 40% / 0.4)", borderRadius: 4, padding: 24, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "hsl(35 90% 55% / 0.07)", pointerEvents: "none" }} />
              <div className="flex items-start gap-4">
                <div style={{ width: 48, height: 48, borderRadius: 4, background: "hsl(35 90% 55% / 0.15)", border: "1px solid hsl(35 90% 55% / 0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="Crown" size={24} style={{ color: "#f59e0b" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    VIP Подписка
                  </h3>
                  <p style={{ fontSize: 13, color: "hsl(var(--dayz-text-muted))", marginBottom: 16, lineHeight: 1.5 }}>
                    Доступ ко всем скриптам, приоритетная поддержка, эксклюзивные моды и ранний доступ к новинкам.
                  </p>
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 700, color: "#f59e0b" }}>299 ₽</span>
                    <span style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))" }}>/ месяц</span>
                    <button style={{ marginLeft: "auto", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0f00", padding: "7px 18px", borderRadius: 2, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Оформить
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="dayz-card" style={{ borderRadius: 4, padding: 20 }}>
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Trophy" size={18} style={{ color: "hsl(35 90% 55%)" }} />
                <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>Система достижений</h3>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: "🏆", label: "Ветеран", locked: false },
                  { icon: "⚡", label: "Активный", locked: false },
                  { icon: "🔧", label: "Мастер", locked: false },
                  { icon: "👑", label: "Легенда", locked: true },
                  { icon: "📦", label: "Кладовщик", locked: true },
                  { icon: "🎯", label: "Снайпер", locked: true },
                  { icon: "🌟", label: "Эксперт", locked: true },
                  { icon: "🛡️", label: "Защитник", locked: true },
                ].map((a, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 3, background: a.locked ? "hsl(var(--dayz-bg))" : "hsl(var(--dayz-green) / 0.08)", border: `1px solid ${a.locked ? "hsl(var(--dayz-border))" : "hsl(var(--dayz-green) / 0.3)"}`, opacity: a.locked ? 0.4 : 1, position: "relative" }}>
                    <div style={{ fontSize: 20, marginBottom: 2 }}>{a.icon}</div>
                    <div style={{ fontSize: 9, color: "hsl(var(--dayz-text-muted))", fontFamily: "'Golos Text', sans-serif", lineHeight: 1 }}>{a.label}</div>
                    {a.locked && <Icon name="Lock" size={10} style={{ color: "hsl(var(--dayz-text-muted))", position: "absolute", top: 4, right: 4 }} />}
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 12, color: "hsl(var(--dayz-green-bright))", textDecoration: "none", fontFamily: "'Golos Text', sans-serif" }}>
                Все достижения →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid hsl(var(--dayz-border))", background: "hsl(220 20% 6%)", padding: "32px 0 20px" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 8 }}>
                DAYZ<span style={{ color: "hsl(var(--dayz-green-bright))" }}>HUB</span>
              </div>
              <p style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))", lineHeight: 1.6 }}>
                Платформа для администраторов серверов DayZ. Скрипты, моды и сообщество.
              </p>
            </div>
            {[
              { title: "Каталог", links: ["Скрипты", "Моды", "Консультации", "VIP подписка"] },
              { title: "Сообщество", links: ["Форум", "Достижения", "Личные сообщения", "Топ серверов"] },
              { title: "Поддержка", links: ["FAQ", "Арбитраж", "Обратная связь", "Реклама"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, fontWeight: 600, color: "hsl(var(--dayz-green-bright))", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>{col.title}</div>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{ display: "block", fontSize: 13, color: "hsl(var(--dayz-text-muted))", marginBottom: 6, textDecoration: "none", fontFamily: "'Golos Text', sans-serif", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "white")}
                    onMouseLeave={e => (e.currentTarget.style.color = "hsl(var(--dayz-text-muted))")}
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid hsl(var(--dayz-border))", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "hsl(var(--dayz-text-muted))" }}>© 2024 DayZ HUB. Не является официальным ресурсом Bohemia Interactive.</span>
            <div className="flex items-center gap-1">
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(var(--dayz-green-bright))" }} />
              <span style={{ fontSize: 12, color: "hsl(var(--dayz-green-bright))" }}>Все системы работают</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}