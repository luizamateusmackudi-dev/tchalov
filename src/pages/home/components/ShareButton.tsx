import { useState, useCallback } from 'react';

interface ShareButtonProps {
  sectionId: string;
  label?: string;
}

export default function ShareButton({ sectionId, label }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [sectionId]);

  return (
    <button
      onClick={handleShare}
      className="cursor-pointer flex items-center gap-1.5 text-xs tracking-widest uppercase transition-all duration-300 whitespace-nowrap"
      style={{ color: copied ? '#4CAF7D' : 'rgba(45,122,79,0.6)' }}
      title={label || 'Copier le lien de cette section'}
    >
      <div className="w-4 h-4 flex items-center justify-center">
        <i className={`${copied ? 'ri-check-line' : 'ri-share-line'}`} />
      </div>
      {copied ? 'Lien copié !' : (label || 'Partager')}
    </button>
  );
}