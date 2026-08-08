// Fixed: Hero card styling updated to ensure blessing-of-parents and button content fits within invitation card without overflow (Bug 3)
export default function Hero({ couple }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="text-smallcaps hero-kicker">A Celebration of Love</p>
        <div className="hero-ornament" aria-hidden="true">✦</div>
        <h1 className="text-script hero-name">
          {couple.groom}
        </h1>
        <p className="text-smallcaps hero-weds">weds</p>
        <h1 className="text-script hero-name">
          {couple.bride}
        </h1>
        <div className="hero-rule" aria-hidden="true" />
        <p className="hero-invitation">
          Together with our families,<br />
          we joyfully invite you to our wedding.
        </p>
        <p className="text-smallcaps hero-date">{couple.date}</p>
        <div className="hero-blessings">
          <div>With the blessings of</div>
          <div>{couple.groomParents}</div>
          <div className="hero-and">and</div>
          <div>{couple.brideParents}</div>
        </div>
        <div className="hero-action">
          <a href="#details" className="button">View Details</a>
        </div>
      </div>
      <style>{`
        .hero-section { width: 100%; padding: clamp(1.25rem, 4vw, 3rem); text-align: center; }
        .hero-content { position: relative; width: 100%; max-width: 36rem; margin: 0 auto; padding: clamp(2rem, 6vw, 3.5rem) clamp(0.25rem, 2vw, 1.5rem); }
        .hero-content::before, .hero-content::after { content: ''; position: absolute; top: 0; bottom: 0; width: 1px; background: linear-gradient(transparent, var(--gold-pale) 18%, var(--gold-pale) 82%, transparent); }
        .hero-content::before { left: 0; } .hero-content::after { right: 0; }
        .hero-kicker { margin: 0 0 0.9rem; color: var(--sage-deep); }
        .hero-ornament { color: var(--gold-leaf); font-size: 0.8rem; margin-bottom: 0.45rem; }
        .hero-name { font-size: clamp(3.5rem, 10vw, 6.5rem); margin: 0; line-height: 0.82; color: var(--ink); }
        .hero-weds { margin: 0.9rem 0 0.75rem; color: var(--gold-leaf); font-size: 0.63rem; }
        .hero-rule { width: 4.5rem; height: 1px; margin: 1.6rem auto; background: linear-gradient(90deg, transparent, var(--gold-leaf), transparent); }
        .hero-invitation { margin: 0 auto 1.1rem; max-width: 26rem; color: var(--muted); font-size: clamp(0.9rem, 2vw, 1.02rem); }
        .hero-date { margin: 0 0 1.25rem; color: var(--sage-deep); font-size: clamp(0.63rem, 1.5vw, 0.72rem); }
        .hero-blessings { color: var(--muted); font-size: clamp(0.78rem, 1.7vw, 0.9rem); line-height: 1.6; }
        .hero-blessings > div + div { margin-top: 0.28rem; } .hero-and { color: var(--gold-leaf); font-style: italic; }
        .hero-action { display: flex; justify-content: center; margin-top: 1.7rem; }
        @media (max-width: 480px) { .hero-content { padding: 1.6rem 0.6rem; } .hero-name { font-size: clamp(3.1rem, 17vw, 4.4rem); } }
      `}</style>
    </section>
  );
}
