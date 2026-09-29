import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-[70] flex flex-col" style={{ background: '#FFFDF7' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(45,122,79,0.12)' }}>
          <h2 className="font-playfair text-xl tracking-wide" style={{ color: '#1A2E1A' }}>
            Votre Panier
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
            style={{ color: '#4A6741' }}
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ background: 'rgba(76,175,125,0.08)', border: '1px solid rgba(76,175,125,0.15)' }}>
                <i className="ri-shopping-bag-line text-2xl" style={{ color: '#4CAF7D' }} />
              </div>
              <p className="text-sm" style={{ color: '#4A6741' }}>Votre panier est vide</p>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-xs tracking-widest uppercase px-5 py-2 rounded-full transition-all"
                style={{ border: '1px solid rgba(45,122,79,0.3)', color: '#2D7A4F' }}
              >
                Continuer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl"
                  style={{ border: '1px solid rgba(45,122,79,0.1)', background: 'rgba(255,255,255,0.5)' }}
                >
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate" style={{ color: '#1A2E1A' }}>{item.name}</h3>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#4A6741', opacity: 0.6 }}>{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="cursor-pointer w-6 h-6 flex items-center justify-center rounded-full text-xs"
                          style={{ border: '1px solid rgba(45,122,79,0.2)', color: '#2D7A4F' }}
                        >
                          <i className="ri-subtract-line" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center" style={{ color: '#1A2E1A' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="cursor-pointer w-6 h-6 flex items-center justify-center rounded-full text-xs"
                          style={{ border: '1px solid rgba(45,122,79,0.2)', color: '#2D7A4F' }}
                        >
                          <i className="ri-add-line" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium" style={{ color: '#2D7A4F' }}>${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="cursor-pointer w-6 h-6 flex items-center justify-center rounded-full text-xs transition-colors hover:bg-red-50"
                          style={{ color: '#FF6B4A' }}
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(45,122,79,0.12)', background: '#F0FBF4' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: '#4A6741' }}>Sous-total</span>
              <span className="font-playfair text-2xl" style={{ color: '#1A2E1A' }}>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="cursor-pointer whitespace-nowrap px-4 py-3 rounded-full text-xs tracking-widest uppercase transition-all"
                style={{ border: '1px solid rgba(45,122,79,0.25)', color: '#4A6741' }}
              >
                Vider
              </button>
              <a
                href="/checkout"
                className="cursor-pointer whitespace-nowrap flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-medium tracking-wide transition-all"
                style={{ background: 'linear-gradient(135deg, #2D7A4F, #4CAF7D)', color: '#fff' }}
              >
                <i className="ri-secure-payment-line" />
                Finaliser la commande
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}