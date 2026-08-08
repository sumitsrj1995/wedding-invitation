import { useEffect, useState } from 'react';
import { getTimeRemaining } from '../utils/helpers';

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
    <section className="section-shell countdown-section">
      <div className="countdown-heading">
        <p className="text-smallcaps">Counting down to our day</p>
        <div aria-hidden="true" className="countdown-flourish">✦</div>
      </div>
      <div className="countdown-grid">
          {items.map((item) => (
            <div key={item.label} className="countdown-item">
              <div className="countdown-value">{String(item.value).padStart(2, '0')}</div>
              <div className="text-smallcaps countdown-label">{item.label}</div>
            </div>
          ))}
      </div>
      {remaining.finished ? <p className="countdown-finished">We are celebrating now.</p> : null}
      <style>{`
        .countdown-section { text-align: center; padding-top: clamp(3rem, 7vw, 5rem); padding-bottom: clamp(3rem, 7vw, 5rem); }
        .countdown-heading .text-smallcaps { margin: 0; color: var(--sage-deep); } .countdown-flourish { color: var(--gold-leaf); margin: 0.85rem 0 1.6rem; font-size: 0.8rem; }
        .countdown-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); max-width: 45rem; margin: 0 auto; border-top: 1px solid var(--gold-pale); border-bottom: 1px solid var(--gold-pale); }
        .countdown-item { min-width: 0; padding: clamp(1rem, 3vw, 1.8rem) 0.35rem; } .countdown-item + .countdown-item { border-left: 1px solid var(--gold-pale); }
        .countdown-value { font-size: clamp(2rem, 5vw, 3.65rem); line-height: 1; letter-spacing: -0.05em; } .countdown-label { margin-top: 0.65rem; font-size: clamp(0.52rem, 1.2vw, 0.65rem); color: var(--muted); letter-spacing: 0.13em; }
        .countdown-finished { margin: 1rem 0 0; color: var(--sage-deep); }
      `}</style>
    </section>
  );
}
