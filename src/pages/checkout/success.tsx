import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface DownloadItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  audio_url: string;
}

const trackAudioMap: Record<string, string> = {
  '100000': 'https://storage.readdy-site.link/project_files/b873666f-f57d-4993-b41c-b9c395fd31fd/ddbd9e90-6364-4852-9a48-874468965d5b_Meli.mp3?v=156543873cd37bcb0efa78ccc521e315',
  '100001': 'https://storage.readdy-site.link/project_files/b873666f-f57d-4993-b41c-b9c395fd31fd/5fa807c3-134c-4804-b586-177e48bcbfee_Keulobouatom.mp3?v=ad2198230aec2fd203d547cc9a5fbc04',
};

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderItems, setOrderItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [source, setSource] = useState<string>('');
  const { clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'Paiement confirme | Tchalove Mbakop';
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    const verifyAndFetch = async () => {
      // 1. Call Edge Function to verify payment with Stripe directly
      const { data: verifyData, error: verifyErr } = await supabase.functions.invoke('verify-stripe-session', {
        body: { session_id: sessionId },
      });

      if (verifyErr) {
        // Fallback: check Supabase directly if Edge Function fails
        const { data: order } = await supabase
          .from('order_headers')
          .select('id, status')
          .eq('checkout_session_id', sessionId)
          .maybeSingle();

        if (order) {
          setOrderId(order.id);
          const isPaid = order.status === 'paid' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered';
          setVerified(isPaid);
          setSource('supabase');
          if (isPaid) await fetchOrderItems(order.id);
        }
        setLoading(false);
        return;
      }

      if (verifyData?.paid) {
        setOrderId(verifyData.order_id);
        setVerified(true);
        setSource(verifyData.source || 'stripe');
        clearCart();
        await fetchOrderItems(verifyData.order_id);
      } else {
        setOrderId(verifyData?.order_id || null);
        setVerified(false);
        setSource(verifyData?.source || 'stripe');
      }
      setLoading(false);
    };

    const fetchOrderItems = async (oid: number) => {
      const { data: items } = await supabase
        .from('order_items')
        .select('product_id, product_name, quantity, unit_price, subtotal')
        .eq('order_id', oid);
      if (items) {
        const enriched = items.map((item) => {
          const pid = String(item.product_id);
          return {
            ...item,
            audio_url: trackAudioMap[pid] || '',
          } as DownloadItem;
        });
        setOrderItems(enriched);
      }
    };

    verifyAndFetch();
  }, [sessionId, clearCart]);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: '#FFFDF7' }}>
      <div className="w-20 h-20 flex items-center justify-center rounded-full" style={{ background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.2)' }}>
        <i className="ri-check-double-line text-3xl" style={{ color: '#4CAF7D' }} />
      </div>
      <h1 className="font-playfair text-4xl" style={{ color: '#1A2E1A' }}>Merci pour votre achat !</h1>

      {/* Download section */}
      <div className="w-full max-w-lg">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#4A6741' }}>
            <div className="w-4 h-4 border-2 border-[#2D7A4F]/30 border-t-[#2D7A4F] rounded-full animate-spin" />
            Verification du paiement...
          </div>
        ) : !verified ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)', color: '#FF6B4A' }}>
              <p className="text-sm font-medium">Paiement non confirme</p>
              <p className="text-xs mt-1 opacity-80">
                Nous n'avons pas encore recu la confirmation de votre paiement. Si vous venez de payer, patientez quelques instants et rafraichissez la page.
              </p>
            </div>
            <p className="text-xs mt-2" style={{ color: '#4A6741', opacity: 0.5 }}>
              Session: {sessionId?.slice(0, 20)}...
            </p>
          </div>
        ) : orderItems.length > 0 ? (
          <div className="space-y-3">
            {!isAuthenticated && (
              <div className="p-4 rounded-xl text-left" style={{ background: '#FFF8EE', border: '1px solid rgba(249,200,70,0.25)' }}>
                <p className="text-sm font-medium mb-2" style={{ color: '#1A2E1A' }}>
                  <i className="ri-user-add-line mr-1.5" style={{ color: '#D4A000' }} />
                  Creez un compte pour retrouver vos achats a tout moment
                </p>
                <p className="text-xs mb-3" style={{ color: '#4A6741', opacity: 0.7 }}>
                  Associez cette commande a un compte client pour telecharger votre musique plus tard, depuis n'importe quel appareil.
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/inscription"
                    className="cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all"
                    style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
                  >
                    <i className="ri-user-add-line" />
                    Creer un compte
                  </Link>
                  <Link
                    to="/connexion"
                    className="cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all"
                    style={{ background: 'rgba(45,122,79,0.1)', color: '#2D7A4F' }}
                  >
                    J'ai deja un compte
                  </Link>
                </div>
              </div>
            )}
            <p className="text-sm mb-4" style={{ color: '#4A6741' }}>
              Votre commande est confirmee. Telechargez vos morceaux ci-dessous :
            </p>
            {orderItems.map((item) => {
              const hasDownload = !!item.audio_url;
              return (
                <div
                  key={item.product_id}
                  className="flex items-center justify-between p-4 rounded-xl text-left"
                  style={{ background: '#F0FBF4', border: '1px solid rgba(45,122,79,0.1)' }}
                >
                  <div>
                    <h3 className="text-sm font-medium" style={{ color: '#1A2E1A' }}>{item.product_name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#4A6741', opacity: 0.6 }}>Qte: {item.quantity} — MP3 320kbps</p>
                  </div>
                  {hasDownload ? (
                    <button
                      onClick={() => handleDownload(item.audio_url, item.product_name)}
                      className="cursor-pointer whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all"
                      style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
                    >
                      <i className="ri-download-line" />
                      Telecharger
                    </button>
                  ) : (
                    <span className="text-xs" style={{ color: '#4A6741', opacity: 0.5 }}>Bundle — voir ci-dessous</span>
                  )}
                </div>
              );
            })}

            {/* If bundle, show individual tracks */}
            {orderItems.some((i) => String(i.product_id) === '100002') && (
              <div className="mt-4 p-4 rounded-xl text-left" style={{ background: '#FFF8EE', border: '1px solid rgba(249,200,70,0.2)' }}>
                <p className="text-xs font-medium mb-3" style={{ color: '#1A2E1A' }}>Contenu du bundle :</p>
                <div className="space-y-2">
                  {Object.entries(trackAudioMap).map(([pid, url]) => (
                    <div key={pid} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#4A6741' }}>{pid === '100000' ? 'Meli' : 'Kelobouatom'}</span>
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
              </div>
            )}

            {orderId && (
              <p className="text-xs mt-2" style={{ color: '#4A6741', opacity: 0.5 }}>
                Commande #{orderId} {source && `(verifie via ${source})`}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm max-w-sm leading-relaxed" style={{ color: '#4A6741' }}>
            Votre paiement a ete confirme. Un email avec le lien de telechargement vous sera envoye dans quelques minutes.
          </p>
        )}
      </div>

      <Link
        to="/"
        className="cursor-pointer whitespace-nowrap px-7 py-3 rounded-full text-xs font-medium tracking-wide transition-all"
        style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
      >
        Retour a l'accueil
      </Link>
    </div>
  );
}