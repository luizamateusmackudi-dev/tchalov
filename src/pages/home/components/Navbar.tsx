import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/feature/CartDrawer';

const navLinks = [
  { label: 'Accueil', href: '#home' },
  { label: 'A Propos', href: '#about' },
  { label: 'Musique', href: '#music' },
  { label: 'Boutique', href: '#shop' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ['home', 'about', 'music', 'shop', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'py-3 border-b' : 'bg-transparent py-6'
        }`}
        style={scrolled ? { background: 'rgba(255,253,247,0.97)', backdropFilter: 'blur(12px)', borderColor: 'rgba(45,122,79,0.12)' } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="cursor-pointer">
            <span className="font-playfair text-xl tracking-[0.3em] uppercase font-light" style={{ color: scrolled ? '#1A2E1A' : '#1A2E1A' }}>
              Tchalove Mbakop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const id = link.href.replace('#', '');
              return (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="cursor-pointer text-sm tracking-widest uppercase font-light transition-all duration-300 whitespace-nowrap"
                  style={{ color: activeSection === id ? '#2D7A4F' : '#4A6741', opacity: activeSection === id ? 1 : 0.7 }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Auth + Social + Cart */}
          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated ? (
              <Link
                to="/mon-compte"
                className="cursor-pointer flex items-center gap-1.5 text-sm tracking-widest uppercase font-light transition-all whitespace-nowrap"
                style={{ color: '#4A6741', opacity: 0.8 }}
              >
                <i className="ri-user-line" />
                {user?.email?.split('@')[0]}
              </Link>
            ) : (
              <Link
                to="/connexion"
                className="cursor-pointer flex items-center gap-1.5 text-sm tracking-widest uppercase font-light transition-all whitespace-nowrap"
                style={{ color: '#4A6741', opacity: 0.7 }}
              >
                <i className="ri-user-line" />
                Connexion
              </Link>
            )}

            <a href="#" rel="nofollow" className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer" style={{ color: '#4CAF7D' }}>
              <i className="ri-instagram-line text-lg" />
            </a>
            <a href="#" rel="nofollow" className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer" style={{ color: '#4CAF7D' }}>
              <i className="ri-spotify-line text-lg" />
            </a>
            <a href="https://www.youtube.com/@tchalovembakop" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer" style={{ color: '#4CAF7D' }}>
              <i className="ri-youtube-line text-lg" />
            </a>

            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              className="cursor-pointer relative w-8 h-8 flex items-center justify-center transition-colors"
              style={{ color: '#4CAF7D' }}
              aria-label="Ouvrir le panier"
            >
              <i className="ri-shopping-bag-line text-lg" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: '#FF6B4A' }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="cursor-pointer relative w-8 h-8 flex items-center justify-center"
              style={{ color: '#1A2E1A' }}
              aria-label="Ouvrir le panier"
            >
              <i className="ri-shopping-bag-line text-lg" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: '#FF6B4A' }}
                >
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              style={{ color: '#1A2E1A' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className={`text-xl ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
          } border-t`}
          style={{ background: 'rgba(255,253,247,0.98)', borderColor: 'rgba(45,122,79,0.1)' }}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="cursor-pointer text-sm tracking-widest uppercase font-light text-left py-2 whitespace-nowrap"
                style={{ color: '#4A6741' }}
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/mon-compte"
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer text-sm tracking-widest uppercase font-light text-left py-2 whitespace-nowrap"
                  style={{ color: '#2D7A4F' }}
                >
                  <i className="ri-user-line mr-1.5" />
                  Mon compte
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="cursor-pointer text-sm tracking-widest uppercase font-light text-left py-2 whitespace-nowrap"
                  style={{ color: '#4A6741' }}
                >
                  <i className="ri-logout-box-r-line mr-1.5" />
                  Deconnexion
                </button>
              </>
            ) : (
              <Link
                to="/connexion"
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer text-sm tracking-widest uppercase font-light text-left py-2 whitespace-nowrap"
                style={{ color: '#2D7A4F' }}
              >
                <i className="ri-user-line mr-1.5" />
                Connexion / Inscription
              </Link>
            )}
            <div className="flex gap-4 pt-2">
              <a href="#" rel="nofollow" className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ color: '#4CAF7D' }}>
                <i className="ri-instagram-line text-lg" />
              </a>
              <a href="#" rel="nofollow" className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ color: '#4CAF7D' }}>
                <i className="ri-spotify-line text-lg" />
              </a>
              <a href="https://www.youtube.com/@tchalovembakop" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ color: '#4CAF7D' }}>
                <i className="ri-youtube-line text-lg" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}