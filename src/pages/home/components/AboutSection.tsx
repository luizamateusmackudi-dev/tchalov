import { useRef, useEffect, useState } from 'react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '15+', label: 'Années de scène' },
    { value: '8', label: 'Albums & Singles' },
    { value: '12', label: 'Pays en tournée' },
    { value: '500K+', label: 'Fans sur les réseaux' },
  ];

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F0FBF4 0%, #FFFDF7 100%)' }} ref={sectionRef}>

      {/* Decorative tropical elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #4CAF7D 0%, transparent 70%)', transform: 'translate(40%, -40%)' }} />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #FF6B4A 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px]" style={{ background: '#2D7A4F' }} />
          <span className="text-xs tracking-[0.5em] uppercase font-medium" style={{ color: '#2D7A4F' }}>À Propos</span>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Text */}
          <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <h2 className="font-playfair text-5xl md:text-6xl leading-tight mb-8" style={{ color: '#1A2E1A' }}>
              La reine<br />
              <span className="italic" style={{ color: '#2D7A4F' }}>du Cameroun</span><br />
              en musique
            </h2>
            <div className="space-y-5 font-light leading-relaxed text-[15px]" style={{ color: '#4A6741' }}>
              <p>
                Née à Bangangté, au cœur du Cameroun, Tchalove Mbakop grandit bercée par les rythmes envoûtants du Makossa et du Benskin. Elle est la veuve du regretté auteur-compositeur Mbakop Idylle, à qui l'on doit notamment la célèbre chanson Sorry, sortie en 1986.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className={`relative transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="w-full h-[550px] rounded-2xl overflow-hidden" style={{ border: '3px solid rgba(76,175,125,0.2)' }}>
              <img
                src="https://storage.readdy-site.link/project_files/b873666f-f57d-4993-b41c-b9c395fd31fd/7812335c-6336-480a-ae5b-bb84f5daebc6_VNefv.jpg?v=c3e717cd070df3e8d37d1ead62b23116"
                alt="Portrait de Tchalove Mbakop, artiste camerounaise"
                className="w-full h-full object-cover object-top"
              />
            </div>

          </div>
        </div>


      </div>
    </section>
  );
}
