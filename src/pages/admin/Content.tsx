import { useState } from 'react';
import ContentTable from '../../components/admin/ContentTable';
import SeriesManager from '../../components/admin/SeriesManager';
import { Content, useContentStore } from '../../stores/contentStore';

const ContentManagement = () => {
  const { contents, addContent, updateContent, deleteContent } = useContentStore();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [showSeriesManager, setShowSeriesManager] = useState(false);

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await deleteContent(id);
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }
  };

  const handleView = (id: string) => {
    const content = contents.find(c => c.id === id);
    if (content) {
      setSelectedContent(content);
      setModalMode('view');
      setIsModalOpen(true);
    }
  };

  const handleAdd = () => {
    setSelectedContent(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
    setShowSeriesManager(false);
  };

  const handleSave = async () => {
    try {
      if (!selectedContent) return;

      if (modalMode === 'add') {
        await addContent(selectedContent);
      } else {
        await updateContent(selectedContent.id, selectedContent);
      }
      
      setIsModalOpen(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Content Management</h1>
        <p className="text-gray-500">Manage all movies and TV shows in your Netflix library.</p>
      </div>
      
      <ContentTable
        contents={contents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onAdd={handleAdd}
      />
      
      {/* Modal for Add/Edit/View content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {modalMode === 'add' ? 'Add New Content' : 
                 modalMode === 'edit' ? 'Edit Content' : 'View Content'}
              </h2>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                {/* Existing form fields */}
                {/* ... */}
                
                {/* Series Manager */}
                {selectedContent?.type === 'series' && modalMode !== 'add' && (
                  <SeriesManager
                    contentId={selectedContent.id}
                    seasons={selectedContent.seasons || []}
                  />
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-netflix-red text-white rounded-md hover:bg-opacity-90 transition"
                >
                  {modalMode === 'add' ? 'Add Content' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;