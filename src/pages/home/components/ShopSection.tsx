import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import ShareButton from './ShareButton';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  media: { url: string; type: string }[];
}

export default function ShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    supabase
      .from('product_items')
      .select('id, name, description, price, media')
      .eq('status', 'active')
      .order('id')
      .then(({ data, error }) => {
        if (!error && data) setProducts(data as Product[]);
        setLoading(false);
      });
  }, []);

  const singles = products.filter((p) => p.name !== 'Meli + Kelobouatom');
  const bundle = products.find((p) => p.name === 'Meli + Kelobouatom');

  const handleAdd = (product: Product) => {
    const image = product.media?.[0]?.url || '';
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
      description: product.description,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (loading) {
    return (
      <section id="shop" className="py-32 px-6" style={{ background: 'linear-gradient(180deg, #F0FBF4 0%, #FFFDF7 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#4CAF7D', borderTopColor: 'transparent' }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F0FBF4 0%, #FFFDF7 100%)' }}>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #FF6B4A 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />
      <div className="absolute top-0 left-0 w-[250px] h-[250px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #4CAF7D 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px]" style={{ background: '#2D7A4F' }} />
            <span className="text-xs tracking-[0.5em] uppercase font-medium" style={{ color: '#2D7A4F' }}>Boutique</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-playfair text-5xl md:text-6xl leading-tight" style={{ color: '#1A2E1A' }}>
              Acheter<br />
              <span className="italic" style={{ color: '#2D7A4F' }}>ma musique</span>
            </h2>
            <div className="flex flex-col md:items-end gap-4">
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#4A6741', opacity: 0.7 }}>
                Soutenez l'artiste directement. Chaque achat inclut un téléchargement numérique haute qualité.
              </p>
              <ShareButton sectionId="shop" label="Partager" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: singles */}
          <div className="flex flex-col gap-5">
            {singles.map((product) => {
              const isHovered = hoveredId === product.id;
              const isAdded = addedId === product.id;
              const image = product.media?.[0]?.url || '';

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative rounded-2xl overflow-hidden transition-all duration-500 group cursor-pointer"
                  style={{
                    height: '260px',
                    border: '2px solid rgba(76,175,125,0.15)',
                    boxShadow: isHovered ? '0 8px 32px rgba(45,122,79,0.12)' : 'none',
                  }}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,46,26,0.85) 0%, rgba(26,46,26,0.5) 50%, rgba(26,46,26,0.15) 100%)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,46,26,0.6) 0%, transparent 50%)' }} />

                  <div className="absolute top-5 right-5">
                    <span className="text-xs tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm" style={{ background: 'rgba(76,175,125,0.2)', color: '#4CAF7D', border: '1px solid rgba(76,175,125,0.3)' }}>
                      Nouveau
                    </span>
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-between p-7">
                    <div>
                      <div className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: '#4CAF7D' }}>2025 — Single</div>
                      <h3 className="font-playfair text-white text-4xl leading-tight">{product.name}</h3>
                      <p className="text-white/50 text-xs mt-1">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded-md backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>MP3</span>
                        <span className="text-xs px-2 py-1 rounded-md backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>WAV</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-playfair text-3xl" style={{ color: '#4CAF7D' }}>${product.price}</span>
                        <button
                          onClick={() => handleAdd(product)}
                          className="cursor-pointer whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300"
                          style={isAdded
                            ? { background: 'rgba(76,175,125,0.2)', border: '1px solid rgba(76,175,125,0.4)', color: '#4CAF7D' }
                            : { background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }
                          }
                        >
                          {isAdded ? (
                            <><i className="ri-check-line" /> Ajouté !</>
                          ) : (
                            <><i className="ri-shopping-bag-line" /> Ajouter au panier</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: bundle */}
          {bundle && (
            <div
              onMouseEnter={() => setHoveredId(bundle.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
              style={{
                minHeight: '540px',
                border: '2px solid rgba(76,175,125,0.3)',
                boxShadow: hoveredId === bundle.id ? '0 12px 48px rgba(45,122,79,0.2)' : '0 4px 24px rgba(45,122,79,0.08)',
              }}
            >
              <img
                src={bundle.media?.[0]?.url || ''}
                alt={bundle.name}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ${hoveredId === bundle.id ? 'scale-105' : 'scale-100'}`}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,46,26,0.97) 0%, rgba(26,46,26,0.6) 50%, rgba(26,46,26,0.2) 100%)' }} />

              <div className="absolute top-5 left-5">
                <span className="text-xs tracking-widest uppercase px-3 py-1 rounded-full font-medium" style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}>Offre spéciale</span>
              </div>
              <div className="absolute top-5 right-5">
                <span className="text-xs tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm" style={{ background: 'rgba(249,200,70,0.2)', color: '#F9C846', border: '1px solid rgba(249,200,70,0.3)' }}>−20%</span>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#4CAF7D' }}>2025 — Bundle</div>
                <h3 className="font-playfair text-white text-5xl leading-tight mb-2">
                  Meli<br />
                  <span className="text-white/60">+</span><br />
                  Kelobouatom
                </h3>
                <p className="text-white/50 text-sm mb-6">{bundle.description}</p>

                <div className="flex gap-2 mb-6">
                  <span className="text-xs px-2 py-1 rounded-md backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>MP3</span>
                  <span className="text-xs px-2 py-1 rounded-md backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>WAV</span>
                  <span className="text-xs px-2 py-1 rounded-md backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>320kbps</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-playfair text-5xl" style={{ color: '#4CAF7D' }}>${bundle.price}</span>
                    <span className="text-white/30 text-sm line-through">$10</span>
                  </div>
                  <button
                    onClick={() => handleAdd(bundle)}
                    className="cursor-pointer whitespace-nowrap flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300"
                    style={addedId === bundle.id
                      ? { background: 'rgba(76,175,125,0.2)', border: '1px solid rgba(76,175,125,0.4)', color: '#4CAF7D' }
                      : { background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }
                    }
                  >
                    {addedId === bundle.id ? (
                      <><i className="ri-check-line" /> Ajouté !</>
                    ) : (
                      <><i className="ri-shopping-bag-line" /> Ajouter au panier</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security note */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs" style={{ color: '#4A6741', opacity: 0.5 }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-lock-line" /></div>
            Paiement sécurisé SSL
          </div>
          <div className="hidden sm:block w-[1px] h-4" style={{ background: 'rgba(45,122,79,0.2)' }} />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line" /></div>
            Téléchargement instantané
          </div>
          <div className="hidden sm:block w-[1px] h-4" style={{ background: 'rgba(45,122,79,0.2)' }} />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-customer-service-line" /></div>
            Support disponible
          </div>
        </div>
      </div>
    </section>
  );
}