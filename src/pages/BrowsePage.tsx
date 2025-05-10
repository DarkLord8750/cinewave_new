import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useContentStore, Content } from '../stores/contentStore';
import HeroBanner from '../components/common/HeroBanner';
import ContentRow from '../components/common/ContentRow';

const BrowsePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { contents, featured, fetchContents, fetchFeatured, getContentsByGenre } = useContentStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchContents(), fetchFeatured()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchContents, fetchFeatured]);

  // Group content by genres
  const genreMap = new Map<string, Content[]>();
  
  if (contents.length > 0) {
    // Prepare different content categories
    const movies = contents.filter(c => c.type === 'movie');
    const series = contents.filter(c => c.type === 'series');
    const trending = contents.slice(0, 5); // Mock trending
    const newReleases = [...contents].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 5);
    
    // Add to genre map
    genreMap.set('Trending Now', trending);
    genreMap.set('New Releases', newReleases);
    
    if (categoryParam === 'movies') {
      genreMap.set('Movies', movies);
    } else if (categoryParam === 'series') {
      genreMap.set('TV Shows', series);
    } else if (categoryParam === 'mylist') {
      // In a real app, this would be the user's saved list
      genreMap.set('My List', trending);
    } else {
      // Add all unique genres
      const allGenres = Array.from(new Set(contents.flatMap(c => c.genre)));
      
      allGenres.forEach(genre => {
        const genreContents = getContentsByGenre(genre);
        if (genreContents.length > 0) {
          genreMap.set(genre, genreContents);
        }
      });
      
      // Add types
      genreMap.set('Movies', movies);
      genreMap.set('TV Shows', series);
    }
  }

  if (isLoading || !featured) {
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
    <div className="pt-16 md:pt-0">
      {/* Hero banner for main featured content */}
      <HeroBanner content={featured} />
      
      {/* Content rows */}
      <div className="pb-20 md:pb-0">
        {Array.from(genreMap.entries()).map(([genre, genreContents]) => (
          <ContentRow 
            key={genre} 
            title={genre} 
            contents={genreContents} 
          />
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;