import { useInvitationCopy, useUiStrings } from '../context/LanguageContext';

export default function Hero({ couple }) {
  const ui = useUiStrings();
  const copy = useInvitationCopy();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="text-smallcaps hero-kicker">{copy.heroKicker}</p>
        <div className="hero-ornament" aria-hidden="true">✦</div>
        <h1 className="text-script hero-name">
          {couple.groom}
        </h1>
        <p className="text-smallcaps hero-weds">{copy.heroWeds}</p>
        <h1 className="text-script hero-name">
          {couple.bride}
        </h1>
        <div className="hero-rule" aria-hidden="true" />
        <p className="hero-invitation">
          {copy.heroInvitationLine1}
          <br />
          {copy.heroInvitationLine2}
        </p>
        <p className="text-smallcaps hero-date">{couple.date}</p>
        <div className="hero-blessings">
          <div>{copy.heroBlessingsIntro}</div>
          <div>{couple.groomParents}</div>
          <div className="hero-and">{ui.and}</div>
          <div>{couple.brideParents}</div>
        </div>
        <div className="hero-action">
          <a href="#details" className="button">{ui.viewDetails}</a>
        </div>
      </div>
    </section>
  );
}
