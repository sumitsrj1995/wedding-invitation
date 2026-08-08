export default function Gallery({ images }) {
  return (
    <section className="section-shell gallery-section">
      <div className="section-title">Moments to Come</div>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <figure key={image} className={`gallery-item gallery-item-${index + 1}`}>
            <img src={image} alt={`Wedding gallery image ${index + 1}`} loading="lazy" />
          </figure>
        ))}
      </div>
      <style>{`
        .gallery-grid { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: clamp(4.5rem, 10vw, 8rem); gap: clamp(0.55rem, 1.4vw, 1rem); }
        .gallery-item { margin: 0; overflow: hidden; background: var(--blush); border-radius: var(--radius-soft); } .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 700ms cubic-bezier(.2,.65,.25,1), filter 500ms ease; }
        .gallery-item:hover img { transform: scale(1.055); filter: saturate(0.9) contrast(1.03); }
        .gallery-item-1 { grid-column: span 3; grid-row: span 3; } .gallery-item-2 { grid-column: span 3; grid-row: span 2; } .gallery-item-3 { grid-column: span 2; grid-row: span 2; } .gallery-item-4 { grid-column: span 2; grid-row: span 2; } .gallery-item-5 { grid-column: span 2; grid-row: span 2; } .gallery-item-6 { grid-column: span 6; grid-row: span 2; }
        @media (max-width: 640px) { .gallery-grid { grid-auto-rows: 4.5rem; gap: 0.55rem; } .gallery-item-1 { grid-column: span 6; grid-row: span 4; } .gallery-item-2, .gallery-item-3, .gallery-item-4, .gallery-item-5 { grid-column: span 3; grid-row: span 2; } .gallery-item-6 { grid-column: span 6; grid-row: span 3; } }
      `}</style>
    </section>
  );
}
