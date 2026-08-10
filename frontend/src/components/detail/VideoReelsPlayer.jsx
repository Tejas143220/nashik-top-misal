import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Film } from 'lucide-react';

export const VideoReelsPlayer = ({ videoUrl, thumbnailUrl, title: _title }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  if (!videoUrl) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-amber-900/40 p-4 space-y-3 shadow-xl text-white">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Film className="w-4 h-4 text-orange-400" /> 10s Short Reel Experience
        </h3>
        <span className="text-[10px] font-bold bg-orange-600/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
          LIVE SIZZLE
        </span>
      </div>

      {/* Video Box */}
      <div className="relative aspect-[9/16] sm:aspect-[16/9] max-h-80 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center group">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Video Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <button
            onClick={togglePlay}
            className="p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoReelsPlayer;
