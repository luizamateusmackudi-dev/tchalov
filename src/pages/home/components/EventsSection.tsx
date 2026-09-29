import { useState, useEffect, useRef } from 'react';
import { events } from '@/mocks/events';

const countries = ['Tous les pays', 'France', 'Belgique', 'Suisse', 'Canada'];

export default function EventsSection() {
  const [filter, setFilter] = useState('Tous les pays');
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

  const filtered = filter === 'Tous les pays' ? events : events.filter((e) => e.country === filter);

  return (
    <section id="events" className="bg-[#0D0D0D] py-32 px-6" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase">Tournée 2026</span>
            </div>
            <h2 className="font-playfair text-white text-5xl md:text-6xl italic">
              Dates de<br />Concerts
            </h2>
          </div>
          <div className="lg:max-w-sm">
            <p className="text-white/40 font-light leading-relaxed text-sm mb-6">
              Rejoignez Tchalove Mbakop sur scène lors de ses prochaines représentations à travers la France et l'Europe. Une expérience musicale inoubliable vous attend.
            </p>
            {/* Country filter */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="cursor-pointer w-full bg-[#141414] border border-white/10 text-white/70 text-sm rounded-xl px-4 py-3 appearance-none pr-8 focus:outline-none focus:border-[#D4AF37]/40"
              >
                {countries.map((c) => (
                  <option key={c} value={c} className="bg-[#141414]">{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-down-s-line text-white/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Events list */}
        <div className="space-y-3">
          {filtered.map((event, idx) => (
            <div
              key={event.id}
              className={`group bg-[#141414] border border-white/5 rounded-2xl px-6 md:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-300 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: visible ? `${idx * 80}ms` : '0ms' }}
            >
              {/* Date */}
              <div className="text-center shrink-0 min-w-[60px]">
                <div className="font-playfair text-[#D4AF37] leading-none" style={{ fontSize: '42px' }}>
                  {event.day}
                </div>
                <div className="text-white/40 text-xs tracking-widest uppercase mt-1">{event.month}</div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-[1px] h-10 bg-white/10 shrink-0" />

              {/* Info */}
              <div className="flex-1">
                <div className="font-playfair text-white text-2xl">{event.city}</div>
                <div className="text-white/40 text-sm mt-1">{event.venue}</div>
              </div>

              {/* Details */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-time-line text-sm" />
                  </div>
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-map-pin-line text-sm" />
                  </div>
                  {event.country}
                </div>
                <a
                  href={event.ticketUrl}
                  className="cursor-pointer whitespace-nowrap px-6 py-2.5 bg-[#D4AF37] text-[#0A0A0A] text-xs tracking-widest uppercase font-medium rounded-full hover:bg-white transition-colors duration-200"
                  rel="nofollow"
                >
                  Billets
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <i className="ri-calendar-line text-4xl mb-4 block" />
            <p>Aucun concert prévu pour ce pays pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
