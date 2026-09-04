import { useEffect, useState } from 'react';
import { useInvitationCopy, useUiStrings } from '../context/LanguageContext';
import { getTimeRemaining } from '../utils/helpers';

export default function Countdown({ date }) {
  const ui = useUiStrings();
  const copy = useInvitationCopy();
  const [remaining, setRemaining] = useState(() => getTimeRemaining(new Date(date)));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(getTimeRemaining(new Date(date)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [date]);

  const items = [
    { key: 'days', label: ui.days, value: remaining.days },
    { key: 'hours', label: ui.hours, value: remaining.hours },
    { key: 'minutes', label: ui.minutes, value: remaining.minutes },
    { key: 'seconds', label: ui.seconds, value: remaining.seconds }
  ];

  return (
    <section className="section-shell countdown-section">
      <div className="countdown-heading">
        <p className="text-smallcaps">{copy.countdownHeading}</p>
        <div aria-hidden="true" className="countdown-flourish">✦</div>
      </div>
      <div className="countdown-grid">
          {items.map((item) => (
            <div key={item.key} className="countdown-item">
              <div className="countdown-value">{String(item.value).padStart(2, '0')}</div>
              <div className="text-smallcaps countdown-label">{item.label}</div>
            </div>
          ))}
      </div>
      {remaining.finished ? <p className="countdown-finished">{copy.countdownFinished}</p> : null}
    </section>
  );
}
