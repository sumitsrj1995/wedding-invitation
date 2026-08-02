import { createCalendarEvent } from '../utils/helpers';

export default function EventDetails({ couple }) {
  const handleCalendar = () => {
    createCalendarEvent({
      title: `${couple.names} Wedding Celebration`,
      description: 'Join us for a celebration of love and community.',
      location: `${couple.location}, ${couple.city}`,
      start: new Date('2026-10-17T16:00:00'),
      end: new Date('2026-10-17T23:00:00')
    });
  };

  return (
    <section id="details" className="section-shell">
      <div className="section-title">Event Details</div>
      <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <article className="card" style={{ padding: 'clamp(1rem, 5vw, 1.4rem)' }}>
          <div className="text-smallcaps" style={{ color: 'var(--sage)', fontSize: 'clamp(0.65rem, 2vw, 0.75rem)' }}>Ceremony</div>
          <h3 style={{ margin: '0.4rem 0', fontSize: 'clamp(1rem, 4vw, 1.3rem)' }}>The Vows</h3>
          <p style={{ margin: '0 0 0.8rem', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{couple.time}</p>
          <p style={{ margin: '0 0 0.8rem', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}><strong>{couple.location}</strong><br />{couple.address}</p>
          <a href={couple.mapUrl} target="_blank" rel="noreferrer" className="button">Open Map</a>
        </article>
        <article className="card" style={{ padding: 'clamp(1rem, 5vw, 1.4rem)' }}>
          <div className="text-smallcaps" style={{ color: 'var(--sage)', fontSize: 'clamp(0.65rem, 2vw, 0.75rem)' }}>Reception</div>
          <h3 style={{ margin: '0.4rem 0', fontSize: 'clamp(1rem, 4vw, 1.3rem)' }}>Dinner & Dancing</h3>
          <p style={{ margin: '0 0 0.8rem', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>Following the ceremony, we will gather for dinner, toasts, and a night of celebration.</p>
          <button className="button" onClick={handleCalendar}>Add to Calendar</button>
        </article>
      </div>
    </section>
  );
}
