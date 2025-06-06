import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Content } from '../../stores/contentStore';

interface HeroBannerProps {
  content: Content;
}

const HeroBanner = ({ content }: HeroBannerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  // Auto-play trailer after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      setIsPlaying(false);
    };
  }, [content.id]);

  // Navigate to movie detail page
  const handleMoreInfo = () => {
    navigate(`/movie/${content.id}`);
  };

  return (
    <div className="relative w-full h-[56.25vw] max-h-[80vh] min-h-[400px] overflow-hidden">
      {/* Backdrop image as fallback or before video loads */}
      <div className="absolute inset-0 z-0">
        <img 
          src={content.backdropImage}
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Video trailer - in a real app, this would be a real video */}
      {isPlaying && (
        <div className="absolute inset-0 z-10">
          <div className="w-full h-full bg-black flex items-center justify-center">
            <p className="text-netflix-white text-lg">Trailer would play here</p>
          </div>
        </div>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-black to-transparent z-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark to-transparent z-20"></div>
      
      {/* Content details */}
      <div className="absolute bottom-[15%] left-[4%] md:left-[60px] z-30 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold text-netflix-white mb-4 drop-shadow-lg">
          {content.title}
        </h1>
        
        <p className="text-sm md:text-base text-netflix-white mb-6 drop-shadow-lg line-clamp-3 md:line-clamp-4">
          {content.description}
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button 
            className="flex items-center gap-2 px-6 py-2 bg-netflix-white text-netflix-black rounded font-medium hover:bg-opacity-80 transition"
            onClick={() => navigate(`/movie/${content.id}`)}
          >
            <Play size={24} fill="black" />
            <span>Play</span>
          </button>
          
          <button 
            className="flex items-center gap-2 px-6 py-2 bg-netflix-gray bg-opacity-50 text-netflix-white rounded font-medium hover:bg-opacity-40 transition"
            onClick={handleMoreInfo}
          >
            <Info size={24} />
            <span>More Info</span>
          </button>
        </div>
        
        <div className="flex items-center mt-4 space-x-2">
          <span className="text-netflix-red text-sm font-bold border border-netflix-gray px-1 rounded">
            {content.maturityRating}
          </span>
          <span className="text-netflix-light-gray text-sm">
            {content.releaseYear} • {content.duration} • {content.genre.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;