import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  zip: string;
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    country: '',
    city: '',
    address: '',
    zip: '',
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6" style={{ background: '#FFFDF7' }}>
        <div className="w-20 h-20 flex items-center justify-center rounded-full" style={{ background: 'rgba(76,175,125,0.08)', border: '1px solid rgba(76,175,125,0.15)' }}>
          <i className="ri-shopping-bag-line text-3xl" style={{ color: '#4CAF7D' }} />
        </div>
        <h1 className="font-playfair text-3xl" style={{ color: '#1A2E1A' }}>Votre panier est vide</h1>
        <p className="text-sm" style={{ color: '#4A6741' }}>Ajoutez des produits avant de finaliser votre commande.</p>
        <Link
          to="/"
          onClick={() => { window.location.hash = 'shop'; }}
          className="cursor-pointer whitespace-nowrap px-6 py-3 rounded-full text-xs font-medium tracking-wide transition-all"
          style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
        >
          Retour a la boutique
        </Link>
      </div>
    );
  }

  const update = (key: keyof FormData, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.country || !form.city || !form.address) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // 1. Call Stripe checkout edge function (prices are verified server-side now)
      const { data: stripeData, error: stripeErr } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          items: items.map((i) => ({
            product_id: String(i.id),
            quantity: i.quantity,
          })),
          currency: 'USD',
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        },
      });

      if (stripeErr || !stripeData?.sessionId) {
        throw new Error(stripeErr?.message || 'Erreur lors de la creation du paiement');
      }

      const { url, sessionId } = stripeData;

      // 2. Create order in database — link to user if authenticated
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const recipient = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone || undefined,
        country: form.country,
        state: '',
        city: form.city,
        address: form.address,
        zip: form.zip || undefined,
      };

      const orderPayload: Record<string, unknown> = {
        currency: 'USD',
        payment_provider: 'stripe',
        status: 'pending_payment',
        subtotal_items: subtotal,
        checkout_session_id: sessionId,
        recipient,
      };
      if (user) {
        orderPayload.customer_id = user.id;
      }

      const { data: orderHeader, error: orderErr } = await supabase
        .from('order_headers')
        .insert(orderPayload)
        .select('id')
        .single();

      if (orderErr || !orderHeader) {
        throw new Error(orderErr?.message || 'Erreur lors de la creation de la commande');
      }

      const orderItems = items.map((i) => ({
        order_id: orderHeader.id,
        product_id: String(i.id),
        product_name: i.name,
        quantity: i.quantity,
        unit_price: i.price,
        final_price: i.price,
        subtotal: i.price * i.quantity,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw new Error(itemsErr.message);

      // 3. Redirect to Stripe (cart is NOT cleared yet — will be cleared on success page)
      window.location.href = url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(msg);
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white/50 focus:bg-white';

  return (
    <div className="min-h-screen" style={{ background: '#FFFDF7' }}>
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="cursor-pointer">
          <span className="font-playfair text-lg tracking-[0.2em] uppercase font-light" style={{ color: '#1A2E1A' }}>
            Tchalove Mbakop
          </span>
        </Link>
        <Link to="/" className="cursor-pointer text-xs tracking-widest uppercase" style={{ color: '#4A6741' }}>
          Retour
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Form */}
          <div>
            <h1 className="font-playfair text-4xl mb-2" style={{ color: '#1A2E1A' }}>Finaliser la commande</h1>
            <p className="text-sm mb-8" style={{ color: '#4A6741', opacity: 0.7 }}>Saisissez vos informations pour recevoir votre musique.</p>

            {!user && (
              <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(76,175,125,0.08)', border: '1px solid rgba(76,175,125,0.15)', color: '#2D7A4F' }}>
                <p className="flex items-center gap-2">
                  <i className="ri-information-line text-base" />
                  <span><strong>Vous avez deja un compte ?</strong>{' '}
                    <Link to="/connexion" className="underline cursor-pointer">Connectez-vous</Link> pour que vos achats soient associes automatiquement.
                  </span>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)', color: '#FF6B4A' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Prenom *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    className={inputClass}
                    style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Nom *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    className={inputClass}
                    style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputClass}
                  style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Telephone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className={inputClass}
                  style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Pays *</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => update('country', e.target.value)}
                    className={inputClass}
                    style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Ville *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className={inputClass}
                    style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Adresse *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  className={inputClass}
                  style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color: '#4A6741', opacity: 0.6 }}>Code postal</label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => update('zip', e.target.value)}
                  className={inputClass}
                  style={{ border: '1px solid rgba(45,122,79,0.15)', color: '#1A2E1A' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer whitespace-nowrap w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium tracking-wide transition-all disabled:opacity-60 mt-4"
                style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <i className="ri-secure-payment-line" />
                    Payer ${totalPrice.toFixed(2)} avec Stripe
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs mt-4" style={{ color: '#4A6741', opacity: 0.4 }}>
                <div className="flex items-center gap-1.5">
                  <i className="ri-lock-line" /> Paiement securise
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="ri-shield-check-line" /> Stripe
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order summary */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="p-6 rounded-2xl" style={{ background: '#F0FBF4', border: '1px solid rgba(45,122,79,0.1)' }}>
              <h2 className="font-playfair text-xl mb-6" style={{ color: '#1A2E1A' }}>Resume de la commande</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium" style={{ color: '#1A2E1A' }}>{item.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: '#4A6741', opacity: 0.6 }}>Qte: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#2D7A4F' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(45,122,79,0.1)' }}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: '#4A6741' }}>Sous-total</span>
                  <span className="text-sm" style={{ color: '#1A2E1A' }}>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: '#4A6741' }}>Livraison</span>
                  <span className="text-sm" style={{ color: '#2D7A4F' }}>Gratuite (digital)</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid rgba(45,122,79,0.15)' }}>
                  <span className="font-playfair text-lg" style={{ color: '#1A2E1A' }}>Total</span>
                  <span className="font-playfair text-2xl" style={{ color: '#2D7A4F' }}>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}