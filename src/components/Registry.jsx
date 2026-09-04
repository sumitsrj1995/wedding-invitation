import { useInvitationCopy, useUiStrings } from '../context/LanguageContext';

export default function Registry({ registry }) {
  const ui = useUiStrings();
  const copy = useInvitationCopy();

  return (
    <section className="section-shell">
      <div className="section-title">{ui.giftRegistry}</div>
      <div className="card" style={{ padding: '1.4rem' }}>
        <p style={{ marginTop: 0 }}>{copy.registryIntro}</p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {registry.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="button">{item.label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
