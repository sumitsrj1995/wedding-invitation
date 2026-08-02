export default function Footer({ couple }) {
  return (
    <footer className="section-shell" style={{ paddingTop: '1rem', paddingBottom: '3rem', textAlign: 'center' }}>
      <div className="text-script" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{couple.names}</div>
      <p style={{ margin: '0 0 0.8rem' }}>We look forward to celebrating with you.</p>
      <div style={{ width: '140px', height: '1px', background: 'rgba(184,147,90,0.45)', margin: '0 auto' }} />
    </footer>
  );
}
