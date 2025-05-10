import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Logo from '../common/Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSearch = () => {
    navigate('/search');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHomePage = location.pathname === '/browse';

  return (
    <header 
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled || !isHomePage ? 'bg-netflix-black' : 'bg-gradient-to-b from-netflix-black to-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/browse" className="mr-8">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/browse" className="text-netflix-white hover:text-netflix-gray transition">
              Home
            </Link>
            <Link to="/browse?category=series" className="text-netflix-white hover:text-netflix-gray transition">
              TV Shows
            </Link>
            <Link to="/browse?category=movies" className="text-netflix-white hover:text-netflix-gray transition">
              Movies
            </Link>
            <Link to="/browse?category=new" className="text-netflix-white hover:text-netflix-gray transition">
              New & Popular
            </Link>
            <Link to="/browse?category=mylist" className="text-netflix-white hover:text-netflix-gray transition">
              My List
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleSearch}
            className="text-netflix-white hover:text-netflix-gray transition"
            aria-label="Search"
          >
            <Search />
          </button>
          
          <button 
            className="text-netflix-white hover:text-netflix-gray transition relative"
            aria-label="Notifications"
          >
            <Bell />
            <span className="absolute -top-1 -right-1 bg-netflix-red text-xs w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="flex items-center space-x-2"
            >
              <img 
                src={currentProfile?.avatar || 'https://i.pravatar.cc/150?img=1'} 
                alt="Profile" 
                className="w-8 h-8 rounded"
              />
              <ChevronDown className={`w-4 h-4 text-netflix-white transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-netflix-black border border-netflix-gray rounded shadow-lg py-2 z-10">
                <div className="px-4 py-2 border-b border-netflix-gray">
                  <p className="text-netflix-white font-medium">{currentProfile?.name || 'User'}</p>
                  <p className="text-netflix-gray text-sm">Manage Profiles</p>
                </div>
                
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-netflix-white hover:bg-netflix-red transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Switch Profile
                </Link>
                
                <Link 
                  to="/account" 
                  className="block px-4 py-2 text-netflix-white hover:bg-netflix-red transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Account
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-netflix-white hover:bg-netflix-red transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;