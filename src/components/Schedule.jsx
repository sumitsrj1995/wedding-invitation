export default function Schedule({ schedule }) {
  return (
    <section className="section-shell schedule-section">
      <div className="section-title">The Day</div>
      <div className="schedule-timeline">
        {schedule.map((item, index) => (
          <div key={item.title} className="schedule-item">
            <div className="schedule-time text-smallcaps">{item.time}</div>
            <div className="schedule-marker" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="schedule-title">{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
