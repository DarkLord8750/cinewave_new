import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Share2, X } from 'lucide-react';
import { useContentStore, Content } from '../stores/contentStore';
import VideoPlayer from '../components/common/VideoPlayer';
import ContentRow from '../components/common/ContentRow';

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { contents, fetchContents, getContentById, getContentsByGenre } = useContentStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (contents.length === 0) {
        await fetchContents();
      }
      
      if (id) {
        const movieContent = getContentById(id);
        if (movieContent) {
          setContent(movieContent);
        } else {
          // Content not found, redirect to browse
          navigate('/browse');
        }
      }
      
      setIsLoading(false);
    };
    
    loadData();
    
    // Clean up
    return () => {
      setIsPlaying(false);
    };
  }, [id, fetchContents, getContentById, contents.length, navigate]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  // Get similar content based on the first genre
  const similarContent = content && content.genre.length > 0 
    ? getContentsByGenre(content.genre[0]).filter(c => c.id !== content.id)
    : [];

  if (isLoading || !content) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-md bg-netflix-gray w-32 h-8 mb-4"></div>
          <div className="text-netflix-gray">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-20 md:pb-0">
      {/* Full-screen video player when playing */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black z-50">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-netflix-red transition-colors"
            aria-label="Close"
          >
            <X size={32} />
          </button>
          
          <VideoPlayer
            title={content.title}
            description={content.description}
            videoUrl={content.trailerUrl}
            onClose={handleClose}
            isFullScreen={true}
          />
        </div>
      )}
      
      {/* Content header with backdrop image */}
      <div className="relative">
        <div className="w-full h-[50vh] md:h-[70vh] relative">
          <img 
            src={content.backdropImage}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/50 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 px-4 md:px-16">
          <div className="max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{content.title}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm border border-netflix-gray px-1 py-0.5 rounded text-netflix-red">
                {content.maturityRating}
              </span>
              <span>{content.releaseYear}</span>
              <span>{content.duration}</span>
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap gap-4 mb-8">
              <button 
                onClick={handlePlay}
                className="flex items-center gap-2 px-6 py-2 bg-netflix-white text-netflix-black rounded font-medium hover:bg-opacity-80 transition"
              >
                <Play fill="black" />
                <span>Play</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-netflix-gray bg-opacity-30 text-netflix-white rounded font-medium hover:bg-opacity-20 transition">
                <Plus />
                <span>My List</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-netflix-gray bg-opacity-30 text-netflix-white rounded font-medium hover:bg-opacity-20 transition">
                <ThumbsUp />
                <span>Rate</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-netflix-gray bg-opacity-30 text-netflix-white rounded font-medium hover:bg-opacity-20 transition">
                <Share2 />
                <span>Share</span>
              </button>
            </div>
            
            <div className="max-w-3xl">
              <p className="text-lg mb-4">{content.description}</p>
              
              <div className="text-netflix-gray">
                <p><span className="text-netflix-white">Cast:</span> Actor 1, Actor 2, Actor 3</p>
                <p><span className="text-netflix-white">Genres:</span> {content.genre.join(', ')}</p>
                <p><span className="text-netflix-white">Director:</span> Director Name</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar content section */}
      <div className="mt-12">
        <ContentRow
          title="More Like This"
          contents={similarContent}
        />
      </div>
      
      {/* Trailer section */}
      <div className="px-4 md:px-16 my-12">
        <h2 className="text-2xl font-bold mb-4">Trailers & More</h2>
        
        <div className="w-full max-w-3xl">
          <VideoPlayer
            title={content.title}
            description={content.description}
            videoUrl={content.trailerUrl}
            autoPlay={false}
          />
        </div>
      </div>
      
      {/* Details section */}
      <div className="px-4 md:px-16 my-12">
        <h2 className="text-2xl font-bold mb-4">About {content.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div>
            <h3 className="text-netflix-gray mb-2">Cast</h3>
            <p>Actor 1, Actor 2, Actor 3, Actor 4, Actor 5</p>
          </div>
          
          <div>
            <h3 className="text-netflix-gray mb-2">Genres</h3>
            <p>{content.genre.join(', ')}</p>
          </div>
          
          <div>
            <h3 className="text-netflix-gray mb-2">This title is</h3>
            <p>Exciting, Emotional, Suspenseful</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;