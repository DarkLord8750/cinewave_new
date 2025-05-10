import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, X, Film, Tv } from 'lucide-react';
import { useContentStore, Content } from '../stores/contentStore';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [filter, setFilter] = useState<'all' | 'movies' | 'series'>('all');
  const { contents, fetchContents, searchContents } = useContentStore();
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      if (contents.length === 0) {
        await fetchContents();
      }
      
      // Check if there's a query parameter in the URL
      const urlParams = new URLSearchParams(location.search);
      const queryParam = urlParams.get('q');
      
      if (queryParam) {
        setQuery(queryParam);
        performSearch(queryParam);
      }
    };
    
    loadData();
  }, [fetchContents, contents.length, location.search]);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    let results = searchContents(searchQuery);
    
    // Apply filter if it's not 'all'
    if (filter === 'movies') {
      results = results.filter(content => content.type === 'movie');
    } else if (filter === 'series') {
      results = results.filter(content => content.type === 'series');
    }
    
    setSearchResults(results);
  };

  const handleSearch = () => {
    performSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch(query);
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'movies' | 'series') => {
    setFilter(newFilter);
    performSearch(query);
  };

  return (
    <div className="pt-20 px-4 md:px-16 pb-20 md:pb-0">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-gray" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for movies, TV shows, genres..."
              className="pl-10 pr-10 py-3 bg-netflix-dark border border-netflix-gray rounded w-full text-netflix-white focus:outline-none focus:border-netflix-white transition"
            />
            {query && (
              <button 
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-netflix-gray hover:text-netflix-white"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          <button 
            onClick={handleSearch}
            className="netflix-button py-3 md:py-2 md:px-8"
          >
            Search
          </button>
        </div>
        
        {/* Filter options */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-1 rounded-full ${
              filter === 'all' 
                ? 'bg-netflix-white text-netflix-black' 
                : 'bg-netflix-gray bg-opacity-30 text-netflix-white'
            }`}
          >
            All
          </button>
          
          <button 
            onClick={() => handleFilterChange('movies')}
            className={`flex items-center gap-2 px-4 py-1 rounded-full ${
              filter === 'movies' 
                ? 'bg-netflix-white text-netflix-black' 
                : 'bg-netflix-gray bg-opacity-30 text-netflix-white'
            }`}
          >
            <Film size={16} />
            <span>Movies</span>
          </button>
          
          <button 
            onClick={() => handleFilterChange('series')}
            className={`flex items-center gap-2 px-4 py-1 rounded-full ${
              filter === 'series' 
                ? 'bg-netflix-white text-netflix-black' 
                : 'bg-netflix-gray bg-opacity-30 text-netflix-white'
            }`}
          >
            <Tv size={16} />
            <span>TV Shows</span>
          </button>
        </div>
        
        {/* Search results */}
        {query && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {searchResults.length > 0 
                ? `Results for "${query}"`
                : `No results found for "${query}"`
              }
            </h2>
            
            {searchResults.length === 0 && (
              <p className="text-netflix-gray">
                Try different keywords or browse our content below.
              </p>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
              {searchResults.map((content) => (
                <Link 
                  key={content.id}
                  to={`/movie/${content.id}`}
                  className="netflix-card transition-transform hover:scale-105"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded">
                    <img 
                      src={content.posterImage}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium truncate">{content.title}</h3>
                    <div className="flex items-center text-xs text-netflix-gray mt-1">
                      <span>{content.releaseYear}</span>
                      <span className="mx-1">•</span>
                      <span className={`px-1 rounded ${
                        content.type === 'movie' ? 'bg-green-900' : 'bg-blue-900'
                      }`}>
                        {content.type === 'movie' ? 'Movie' : 'Series'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Suggestions section */}
        {!query && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Popular Searches</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {contents.slice(0, 10).map((content) => (
                <Link 
                  key={content.id}
                  to={`/movie/${content.id}`}
                  className="netflix-card transition-transform hover:scale-105"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded">
                    <img 
                      src={content.posterImage}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium truncate">{content.title}</h3>
                    <div className="flex items-center text-xs text-netflix-gray mt-1">
                      <span>{content.releaseYear}</span>
                      <span className="mx-1">•</span>
                      <span className={`px-1 rounded ${
                        content.type === 'movie' ? 'bg-green-900' : 'bg-blue-900'
                      }`}>
                        {content.type === 'movie' ? 'Movie' : 'Series'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;