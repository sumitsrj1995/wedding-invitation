export default function Footer({ couple }) {
  return (
    <footer className="section-shell invitation-footer">
      <div className="footer-ornament" aria-hidden="true">✦</div>
      <div className="text-script footer-names">{couple.names}</div>
      <p>We look forward to celebrating with you.</p>
      <div className="footer-rule" />
    </footer>
  );
}
