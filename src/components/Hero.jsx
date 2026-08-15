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
    </section>
  );
}
