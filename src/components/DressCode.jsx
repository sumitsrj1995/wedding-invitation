export default function PresenceMessage() {
  return (
    <section className="section-shell presence-section">
      <div className="presence-panel">
        <p className="text-smallcaps">A note from the couple</p>
        <h2>Your Presence,<br /><em>Our Greatest Gift</em></h2>
        <div className="presence-rule" aria-hidden="true" />
        <p>
          More than anything, we ask for your blessings and your presence
          on our special day. Having you there to celebrate with us
          means more than any gift ever could.
        </p>
      </div>
      <style>{`
        .presence-section { padding-top: clamp(3rem, 7vw, 5rem); padding-bottom: clamp(3rem, 7vw, 5rem); }
        .presence-panel { max-width: 46rem; margin: 0 auto; padding: clamp(2.5rem, 7vw, 5rem) clamp(1.5rem, 6vw, 5rem); text-align: center; border-top: 1px solid var(--gold-pale); border-bottom: 1px solid var(--gold-pale); }
        .presence-panel .text-smallcaps { margin: 0; color: var(--sage-deep); font-size: 0.62rem; }.presence-panel h2 { margin: 1rem 0 0; font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 500; line-height: 0.98; letter-spacing: -0.045em; }.presence-panel h2 em { color: var(--gold-leaf); font-weight: 400; }.presence-rule { width: 3rem; height: 1px; background: var(--gold-leaf); margin: 1.5rem auto; }.presence-panel p:last-child { max-width: 31rem; margin: 0 auto; color: var(--muted); font-size: clamp(1rem, 1.5vw, 1.12rem); line-height: 1.8; }
      `}</style>
    </section>
  );
}
