import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/common/Logo';

const ProfilePage = () => {
  const { user, selectProfile, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleProfileSelect = (profile: any) => {
    if (isEditing) return;
    
    selectProfile(profile);
    navigate('/browse');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col">
      <header className="p-6">
        <Logo />
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl md:text-3xl text-netflix-white mb-6">
          {isEditing ? 'Manage Profiles' : 'Who\'s watching?'}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
          {user?.profiles.map((profile) => (
            <div 
              key={profile.id}
              className="relative group"
              onClick={() => handleProfileSelect(profile)}
            >
              <div className={`w-[120px] h-[120px] overflow-hidden rounded-md transition-all duration-300 ${
                isEditing ? 'opacity-50' : 'cursor-pointer hover:border-4 border-netflix-white'
              }`}>
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Pencil className="text-netflix-white" size={40} />
                </div>
              )}
              <p className="text-center text-netflix-gray mt-2 group-hover:text-netflix-white">
                {profile.name}
              </p>
            </div>
          ))}
          
          {/* Add profile button */}
          <div 
            className="w-[120px] h-[120px] flex flex-col items-center justify-center border-2 border-gray-600 rounded-md text-gray-600 cursor-pointer hover:border-netflix-white hover:text-netflix-white transition-all duration-300"
            onClick={() => {
              // In a real app, this would open a modal to add a new profile
              alert('Add profile functionality would go here');
            }}
          >
            <Plus size={40} />
            <p className="text-center mt-2">Add Profile</p>
          </div>
        </div>
        
        <div className="mt-12">
          {isEditing ? (
            <button 
              onClick={() => setIsEditing(false)}
              className="py-2 px-8 bg-netflix-white text-netflix-black border border-netflix-white rounded font-medium hover:bg-netflix-white/90 transition-colors"
            >
              Done
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="py-2 px-8 border border-gray-600 text-gray-600 rounded font-medium hover:border-netflix-white hover:text-netflix-white transition-colors"
            >
              Manage Profiles
            </button>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className="mt-4 text-gray-600 hover:text-netflix-white transition-colors"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
};

export default ProfilePage;