import { useInvitationCopy } from '../context/LanguageContext';

export default function PresenceMessage() {
  const copy = useInvitationCopy();

  return (
    <section className="section-shell presence-section">
      <div className="presence-panel">
        <p className="text-smallcaps">{copy.presenceKicker}</p>
        <h2>
          {copy.presenceHeadingLine1}
          <br />
          <em>{copy.presenceHeadingEmphasis}</em>
        </h2>
        <div className="presence-rule" aria-hidden="true" />
        <p>{copy.presenceBody}</p>
      </div>
    </section>
  );
}
