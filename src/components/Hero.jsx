// Fixed: Hero card styling updated to ensure blessing-of-parents and button content fits within invitation card without overflow (Bug 3)
export default function Hero({ couple }) {
  return (
    <section className="section-shell" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', width: '100%' }}>
      <div style={{ textAlign: 'center', maxWidth: 'clamp(300px, 90vw, 520px)', margin: '0 auto', width: '100%' }}>
        <p className="text-smallcaps" style={{ marginBottom: 'clamp(0.4rem, 2vw, 0.6rem)', color: 'var(--sage)', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)' }}>A Celebration of Love</p>
        <h1 className="text-script" style={{ fontSize: 'clamp(1.4rem, 8vw, 3.2rem)', margin: '0 0 0.2rem', lineHeight: 1.1 }}>
          {couple.groom}
        </h1>
        <p className="text-smallcaps" style={{ margin: '0 0 0.2rem', letterSpacing: '0.15em', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)' }}>weds</p>
        <h1 className="text-script" style={{ fontSize: 'clamp(1.4rem, 8vw, 3.2rem)', margin: '0 0 0.6rem', lineHeight: 1.1 }}>
          {couple.bride}
        </h1>
        <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', margin: '0 auto 0.6rem', lineHeight: 1.4 }}>
          Together with our families,<br />
          we joyfully invite you to our wedding.
        </p>
        <p className="text-smallcaps" style={{ marginBottom: 'clamp(0.6rem, 2vw, 0.8rem)', letterSpacing: '0.12em', fontSize: 'clamp(0.6rem, 1.2vw, 0.65rem)' }}>{couple.date}</p>
        <div style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)', margin: '0 auto 1rem', lineHeight: 1.5, color: 'var(--text)' }}>
          <div style={{ marginBottom: '0.2rem' }}>With the blessings of</div>
          <div style={{ marginBottom: '0.4rem', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)' }}>Mr. &amp; Mrs. {couple.groomParents}</div>
          <div style={{ marginBottom: '0.4rem', fontSize: 'clamp(0.55rem, 1.2vw, 0.65rem)' }}>and</div>
          <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)' }}>Mr. &amp; Mrs. {couple.brideParents}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
          <a href="#details" className="button">View Details</a>
        </div>
      </div>
    </section>
  );
}
