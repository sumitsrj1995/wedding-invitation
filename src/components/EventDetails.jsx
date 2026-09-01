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
      <div className="section-title">The Celebration Call</div>
      <div className="event-grid">
        <article className="event-card event-venue">
          <div className="text-smallcaps"></div>
          <h3>Join us for the beginning</h3>
          <p className="event-time">{couple.time}</p>
          <p className="event-location"><strong>{couple.location}</strong><br />{couple.city}<br /><span>{couple.address}</span></p>
          <a href={couple.mapUrl} target="_blank" rel="noreferrer" className="button">Open Map</a>
        </article>
        <article className="event-card event-reception">
          <div className="text-smallcaps"></div>
          <h3>Dinner</h3>
          <p className="event-time">6:30 PM</p>
          <p>Following the ceremony, we will gather for dinner, and a night of celebration.</p>
          <button className="button" onClick={handleCalendar}>Add to Calendar</button>
        </article>
      </div>
    </section>
  );
}
