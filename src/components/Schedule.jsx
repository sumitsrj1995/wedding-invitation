export default function Schedule({ schedule }) {
  return (
    <section className="section-shell">
      <div className="section-title">The Day</div>
      <div className="card" style={{ padding: '1.2rem' }}>
        {schedule.map((item, index) => (
          <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 0', borderTop: index ? '1px solid rgba(184,147,90,0.2)' : 'none' }}>
            <div className="text-smallcaps" style={{ color: 'var(--sage)', minWidth: '90px' }}>{item.time}</div>
            <div style={{ fontSize: '1.1rem' }}>{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
