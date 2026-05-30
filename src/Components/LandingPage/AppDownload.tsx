import React, { useEffect, useRef, useState } from 'react';

const AppDownload: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [dots, setDots] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animated ellipsis
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: '⚡', label: 'Instant Booking' },
    { icon: '📍', label: 'Live Tracking' },
    { icon: '🔔', label: 'Real-time Alerts' },
    { icon: '⭐', label: 'Verified Experts' },
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, #00674F 0%, #005240 40%, #003d30 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Decorative background blobs ── */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(167,209,198,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      {/* Floating rings */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '700px',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px', height: '500px',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* ── Main content ── */}
      <div style={{
        maxWidth: '860px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', position: 'relative', zIndex: 2,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>

        {/* ── Badge ── */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '100px',
          padding: '8px 20px',
          marginBottom: '32px',
          backdropFilter: 'blur(10px)',
        }}>
          <span style={{ fontSize: '16px' }}>📱</span>
          <span style={{
            color: '#A7D1C6', fontSize: '13px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            Mobile App
          </span>
        </div>

        {/* ── Headline ── */}
        <h2 style={{
          color: '#ffffff',
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          lineHeight: 1.1,
          margin: '0 0 16px',
          letterSpacing: '-1px',
        }}>
          Something Big Is
        </h2>
        <h2 style={{
          background: 'linear-gradient(90deg, #A7D1C6 0%, #ffffff 50%, #A7D1C6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          lineHeight: 1.1,
          margin: '0 0 32px',
          letterSpacing: '-1px',
        }}>
          Coming Soon{dots}
        </h2>

        {/* ── Subtitle ── */}
        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: '18px',
          lineHeight: 1.7,
          maxWidth: '560px',
          margin: '0 0 52px',
          fontWeight: 400,
        }}>
          The Murammat.pk mobile app is on its way — bringing faster bookings,
          live tracking, and exclusive deals straight to your pocket.
        </p>

        {/* ── Feature pills ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '12px',
          justifyContent: 'center', marginBottom: '56px',
        }}>
          {features.map((f, i) => (
            <div
              key={f.label}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '100px',
                padding: '12px 22px',
                backdropFilter: 'blur(8px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${0.2 + i * 0.1}s, transform 0.5s ease ${0.2 + i * 0.1}s`,
              }}
            >
              <span style={{ fontSize: '18px' }}>{f.icon}</span>
              <span style={{ color: '#E0EFEA', fontSize: '14px', fontWeight: 600 }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* ── Notify me card ── */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px',
          padding: '36px 40px',
          backdropFilter: 'blur(16px)',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
          transition: 'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s',
        }}>
          <p style={{
            color: '#A7D1C6', fontSize: '12px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
            margin: '0 0 8px',
          }}>
            Be the First to Know
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.85)', fontSize: '15px',
            margin: '0 0 24px', lineHeight: 1.5,
          }}>
            Drop your email and we'll notify you the moment we launch on iOS & Android.
          </p>

          <NotifyForm />

          {/* Store placeholders */}
          <div style={{
            display: 'flex', gap: '12px', justifyContent: 'center',
            marginTop: '24px', paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            {[
              { label: 'App Store', icon: '' },
              { label: 'Google Play', icon: '' },
            ].map(store => (
              <div
                key={store.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  flex: 1, justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '18px' }}>{store.icon === '' && store.label === 'App Store' ? '🍎' : '▶'}</span>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Available soon
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>
                    {store.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// ── Notify form sub-component ──────────────────────────────────────────────
const NotifyForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        justifyContent: 'center',
        background: 'rgba(167,209,198,0.15)',
        border: '1px solid rgba(167,209,198,0.4)',
        borderRadius: '14px',
        padding: '14px 20px',
      }}>
        <span style={{ fontSize: '20px' }}>🎉</span>
        <span style={{ color: '#A7D1C6', fontWeight: 600, fontSize: '14px' }}>
          You're on the list! We'll notify you at launch.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="your@email.com"
        style={{
          flex: 1,
          padding: '13px 18px',
          borderRadius: '12px',
          border: `1px solid ${focused ? 'rgba(167,209,198,0.6)' : 'rgba(255,255,255,0.15)'}`,
          background: 'rgba(255,255,255,0.08)',
          color: '#ffffff',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '13px 22px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #A7D1C6, #00c896)',
          color: '#003d30',
          fontWeight: 800,
          fontSize: '14px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.15s, transform 0.15s',
          boxShadow: '0 4px 16px rgba(0,200,150,0.3)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '1';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        }}
      >
        Notify Me
      </button>
    </form>
  );
};

export default AppDownload;