import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
      return;
    }

    navigate('/mon-compte');
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white/50 focus:bg-white';

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#FFFDF7' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="cursor-pointer inline-block">
            <span className="font-playfair text-xl tracking-[0.2em] uppercase font-light" style={{ color: '#1A2E1A' }}>
              Tchalove Mbakop
            </span>
          </Link>
        </div>

        <div className="p-8 rounded-2xl" style={{ background: '#F0FBF4', border: '1px solid rgba(45,122,79,0.1)' }}>
          <h1 className="font-playfair text-3xl mb-2" style={{ color: '#1A2E1A' }}>Connexion</h1>
          <p className="text-sm mb-6" style={{ color: '#4A6741', opacity: 0.7 }}>
            Accedez a votre compte pour retrouver vos achats.
          </p>

          {error && (
            <div className="mb-5 p-4 rounded-xl text-sm" style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)', color: '#FF6B4A' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                required
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer whitespace-nowrap w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <i className="ri-login-box-line" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#4A6741' }}>
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="font-medium cursor-pointer" style={{ color: '#2D7A4F' }}>
                Creer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}