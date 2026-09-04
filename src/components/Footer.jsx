import { useInvitationCopy } from '../context/LanguageContext';

export default function Footer({ couple }) {
  const copy = useInvitationCopy();

  return (
    <footer className="section-shell invitation-footer">
      <div className="footer-ornament" aria-hidden="true">✦</div>
      <div className="text-script footer-names">{couple.names}</div>
      <p>{copy.footerClosing}</p>
      <div className="footer-rule" />
    </footer>
  );
}
