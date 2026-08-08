import { createCalendarEvent } from '../utils/helpers';

export default function EventDetails({ couple, eventDateTime }) {
  const handleCalendar = () => {
    const start = new Date(eventDateTime);
    const end = new Date(start.getTime() + 7 * 60 * 60 * 1000);

    createCalendarEvent({
      title: `${couple.names} Wedding Celebration`,
      description: 'Join us for a celebration of love and community.',
      location: `${couple.location}, ${couple.city}`,
      start,
      end
    });
  };

  return (
    <section id="details" className="section-shell event-details">
      <div className="section-title">Event Details</div>
      <div className="event-grid">
        <article className="event-card event-venue">
          <div className="text-smallcaps">The Ceremony</div>
          <h3>The Vows</h3>
          <p className="event-time">{couple.time}</p>
          <p className="event-location"><strong>{couple.location}</strong><br />{couple.city}<br /><span>{couple.address}</span></p>
          <a href={couple.mapUrl} target="_blank" rel="noreferrer" className="button">Open Map</a>
        </article>
        <article className="event-card event-reception">
          <div className="text-smallcaps">The Reception</div>
          <h3>Dinner &amp; Dancing</h3>
          <p>Following the ceremony, we will gather for dinner, toasts, and a night of celebration.</p>
          <button className="button" onClick={handleCalendar}>Add to Calendar</button>
        </article>
      </div>
      <style>{`
        .event-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid var(--line); border-radius: var(--radius-soft); overflow: hidden; box-shadow: 0 16px 42px rgba(51,43,37,0.045); }
        .event-card { padding: clamp(1.75rem, 5vw, 3.25rem); min-height: 19rem; display: flex; flex-direction: column; align-items: flex-start; background: rgba(255,253,249,0.3); }
        .event-card + .event-card { border-left: 1px solid var(--line); } .event-card .text-smallcaps { color: var(--sage-deep); font-size: 0.63rem; }
        .event-card h3 { margin: 0.8rem 0 0.35rem; font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 500; letter-spacing: -0.04em; }
        .event-card p { color: var(--muted); font-size: 1.02rem; max-width: 24rem; } .event-time { color: var(--gold-leaf) !important; font-style: italic; font-size: 1.2rem !important; margin: 0 0 1.35rem; }
        .event-location { margin: 0 0 1.7rem; line-height: 1.65; } .event-location strong { color: var(--ink); font-size: 1.18rem; font-weight: 500; } .event-location span { font-size: 0.88rem; }
        .event-card .button { margin-top: auto; }
        @media (max-width: 640px) { .event-grid { grid-template-columns: 1fr; } .event-card { min-height: 0; padding: 2rem 1.5rem; } .event-card + .event-card { border-left: 0; border-top: 1px solid var(--line); } }
      `}</style>
    </section>
  );
}
