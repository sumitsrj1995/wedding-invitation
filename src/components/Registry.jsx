export default function Registry({ registry }) {
  return (
    <section className="section-shell">
      <div className="section-title">Gift Registry</div>
      <div className="card" style={{ padding: '1.4rem' }}>
        <p style={{ marginTop: 0 }}>Your presence is the greatest gift, though if you wish to celebrate with a token, we have shared a few favorites below.</p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {registry.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="button">{item.label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
