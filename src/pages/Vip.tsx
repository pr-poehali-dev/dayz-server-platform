import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: 'Code2', text: 'Доступ ко всем VIP скриптам и модам' },
  { icon: 'Zap', text: 'Приоритетная поддержка в форуме' },
  { icon: 'Trophy', text: 'Эксклюзивное достижение VIP (+100 очков)' },
  { icon: 'Crown', text: 'Золотая метка VIP рядом с именем' },
  { icon: 'Star', text: 'Ранний доступ к новым скриптам' },
  { icon: 'Megaphone', text: 'Скидка 20% на рекламу сервера' },
];

const PLANS = [
  { name: '1 месяц', price: 299, days: 30, popular: false },
  { name: '3 месяца', price: 749, days: 90, popular: true, save: 'Экономия 148₽' },
  { name: '1 год', price: 2490, days: 365, popular: false, save: 'Экономия 1098₽' },
];

export default function Vip() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4" style={{ padding: '48px 16px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            VIP Подписка
          </h1>
          <p style={{ fontSize: 16, color: 'hsl(var(--dayz-text-muted))', maxWidth: 500, margin: '0 auto' }}>
            Получите полный доступ к платформе и все преимущества для администраторов DayZ
          </p>
        </div>

        {user?.is_vip ? (
          <div style={{ textAlign: 'center', padding: 40, background: 'hsl(var(--dayz-green) / 0.05)', border: '1px solid hsl(var(--dayz-green) / 0.3)', borderRadius: 8, marginBottom: 40 }}>
            <Icon name="CheckCircle" size={40} style={{ color: 'hsl(var(--dayz-green-bright))', margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 8 }}>У вас уже есть VIP!</div>
            <div style={{ fontSize: 14, color: 'hsl(var(--dayz-text-muted))' }}>Наслаждайтесь всеми преимуществами подписки</div>
          </div>
        ) : null}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan, i) => (
            <div key={i} style={{ position: 'relative', background: plan.popular ? 'linear-gradient(135deg, hsl(35 70% 14%), hsl(220 18% 12%))' : 'hsl(var(--dayz-surface))', border: `2px solid ${plan.popular ? 'hsl(35 90% 50%)' : 'hsl(var(--dayz-border))'}`, borderRadius: 8, padding: 28, textAlign: 'center' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'hsl(35 90% 55%)', color: '#1a0f00', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 20, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                  ПОПУЛЯРНЫЙ
                </div>
              )}
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{plan.name}</div>
              {plan.save && <div style={{ fontSize: 12, color: 'hsl(var(--dayz-green-bright))', marginBottom: 12, fontWeight: 600 }}>{plan.save}</div>}
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 40, fontWeight: 700, color: plan.popular ? '#f59e0b' : 'white', marginBottom: 4 }}>
                {plan.price}₽
              </div>
              <div style={{ fontSize: 12, color: 'hsl(var(--dayz-text-muted))', marginBottom: 24 }}>
                = {Math.round(plan.price / plan.days)}₽/день
              </div>
              <button style={{ width: '100%', background: plan.popular ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'hsl(var(--dayz-green))', color: plan.popular ? '#1a0f00' : 'hsl(220 15% 8%)', border: 'none', borderRadius: 4, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}
                onClick={() => alert('Подключение платёжной системы — следующий шаг!')}>
                {user?.is_vip ? 'Продлить' : 'Оформить'}
              </button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20, textAlign: 'center' }}>
            Что входит в VIP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 4, background: 'hsl(var(--dayz-green) / 0.1)', border: '1px solid hsl(var(--dayz-green) / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={f.icon} size={18} style={{ color: 'hsl(var(--dayz-green-bright))' }} />
                </div>
                <span style={{ fontSize: 14, color: 'hsl(var(--dayz-text))' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: 'hsl(var(--dayz-surface))', border: '1px solid hsl(var(--dayz-border))', borderRadius: 4, padding: 24 }}>
          <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, color: 'white', textTransform: 'uppercase', marginBottom: 16 }}>Частые вопросы</h3>
          {[
            { q: 'Как оплатить?', a: 'Принимаем карты Visa, МИР, и переводы СБП.' },
            { q: 'Можно ли вернуть деньги?', a: 'Возврат в течение 48 часов, если VIP не использовался.' },
            { q: 'Как активируется VIP?', a: 'Автоматически после оплаты. Статус отображается в профиле.' },
          ].map((faq, i) => (
            <div key={i} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: i < 2 ? '1px solid hsl(var(--dayz-border))' : 'none' }}>
              <div style={{ fontWeight: 600, color: 'white', fontSize: 14, marginBottom: 6 }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: 'hsl(var(--dayz-text-muted))', lineHeight: 1.5 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
