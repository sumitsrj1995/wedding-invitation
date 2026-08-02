export default function OurStory({ story }) {
  return (
    <section id="story" className="section-shell">
      <div className="section-title">Our Story</div>
      <div style={{ display: 'grid', gap: '1.25rem', position: 'relative', paddingLeft: '1.2rem' }}>
        <div style={{ position: 'absolute', left: '0.2rem', top: '0.4rem', bottom: '0.4rem', width: '1px', background: 'rgba(184,147,90,0.4)' }} />
        {story.map((item, index) => (
          <article key={item.title} className="card" style={{ padding: '1.2rem 1.25rem', marginLeft: '1rem' }}>
            <div className="text-smallcaps" style={{ color: 'var(--sage)', marginBottom: '0.3rem' }}>{index + 1}</div>
            <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.25rem' }}>{item.title}</h3>
            <p style={{ margin: 0 }}>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
