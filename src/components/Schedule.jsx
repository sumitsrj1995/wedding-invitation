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
      <style>{`
        .schedule-timeline { max-width: 48rem; margin: 0 auto; } .schedule-item { display: grid; grid-template-columns: minmax(5rem, 0.8fr) 3rem minmax(0, 2fr); align-items: center; min-height: 6rem; }
        .schedule-time { color: var(--sage-deep); font-size: 0.62rem; text-align: right; } .schedule-marker { position: relative; align-self: stretch; display: grid; place-items: center; }
        .schedule-marker::before { content: ''; position: absolute; top: 0; bottom: 0; width: 1px; background: var(--gold-pale); } .schedule-item:first-child .schedule-marker::before { top: 50%; } .schedule-item:last-child .schedule-marker::before { bottom: 50%; }
        .schedule-marker span { position: relative; z-index: 1; width: 1.8rem; height: 1.8rem; display: grid; place-items: center; border: 1px solid var(--gold-leaf); border-radius: 50%; background: var(--ivory); color: var(--gold-leaf); font-family: 'Jost', sans-serif; font-size: 0.53rem; letter-spacing: 0.05em; }
        .schedule-title { padding-left: 1rem; font-size: clamp(1.25rem, 2.5vw, 1.7rem); letter-spacing: -0.02em; }
        @media (max-width: 420px) { .schedule-item { grid-template-columns: 4.3rem 2.5rem minmax(0, 1fr); } .schedule-title { padding-left: 0.6rem; font-size: 1.2rem; } .schedule-time { font-size: 0.55rem; } }
      `}</style>
    </section>
  );
}
