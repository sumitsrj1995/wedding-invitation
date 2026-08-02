export default function Gallery({ images }) {
  return (
    <section className="section-shell">
      <div className="section-title">Moments to Come</div>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {images.map((image, index) => (
          <figure key={image} className="card" style={{ overflow: 'hidden', padding: '0.6rem' }}>
            <img src={image} alt={`Wedding gallery image ${index + 1}`} loading="lazy" style={{ borderRadius: '0.8rem', transition: 'transform 220ms ease' }} />
          </figure>
        ))}
      </div>
    </section>
  );
}
