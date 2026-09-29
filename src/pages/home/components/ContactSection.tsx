import { useState, useRef, useEffect } from 'react';

// Liens courriel pré-remplis (en attendant le branchement d'un vrai formulaire)
const mailBody = [
  'Bonjour Tchalove,',
  '',
  'Nom :',
  'Téléphone :',
  'Type de demande (collaboration, presse, booking, autre) :',
  '',
  'Votre message :',
  '',
  '',
].join('\n');
const buildMailto = (to: string, subject: string) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
const MAILTO_CONTACT = buildMailto('contact@tchalovembakop.com', 'Demande de contact via le site Tchalove Mbakop');
const MAILTO_BOOKING = buildMailto('booking@tchalovembakop.com', 'Demande de booking via le site Tchalove Mbakop');

export default function ContactSection() {
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



  return (
    <>
      <section id="contact" className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFDF7 0%, #F0FBF4 100%)' }} ref={sectionRef}>

        {/* Tropical decorative blobs */}
        <div className="absolute top-0 left-1/2 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none" style={{ background: 'radial-gradient(circle, #4CAF7D 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left */}
            <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px]" style={{ background: '#2D7A4F' }} />
                <span className="text-xs tracking-[0.5em] uppercase font-medium" style={{ color: '#2D7A4F' }}>Contact</span>
              </div>
              <h2 className="font-playfair text-5xl md:text-6xl leading-tight mb-8" style={{ color: '#1A2E1A' }}>
                Restons en<br />
                <span className="italic" style={{ color: '#2D7A4F' }}>Contact</span>
              </h2>
              <p className="font-light leading-relaxed text-[15px] mb-8" style={{ color: '#4A6741', opacity: 0.8 }}>
                Pour toute demande de collaboration artistique, presse, management ou booking, n'hésitez pas à me contacter.&nbsp;
              </p>

              <a
                href={MAILTO_CONTACT}
                className="cursor-pointer inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide text-white mb-12 transition-all duration-200 hover:opacity-90"
                style={{ background: '#2D7A4F' }}
              >
                <i className="ri-mail-send-line text-base" />
                Écrire un message
              </a>

              {/* Contact Info */}
              <div className="space-y-5">
                {[
                  { icon: 'ri-mail-line', label: 'Email', value: 'contact@tchalovembakop.com', href: MAILTO_CONTACT },
                  { icon: 'ri-briefcase-line', label: 'Management', value: 'booking@tchalovembakop.com', href: MAILTO_BOOKING },
                  { icon: 'ri-map-pin-line', label: 'Basée AU', value: 'Canada', href: undefined },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full shrink-0" style={{ border: '1px solid rgba(76,175,125,0.3)', background: 'rgba(76,175,125,0.08)' }}>
                      <i className={`${item.icon} text-base`} style={{ color: '#2D7A4F' }} />
                    </div>
                    <div>
                      <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: '#4A6741', opacity: 0.5 }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="cursor-pointer text-sm underline-offset-4 hover:underline" style={{ color: '#1A2E1A' }}>{item.value}</a>
                      ) : (
                        <div className="text-sm" style={{ color: '#1A2E1A' }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mt-12 flex gap-4">
                {[
                  { icon: 'ri-instagram-line', label: 'Instagram', href: '#' },
                  { icon: 'ri-spotify-line', label: 'Spotify', href: '#' },
                  { icon: 'ri-youtube-line', label: 'YouTube', href: 'https://www.youtube.com/@TchaloveMbakopofficielle' },
                  { icon: 'ri-tiktok-line', label: 'TikTok', href: '#' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : 'nofollow'}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    aria-label={s.label}
                    className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                    style={{ border: '1.5px solid rgba(76,175,125,0.25)', color: '#4CAF7D' }}
                  >
                    <i className={`${s.icon} text-base`} />
                  </a>
                ))}
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Footer — fond vert tropical foncé */}
      <footer className="px-6 pt-16 pb-8" style={{ background: 'linear-gradient(135deg, #1A2E1A 0%, #2D4A2D 100%)' }}>
        <div className="max-w-7xl mx-auto">
          {/* 3 colonnes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-16">
            {/* Col 1 — Navigation */}
            <div>
              <div className="text-xs tracking-[0.3em] uppercase mb-5 pb-3" style={{ color: 'rgba(76,175,125,0.6)', borderBottom: '1px solid rgba(76,175,125,0.1)' }}>Navigation</div>
              <ul className="space-y-3">
                {['Accueil', 'À Propos', 'Musique', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" rel="nofollow" className="cursor-pointer text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2 — YouTube */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="text-xs tracking-[0.3em] uppercase mb-5 pb-3 w-full" style={{ color: 'rgba(76,175,125,0.6)', borderBottom: '1px solid rgba(76,175,125,0.1)' }}>YouTube</div>
              <a
                href="https://www.youtube.com/@TchaloveMbakopofficielle"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex items-center gap-3 mb-4 group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105" style={{ background: '#FF0000' }}>
                  <i className="ri-youtube-fill text-white text-2xl" />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>@TchaloveMbakopofficielle</span>
              </a>
              <div className="font-playfair font-bold leading-none mt-2" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: 'rgba(255,255,255,0.85)' }}>
                Tchalove Mbakop
              </div>
            </div>

            {/* Col 3 — Contact */}
            <div>
              <div className="text-xs tracking-[0.3em] uppercase mb-5 pb-3" style={{ color: 'rgba(76,175,125,0.6)', borderBottom: '1px solid rgba(76,175,125,0.1)' }}>Contact</div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ background: 'rgba(76,175,125,0.1)', border: '1px solid rgba(76,175,125,0.2)' }}>
                    <i className="ri-mail-line text-sm" style={{ color: '#4CAF7D' }} />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Email</div>
                    <a href={MAILTO_CONTACT} className="cursor-pointer text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}>contact@tchalovembakop.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ background: 'rgba(76,175,125,0.1)', border: '1px solid rgba(76,175,125,0.2)' }}>
                    <i className="ri-map-pin-line text-sm" style={{ color: '#4CAF7D' }} />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Localisation</div>
                    <div className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Canada</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full shrink-0" style={{ background: 'rgba(76,175,125,0.1)', border: '1px solid rgba(76,175,125,0.2)' }}>
                    <i className="ri-global-line text-sm" style={{ color: '#4CAF7D' }} />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Site réalisé par</div>
                    <a href="https://independancedays.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer text-sm underline hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      independancedays.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8" style={{ borderTop: '1px solid rgba(76,175,125,0.1)' }}>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2026 Tchalove Mbakop. Tous droits réservés.</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Site créé par{' '}
              <a href="https://independancedays.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer underline hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>
                independancedays.com
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
