import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoPlayerProps {
  title: string;
  description: string;
  videoUrl: string;
  onClose?: () => void;
  autoPlay?: boolean;
  isFullScreen?: boolean;
}

const VideoPlayer = ({ 
  title, 
  description, 
  videoUrl, 
  onClose, 
  autoPlay = true,
  isFullScreen = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimeout, setHideControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Hide controls after inactivity
  useEffect(() => {
    const showControlsTemporarily = () => {
      setShowControls(true);
      
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
      
      setHideControlsTimeout(timeout);
    };

    if (playerRef.current) {
      playerRef.current.addEventListener('mousemove', showControlsTemporarily);
      playerRef.current.addEventListener('click', () => {
        // Toggle play/pause on click except when clicking controls
        if (showControls) {
          showControlsTemporarily();
        } else {
          setIsPlaying(!isPlaying);
          showControlsTemporarily();
        }
      });
    }

    return () => {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
      
      if (playerRef.current) {
        playerRef.current.removeEventListener('mousemove', showControlsTemporarily);
      }
    };
  }, [isPlaying, hideControlsTimeout]);

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 1;
          return newTime >= duration ? 0 : newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, duration]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickPos = e.clientX - rect.left;
      const percentage = clickPos / rect.width;
      const newTime = percentage * duration;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <div 
      ref={playerRef}
      className={`relative ${isFullScreen ? 'fixed inset-0 z-50 bg-black' : 'w-full aspect-video bg-black'}`}
    >
      {/* Mock video - in a real app, this would be a real video element */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="https://source.unsplash.com/featured/?movie" 
          alt="Movie Preview" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Controls overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black bg-opacity-50 z-10">
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="text-netflix-white hover:text-netflix-red transition"
              aria-label="Back"
            >
              {isFullScreen ? (
                <X size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </button>
            
            <div className="text-netflix-white">
              <h2 className="text-lg font-bold">{title}</h2>
            </div>
            
            <div></div> {/* Empty div for flex alignment */}
          </div>
          
          {/* Center play/pause button */}
          <button
            onClick={handlePlayPause}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-netflix-red bg-opacity-70 rounded-full p-4 text-netflix-white hover:bg-opacity-100 transition"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
          
          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Progress bar */}
            <div 
              ref={progressRef}
              className="w-full h-2 bg-netflix-gray bg-opacity-50 rounded cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-netflix-red rounded"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="text-netflix-white hover:text-netflix-red transition"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-netflix-white hover:text-netflix-red transition"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 accent-netflix-red"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="text-netflix-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <button
                className="text-netflix-white hover:text-netflix-red transition"
                aria-label="Full screen"
              >
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;