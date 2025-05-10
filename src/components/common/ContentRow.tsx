import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp, Info } from 'lucide-react';
import { Content } from '../../stores/contentStore';

interface ContentRowProps {
  title: string;
  contents: Content[];
}

const ContentRow = ({ title, contents }: ContentRowProps) => {
  const [isHovered, setIsHovered] = useState('');
  const rowRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleMouseEnter = (id: string) => {
    setIsHovered(id);
  };

  const handleMouseLeave = () => {
    setIsHovered('');
  };

  const scrollLeft = () => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      const maxScroll = rowRef.current.scrollWidth - rowRef.current.clientWidth;
      setScrollPosition(Math.min(maxScroll, scrollPosition + scrollAmount));
    }
  };

  return (
    <div 
      className="row-container my-8 relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h2 className="row-title">{title}</h2>
      
      {/* Scroll controls */}
      {showControls && contents.length > 4 && (
        <>
          <button 
            className={`absolute left-4 top-1/2 z-10 bg-black bg-opacity-50 rounded-full p-1 transform -translate-y-1/2 transition ${
              scrollPosition <= 0 ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={scrollLeft}
            disabled={scrollPosition <= 0}
            aria-label="Scroll left"
          >
            <ChevronLeft className="text-white" size={30} />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 z-10 bg-black bg-opacity-50 rounded-full p-1 transform -translate-y-1/2 transition opacity-100"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="text-white" size={30} />
          </button>
        </>
      )}
      
      {/* Content row */}
      <div 
        ref={rowRef}
        className="flex space-x-2 overflow-x-scroll scrollbar-hide netflix-scrollbar py-4"
      >
        {contents.map((content) => (
          <div 
            key={content.id}
            className={`netflix-card flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] h-[120px] sm:h-[140px] md:h-[160px] ${
              isHovered === content.id ? 'scale-110 z-20' : ''
            }`}
            onMouseEnter={() => handleMouseEnter(content.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link to={`/movie/${content.id}`}>
              <img 
                src={content.posterImage}
                alt={content.title}
                className="w-full h-full object-cover rounded"
              />
              
              {isHovered === content.id && (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-3 flex flex-col justify-between rounded">
                  <div className="flex justify-end space-x-2">
                    <span className="text-xs bg-netflix-red px-1 rounded">
                      {content.maturityRating}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-sm">{content.title}</h3>
                    <p className="text-xs text-netflix-light-gray mt-1">
                      {content.releaseYear} • {content.duration}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <button 
                        className="bg-white text-black rounded-full p-1 hover:bg-opacity-80 transition"
                        aria-label="Play"
                      >
                        <Play size={14} fill="black" />
                      </button>
                      
                      <button 
                        className="bg-netflix-dark bg-opacity-70 text-white border border-netflix-gray rounded-full p-1 hover:border-white transition"
                        aria-label="Add to My List"
                      >
                        <Plus size={14} />
                      </button>
                      
                      <button 
                        className="bg-netflix-dark bg-opacity-70 text-white border border-netflix-gray rounded-full p-1 hover:border-white transition"
                        aria-label="Like"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      
                      <button 
                        className="bg-netflix-dark bg-opacity-70 text-white border border-netflix-gray rounded-full p-1 hover:border-white transition"
                        aria-label="More Info"
                      >
                        <Info size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      {content.genre.slice(0, 3).map((genre, index) => (
                        <span key={index} className="text-[10px] text-netflix-light-gray">
                          {genre}{index < Math.min(content.genre.length, 3) - 1 ? ' •' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;