import { useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import MusicSection from './components/MusicSection';
import ShopSection from './components/ShopSection';
import ContactSection from './components/ContactSection';

export default function HomePage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Small delay to ensure layout is fully rendered
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, []);

  return (
    <main className="min-h-screen" style={{ background: '#FFFDF7' }}>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MusicSection />
      <ShopSection />
      <ContactSection />
    </main>
  );
}
