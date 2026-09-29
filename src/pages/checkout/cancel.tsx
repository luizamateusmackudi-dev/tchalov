import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CheckoutCancelPage() {
  useEffect(() => {
    document.title = 'Paiement annulé | Tchalove Mbakop';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: '#FFFDF7' }}>
      <div className="w-20 h-20 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)' }}>
        <i className="ri-close-line text-3xl" style={{ color: '#FF6B4A' }} />
      </div>
      <h1 className="font-playfair text-4xl" style={{ color: '#1A2E1A' }}>Paiement annulé</h1>
      <p className="text-sm max-w-sm leading-relaxed" style={{ color: '#4A6741' }}>
        Le paiement a été annulé ou interrompu. Aucun montant n'a été débité. Votre panier est toujours disponible.
      </p>
      <div className="flex gap-3">
        <Link
          to="/checkout"
          className="cursor-pointer whitespace-nowrap px-6 py-3 rounded-full text-xs font-medium tracking-wide transition-all"
          style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
        >
          Réessayer
        </Link>
        <Link
          to="/"
          className="cursor-pointer whitespace-nowrap px-6 py-3 rounded-full text-xs font-medium tracking-wide transition-all"
          style={{ border: '1px solid rgba(45,122,79,0.25)', color: '#4A6741' }}
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}