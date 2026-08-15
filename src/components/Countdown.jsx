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
    </section>
  );
}
