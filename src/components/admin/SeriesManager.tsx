import { useState } from 'react';
import { Plus, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { useContentStore, Season, Episode } from '../../stores/contentStore';

interface SeriesManagerProps {
  contentId: string;
  seasons: Season[];
}

const SeriesManager = ({ contentId, seasons }: SeriesManagerProps) => {
  const [expandedSeasons, setExpandedSeasons] = useState<string[]>([]);
  const [isAddingEpisode, setIsAddingEpisode] = useState(false);
  const [isAddingSeason, setIsAddingSeason] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const { addSeason, updateSeason, deleteSeason, addEpisode, updateEpisode, deleteEpisode } = useContentStore();

  const toggleSeason = (seasonId: string) => {
    setExpandedSeasons(prev => 
      prev.includes(seasonId) 
        ? prev.filter(id => id !== seasonId)
        : [...prev, seasonId]
    );
  };

  const handleAddSeason = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await addSeason(contentId, {
        seasonNumber: parseInt(formData.get('seasonNumber') as string),
        title: formData.get('title') as string,
        description: formData.get('description') as string
      });
      setIsAddingSeason(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add season:', error);
    }
  };

  const handleAddEpisode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSeason) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await addEpisode(selectedSeason, {
        episodeNumber: parseInt(formData.get('episodeNumber') as string),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        duration: formData.get('duration') as string,
        thumbnail: formData.get('thumbnail') as string,
        videoUrl: formData.get('videoUrl') as string
      });
      setIsAddingEpisode(false);
      setSelectedSeason(null);
      form.reset();
    } catch (error) {
      console.error('Failed to add episode:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Seasons & Episodes</h3>
        <button
          onClick={() => setIsAddingSeason(true)}
          className="flex items-center gap-2 bg-netflix-red text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          <Plus size={16} />
          <span>Add Season</span>
        </button>
      </div>

      {/* Add Season Form */}
      {isAddingSeason && (
        <form onSubmit={handleAddSeason} className="bg-gray-100 p-4 rounded space-y-4">
          <h4 className="font-semibold">Add New Season</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Season Number</label>
              <input
                type="number"
                name="seasonNumber"
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingSeason(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-netflix-red text-white rounded-md hover:bg-opacity-90 transition"
            >
              Add Season
            </button>
          </div>
        </form>
      )}

      {/* Seasons List */}
      <div className="space-y-4">
        {seasons.map((season) => (
          <div key={season.id} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSeason(season.id)}
            >
              <div>
                <h4 className="font-semibold">Season {season.seasonNumber}: {season.title}</h4>
                <p className="text-sm text-gray-500">{season.episodes.length} Episodes</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSeason(season.id);
                    setIsAddingEpisode(true);
                  }}
                  className="p-2 text-gray-600 hover:text-netflix-red transition"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit season
                  }}
                  className="p-2 text-gray-600 hover:text-netflix-red transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this season?')) {
                      deleteSeason(season.id);
                    }
                  }}
                  className="p-2 text-gray-600 hover:text-netflix-red transition"
                >
                  <Trash size={16} />
                </button>
                {expandedSeasons.includes(season.id) ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>
            
            {expandedSeasons.includes(season.id) && (
              <div className="p-4 space-y-4">
                {/* Episodes List */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Episode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {season.episodes.map((episode) => (
                      <tr key={episode.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {episode.episodeNumber}
                        </td>
                        <td className="px-6 py-4">
                          {episode.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {episode.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => {
                              // Handle edit episode
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this episode?')) {
                                deleteEpisode(episode.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Episode Modal */}
      {isAddingEpisode && selectedSeason && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4">
            <h4 className="text-lg font-semibold mb-4">Add New Episode</h4>
            
            <form onSubmit={handleAddEpisode} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Episode Number</label>
                  <input
                    type="number"
                    name="episodeNumber"
                    required
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g., 45m"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                  <input
                    type="url"
                    name="thumbnail"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Video URL</label>
                <input
                  type="url"
                  name="videoUrl"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-netflix-red focus:ring focus:ring-netflix-red focus:ring-opacity-50"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingEpisode(false);
                    setSelectedSeason(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-netflix-red text-white rounded-md hover:bg-opacity-90 transition"
                >
                  Add Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesManager;