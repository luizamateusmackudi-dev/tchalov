import { useState, useEffect, useRef } from 'react';
import { galleryImages } from '@/mocks/gallery';

const categories = ['Tous', 'Concert', 'Portrait', 'Studio', 'Backstage'];

export default function GallerySection() {
  const [filter, setFilter] = useState('Tous');
  const [lightbox, setLightbox] = useState<typeof galleryImages[0] | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight' && lightbox) {
        const idx = filtered.findIndex((i) => i.id === lightbox.id);
        setLightbox(filtered[(idx + 1) % filtered.length]);
      }
      if (e.key === 'ArrowLeft' && lightbox) {
        const idx = filtered.findIndex((i) => i.id === lightbox.id);
        setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, filter]);

  const filtered = filter === 'Tous' ? galleryImages : galleryImages.filter((i) => i.category === filter);

  const col1 = filtered.filter((_, i) => i % 3 === 0);
  const col2 = filtered.filter((_, i) => i % 3 === 1);
  const col3 = filtered.filter((_, i) => i % 3 === 2);

  return (
    <section id="gallery" className="bg-[#0A0A0A] py-32 px-6" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase">Galerie</span>
            </div>
            <h2 className="font-playfair text-white text-5xl md:text-6xl">Photos</h2>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`cursor-pointer px-4 py-2 rounded-full text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-200 ${
                  filter === cat
                    ? 'bg-[#D4AF37] text-[#0A0A0A] font-medium'
                    : 'border border-white/15 text-white/50 hover:text-white hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {[col1, col2, col3].map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-4">
              {col.map((img) => (
                <div
                  key={img.id}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group"
                  style={{ aspectRatio: `${img.width}/${img.height}` }}
                  onClick={() => setLightbox(img)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                      <div className="w-10 h-10 flex items-center justify-center border border-white rounded-full">
                        <i className="ri-zoom-in-line text-white text-lg" />
                      </div>
                      <span className="text-white text-xs tracking-widest uppercase">{img.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="cursor-pointer absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <i className="ri-close-line text-2xl" />
          </button>
          <button
            className="cursor-pointer absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/20 rounded-full text-white/60 hover:text-white hover:border-white/50 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              const idx = filtered.findIndex((i) => i.id === lightbox.id);
              setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length]);
            }}
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>
          <button
            className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/20 rounded-full text-white/60 hover:text-white hover:border-white/50 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              const idx = filtered.findIndex((i) => i.id === lightbox.id);
              setLightbox(filtered[(idx + 1) % filtered.length]);
            }}
          >
            <i className="ri-arrow-right-s-line text-xl" />
          </button>
          <div
            className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[85vh] object-contain"
            />
            <div className="bg-[#141414] px-6 py-4">
              <div className="text-white font-playfair text-lg">{lightbox.alt}</div>
              <div className="text-white/40 text-xs tracking-widest uppercase mt-1">{lightbox.category}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
