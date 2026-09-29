import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    const { error: err } = await signUp(email, password);
    if (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white/50 focus:bg-white';

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#FFFDF7' }}>
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6" style={{ background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.2)' }}>
            <i className="ri-check-line text-3xl" style={{ color: '#4CAF7D' }} />
          </div>
          <h1 className="font-playfair text-3xl mb-3" style={{ color: '#1A2E1A' }}>Inscription reussie !</h1>
          <p className="text-sm mb-6" style={{ color: '#4A6741' }}>
            Votre compte a ete cree avec succes. Vous pouvez maintenant vous connecter.
          </p>
          <Link
            to="/connexion"
            className="cursor-pointer whitespace-nowrap inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all"
            style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
          >
            <i className="ri-login-box-line" />
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#FFFDF7' }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="cursor-pointer inline-block">
            <span className="font-playfair text-xl tracking-[0.2em] uppercase font-light" style={{ color: '#1A2E1A' }}>
              Tchalove Mbakop
            </span>
          </Link>
        </div>

        <div className="p-8 rounded-2xl" style={{ background: '#F0FBF4', border: '1px solid rgba(45,122,79,0.1)' }}>
          <h1 className="font-playfair text-3xl mb-2" style={{ color: '#1A2E1A' }}>Inscription</h1>
          <p className="text-sm mb-6" style={{ color: '#4A6741', opacity: 0.7 }}>
            Creez un compte pour acceder a vos achats et telechargements a tout moment.
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
              <p className="text-xs mt-1" style={{ color: '#4A6741', opacity: 0.5 }}>Minimum 6 caracteres</p>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <i className="ri-user-add-line" />
                  Creer mon compte
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#4A6741' }}>
              Deja un compte ?{' '}
              <Link to="/connexion" className="font-medium cursor-pointer" style={{ color: '#2D7A4F' }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}