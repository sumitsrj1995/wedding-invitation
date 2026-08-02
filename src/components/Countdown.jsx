import { useEffect, useState } from 'react';
import { formatCountdown, getTimeRemaining } from '../utils/helpers';

export default function Countdown({ date }) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(new Date(date)));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(getTimeRemaining(new Date(date)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [date]);

  const items = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Minutes', value: remaining.minutes },
    { label: 'Seconds', value: remaining.seconds }
  ];

  return (
    <section className="section-shell">
      <div className="section-title">Countdown</div>
      <div className="card" style={{ padding: '1.6rem', textAlign: 'center' }}>
        <p className="text-smallcaps" style={{ color: 'var(--sage)' }}>The Day Approaches</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {items.map((item) => (
            <div key={item.label} style={{ minWidth: '90px', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'Cormorant Garamond, serif' }}>{item.value}</div>
              <div className="text-smallcaps" style={{ fontSize: '0.7rem' }}>{item.label}</div>
            </div>
          ))}
        </div>
        {remaining.finished ? <p>We are celebrating now.</p> : null}
      </div>
    </section>
  );
}
