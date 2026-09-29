import { useState, useRef, useEffect } from 'react';
import { tracks } from '@/mocks/music';
import ShareButton from './ShareButton';

const PREVIEW_DURATION = 60;

export default function MusicSection() {
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync audio element when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack.audioSrc) {
      audio.src = currentTrack.audioSrc;
      audio.load();
      if (isPlaying) audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.src = '';
    }
  }, [currentTrack]);

  // Play / pause sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.audioSrc) {
      // Fallback fake timer for tracks without audio
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            const next = prev + 1;
            const dur = currentTrack.durationSec;
            if (next >= dur) {
              const idx = tracks.findIndex((t) => t.id === currentTrack.id);
              const nextTrack = tracks[(idx + 1) % tracks.length];
              setCurrentTrack(nextTrack);
              setProgress(0);
              return 0;
            }
            setProgress((next / dur) * 100);
            return next;
          });
        }, 1000);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // Stop after PREVIEW_DURATION seconds for tracks with real audio
    if (currentTrack.audioSrc && audio.currentTime >= PREVIEW_DURATION) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      return;
    }
    const dur = currentTrack.audioSrc
      ? PREVIEW_DURATION
      : (audio.duration || currentTrack.durationSec);
    setCurrentTime(Math.floor(audio.currentTime));
    setProgress((audio.currentTime / dur) * 100);
  };

  const handleAudioLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // For preview tracks, cap the displayed duration at PREVIEW_DURATION
    const realDuration = Math.floor(audio.duration);
    setDuration(currentTrack.audioSrc ? Math.min(realDuration, PREVIEW_DURATION) : realDuration);
  };

  const handleAudioEnded = () => {
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = tracks[(idx + 1) % tracks.length];
    setCurrentTrack(nextTrack);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePlayPause = (track: typeof tracks[0]) => {
    if (currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setProgress(0);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getDisplayDuration = (track: typeof tracks[0]) => {
    if (currentTrack.id === track.id && duration > 0) return formatTime(duration);
    return track.duration;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, track: typeof tracks[0]) => {
    if (currentTrack.id !== track.id) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const audio = audioRef.current;
    if (audio && track.audioSrc) {
      // Cap seek at PREVIEW_DURATION for preview tracks
      const seekTime = Math.min(pct * PREVIEW_DURATION, PREVIEW_DURATION);
      audio.currentTime = seekTime;
    } else {
      const newTime = Math.floor(pct * track.durationSec);
      setCurrentTime(newTime);
      setProgress(pct * 100);
    }
  };

  return (
    <section id="music" className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFDF7 0%, #F0FBF4 100%)' }} ref={sectionRef}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
        preload="metadata"
      />

      {/* Tropical decorative blob */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #F9C846 0%, transparent 70%)', transform: 'translate(40%, -50%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ─── Header ─── */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px]" style={{ background: '#2D7A4F' }} />
            <span className="text-xs tracking-[0.5em] uppercase font-medium" style={{ color: '#2D7A4F' }}>Musique</span>
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="font-playfair text-5xl md:text-6xl" style={{ color: '#1A2E1A' }}>Nouveaux Singles</h2>
            <div className="pb-2">
              <ShareButton sectionId="music" label="Partager" />
            </div>
          </div>
        </div>

        {/* ─── Tracks ─── */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 mb-24 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {tracks.map((track, idx) => {
            const isActive = currentTrack.id === track.id;
            const trackProgress = isActive ? progress : 0;
            const trackTime = isActive ? currentTime : 0;

            return (
              <div
                key={track.id}
                className="relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer group"
                style={{
                  minHeight: '420px',
                  border: isActive ? '2px solid rgba(45,122,79,0.5)' : '2px solid rgba(45,122,79,0.1)',
                  boxShadow: isActive ? '0 8px 40px rgba(45,122,79,0.15)' : 'none',
                }}
                onClick={() => handlePlayPause(track)}
              >
                {/* Full cover background */}
                <img
                  src={track.cover}
                  alt={track.title}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ${isActive ? 'scale-105' : 'group-hover:scale-103'}`}
                />
                {/* Gradient overlay — tropical tint */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,46,26,0.95) 0%, rgba(26,46,26,0.5) 50%, rgba(26,46,26,0.1) 100%)' }} />
                {isActive && (
                  <div className="absolute inset-0" style={{ background: 'rgba(76,175,125,0.06)' }} />
                )}

                {/* Track number top-left */}
                <div className="absolute top-6 left-6">
                  <span className="font-playfair text-white/20 text-6xl leading-none select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Active indicator top-right */}
                {isActive && (
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <div className="flex gap-[3px] items-end h-4">
                      {[1, 2, 3].map((b) => (
                        <div
                          key={b}
                          className={`w-[3px] rounded-full ${isPlaying ? 'animate-pulse' : ''}`}
                          style={{ height: `${[60, 100, 75][b - 1]}%`, background: '#4CAF7D', animationDelay: `${b * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs tracking-widest uppercase" style={{ color: '#4CAF7D' }}>
                      {isPlaying ? 'En cours' : 'Pause'}
                    </span>
                  </div>
                )}

                {/* Content bottom */}
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <div className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: '#4CAF7D' }}>{track.album}</div>
                  <h3 className="font-playfair text-white text-4xl mb-1">{track.title}</h3>
                  <p className="text-white/40 text-sm mb-5">Tchalove Mbakop</p>

                  {/* Progress bar */}
                  <div
                    className="w-full h-[2px] rounded-full cursor-pointer mb-2"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                    onClick={(e) => { e.stopPropagation(); handleProgressClick(e, track); }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${trackProgress}%`, background: '#4CAF7D' }}
                    />
                  </div>
                  <div className="flex justify-between text-white/30 text-xs mb-5">
                    <span>{formatTime(trackTime)}</span>
                    <span>{getDisplayDuration(track)}</span>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/30 text-xs tracking-widest uppercase">Acheter</span>
                      <a
                        href={track.buyLinks.itunes}
                        rel="nofollow"
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap backdrop-blur-sm transition-all duration-200"
                        style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
                      >
                        <i className="ri-apple-line" /> iTunes
                      </a>
                      <a
                        href={track.buyLinks.bandcamp}
                        rel="nofollow"
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap backdrop-blur-sm transition-all duration-200"
                        style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
                      >
                        <i className="ri-music-2-line" /> Bandcamp
                      </a>
                    </div>

                    {/* Play button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePlayPause(track); }}
                      className="cursor-pointer w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0"
                      style={isActive
                        ? { background: '#4CAF7D', borderColor: '#4CAF7D', color: '#fff' }
                        : { borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }
                      }
                    >
                      <i className={`text-xl ${isActive && isPlaying ? 'ri-pause-fill' : 'ri-play-fill'}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
