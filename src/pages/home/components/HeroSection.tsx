import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.transform = 'translateY(0)';
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-[90vh] w-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF8EE 40%, #F0FBF4 100%)' }}>

      {/* Tropical decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #4CAF7D 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #FF6B4A 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #F9C846 0%, transparent 70%)' }} />

      {/* Tropical leaf pattern top-left */}
      <div className="absolute top-8 left-8 opacity-10 pointer-events-none">
        <i className="ri-leaf-line text-[#2D7A4F]" style={{ fontSize: '120px' }} />
      </div>
      <div className="absolute bottom-16 left-24 opacity-8 pointer-events-none rotate-45">
        <i className="ri-plant-line text-[#4CAF7D]" style={{ fontSize: '80px' }} />
      </div>

      {/* Vidéo d'arrière-plan — début du clip Meli, sans son */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/tchalove-mbakop-meli-clip-officiel.mp4"
          poster="/videos/tchalove-mbakop-meli-clip-officiel.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Tchalove Mbakop — extrait du clip Meli"
        />
        {/* Fondu gauche léger — juste pour lisibilité du texte */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #FFFDF7 28%, rgba(255,253,247,0.6) 45%, transparent 65%)' }} />
        {/* Fondu bas très léger */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(255,253,247,0.4) 0%, transparent 15%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full w-full">
        <div className="max-w-7xl mx-auto px-6 w-full py-20">
          <div className="max-w-2xl">

            {/* Tropical tag */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full opacity-0"
              style={{ animation: 'fadeUp 0.8s ease forwards 0.3s', background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.3)' }}
            >
              <i className="ri-leaf-line text-[#2D7A4F] text-sm" />
              <span className="text-[#2D7A4F] text-xs tracking-[0.3em] uppercase font-medium">Artiste Camerounaise</span>
            </div>

            <h1
              ref={titleRef}
              className="font-playfair leading-[1.05] mb-8 opacity-0 -translate-y-4 transition-all duration-1000"
              style={{ fontSize: 'clamp(60px, 8vw, 120px)', color: '#1A2E1A' }}
            >
              TCHALOVE
              <br />
              <span className="italic" style={{ color: '#2D7A4F' }}>MBAKOP</span>
            </h1>

            <p
              className="text-lg font-light leading-relaxed mb-10 max-w-md opacity-0 translate-y-4"
              style={{ animation: 'fadeUp 0.8s ease forwards 0.7s', color: '#4A6741' }}
            >
              La voix du Cameroun qui fait vibrer l'Afrique — là où les rythmes ancestraux rencontrent l'émotion d'aujourd'hui.
            </p>

            <div
              className="flex flex-wrap gap-4 opacity-0 translate-y-4"
              style={{ animation: 'fadeUp 0.8s ease forwards 1s' }}
            >
              <button
                onClick={() => handleNav('music')}
                className="cursor-pointer whitespace-nowrap px-8 py-4 text-white text-sm tracking-widest uppercase font-medium rounded-full transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)' }}
              >
                Écouter
              </button>
              <button
                onClick={() => handleNav('about')}
                className="cursor-pointer whitespace-nowrap px-8 py-4 text-sm tracking-widest uppercase font-light rounded-full transition-all duration-300 hover:bg-[#2D7A4F]/10"
                style={{ border: '1.5px solid #2D7A4F', color: '#2D7A4F' }}
              >
                Mon histoire
              </button>
            </div>

            {/* Scroll indicator */}
            <div
              className="mt-20 flex items-center gap-3 opacity-0"
              style={{ animation: 'fadeUp 0.8s ease forwards 1.4s' }}
            >
              <div className="w-8 h-[1px]" style={{ background: '#4CAF7D' }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#4CAF7D' }}>Défiler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll bounce arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <i className="ri-arrow-down-line text-xl w-6 h-6 flex items-center justify-center" style={{ color: '#4CAF7D' }} />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
