export default function Footer({ couple }) {
  return (
    <footer className="section-shell invitation-footer">
      <div className="footer-ornament" aria-hidden="true">✦</div>
      <div className="text-script footer-names">{couple.names}</div>
      <p>We look forward to celebrating with you.</p>
      <div className="footer-rule" />
      <style>{`
        .invitation-footer { padding-top: 2rem; padding-bottom: 3.5rem; text-align: center; }.footer-ornament { color: var(--gold-leaf); font-size: 0.75rem; margin-bottom: 0.85rem; }.footer-names { font-size: clamp(2.2rem, 5vw, 3.2rem); line-height: 1; }.invitation-footer p { margin: 0.9rem 0 1.25rem; color: var(--muted); }.footer-rule { width: 8rem; height: 1px; margin: 0 auto; background: linear-gradient(90deg, transparent, var(--gold-leaf), transparent); }
      `}</style>
    </footer>
  );
}
