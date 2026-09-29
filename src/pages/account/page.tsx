import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  audio_url?: string;
}

interface Order {
  id: number;
  status: string;
  created_at: string;
  subtotal_items: number;
  order_items: OrderItem[];
}

const trackAudioMap: Record<string, string> = {
  '100000': 'https://storage.readdy-site.link/project_files/b873666f-f57d-4993-b41c-b9c395fd31fd/ddbd9e90-6364-4852-9a48-874468965d5b_Meli.mp3?v=156543873cd37bcb0efa78ccc521e315',
  '100001': 'https://storage.readdy-site.link/project_files/b873666f-f57d-4993-b41c-b9c395fd31fd/5fa807c3-134c-4804-b586-177e48bcbfee_Keulobouatom.mp3?v=ad2198230aec2fd203d547cc9a5fbc04',
};

export default function AccountPage() {
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/connexion');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('order_headers')
      .select('id, status, created_at, subtotal_items, order_items(product_id, product_name, quantity, unit_price, subtotal)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });
    if (data) {
      const enriched = data.map((order) => {
        const items = order.order_items.map((item: OrderItem) => {
          const pid = String(item.product_id);
          return {
            ...item,
            audio_url: trackAudioMap[pid] || '',
          };
        });
        return { ...order, order_items: items } as Order;
      });
      setOrders(enriched);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, fetchOrders]);

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.mp3`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen" style={{ background: '#FFFDF7' }}>
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="cursor-pointer">
          <span className="font-playfair text-lg tracking-[0.2em] uppercase font-light" style={{ color: '#1A2E1A' }}>
            Tchalove Mbakop
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline" style={{ color: '#4A6741' }}>
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="cursor-pointer whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all"
            style={{ background: 'rgba(45,122,79,0.1)', color: '#2D7A4F' }}
          >
            <i className="ri-logout-box-r-line" />
            Deconnexion
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="font-playfair text-4xl mb-2" style={{ color: '#1A2E1A' }}>Mon compte</h1>
        <p className="text-sm mb-8" style={{ color: '#4A6741', opacity: 0.7 }}>
          Retrouvez ici l'historique de vos achats et vos telechargements.
        </p>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12" style={{ color: '#4A6741' }}>
            <div className="w-4 h-4 border-2 border-[#2D7A4F]/30 border-t-[#2D7A4F] rounded-full animate-spin" />
            Chargement...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4" style={{ background: 'rgba(76,175,125,0.08)', border: '1px solid rgba(76,175,125,0.15)' }}>
              <i className="ri-music-2-line text-2xl" style={{ color: '#4CAF7D' }} />
            </div>
            <p className="font-playfair text-xl mb-2" style={{ color: '#1A2E1A' }}>Aucun achat pour le moment</p>
            <p className="text-sm mb-6" style={{ color: '#4A6741', opacity: 0.7 }}>
              Vos achats apparaissent ici des que vous avez effectue une commande.
            </p>
            <Link
              to="/"
              onClick={() => { window.location.hash = 'shop'; }}
              className="cursor-pointer whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all"
              style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
            >
              <i className="ri-shopping-bag-line" />
              Explorer la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="p-6 rounded-2xl" style={{ background: '#F0FBF4', border: '1px solid rgba(45,122,79,0.1)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium" style={{ color: '#1A2E1A' }}>Commande #{order.id}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#4A6741', opacity: 0.6 }}>
                      {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={
                      order.status === 'paid' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                        ? { background: 'rgba(76,175,125,0.12)', color: '#2D7A4F' }
                        : { background: 'rgba(249,200,70,0.12)', color: '#D4A000' }
                    }
                  >
                    {order.status === 'paid' ? 'Payee' : order.status === 'pending_payment' ? 'En attente' : order.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.order_items.map((item) => {
                    const hasDownload = !!item.audio_url;
                    const isBundle = String(item.product_id) === '100002';

                    return (
                      <div key={item.product_id}>
                        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#1A2E1A' }}>{item.product_name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#4A6741', opacity: 0.6 }}>
                              Qte: {item.quantity} — ${item.subtotal.toFixed(2)}
                            </p>
                          </div>
                          {hasDownload && !isBundle && (
                            <button
                              onClick={() => handleDownload(item.audio_url!, item.product_name)}
                              className="cursor-pointer whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all"
                              style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
                            >
                              <i className="ri-download-line" />
                              Telecharger
                            </button>
                          )}
                        </div>

                        {/* Bundle: show individual tracks */}
                        {isBundle && (
                          <div className="mt-2 ml-3 pl-3 space-y-2" style={{ borderLeft: '2px solid rgba(45,122,79,0.15)' }}>
                            {Object.entries(trackAudioMap).map(([pid, url]) => (
                              <div key={pid} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,253,247,0.8)' }}>
                                <span className="text-sm" style={{ color: '#4A6741' }}>
                                  {pid === '100000' ? 'Meli' : 'Kelobouatom'}
                                </span>
                                <button
                                  onClick={() => handleDownload(url, pid === '100000' ? 'Meli' : 'Kelobouatom')}
                                  className="cursor-pointer whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                                  style={{ background: 'rgba(45,122,79,0.1)', color: '#2D7A4F' }}
                                >
                                  <i className="ri-download-line" />
                                  Telecharger
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 flex justify-between" style={{ borderTop: '1px solid rgba(45,122,79,0.1)' }}>
                  <span className="text-xs" style={{ color: '#4A6741', opacity: 0.6 }}>Total</span>
                  <span className="text-sm font-medium" style={{ color: '#2D7A4F' }}>${order.subtotal_items?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}