import { createCalendarEvent } from '../utils/helpers';
import { useInvitationCopy, useUiStrings } from '../context/LanguageContext';

export default function EventDetails({ couple, eventDateTime, receptionTime }) {
  const ui = useUiStrings();
  const copy = useInvitationCopy();

  const handleCalendar = () => {
    const start = new Date(eventDateTime);
    const end = new Date(start.getTime() + 7 * 60 * 60 * 1000);

    createCalendarEvent({
      title: copy.calendarEventTitle(couple.names),
      description: copy.calendarEventDescription,
      location: `${couple.location}, ${couple.city}`,
      start,
      end,
      filename: ui.calendarDownloadFilename
    });
  };

  return (
    <section id="details" className="section-shell event-details">
      <div className="section-title">{ui.eventDetails}</div>
      <div className="event-grid">
        <article className="event-card event-venue">
          <div className="text-smallcaps"></div>
          <h3>{copy.ceremonyTitle}</h3>
          <p className="event-time">{couple.time}</p>
          <p className="event-location"><strong>{couple.location}</strong><br />{couple.city}<br /><span>{couple.address}</span></p>
          <a href={couple.mapUrl} target="_blank" rel="noreferrer" className="button">{ui.openMap}</a>
        </article>
        <article className="event-card event-reception">
          <div className="text-smallcaps"></div>
          <h3>{copy.dinnerTitle}</h3>
          <p className="event-time">{receptionTime ?? copy.defaultReceptionTime}</p>
          <p>{copy.dinnerDescription}</p>
          <button className="button" onClick={handleCalendar}>{ui.addToCalendar}</button>
        </article>
      </div>
    </section>
  );
}
