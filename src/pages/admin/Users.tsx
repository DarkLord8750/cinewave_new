import { useState } from 'react';
import UserTable from '../../components/admin/UserTable';

interface User {
  id: string;
  email: string;
  name: string;
  status: string;
  isAdmin: boolean;
  profiles: any[];
}

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // In a real app, this would make an API call to delete the user
      alert(`User with ID ${id} would be deleted`);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    // In a real app, this would make an API call to save the user
    alert(`User ${modalMode === 'add' ? 'added' : 'updated'} successfully`);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">User Management</h1>
        <p className="text-gray-500">Manage users and their access to your Netflix platform.</p>
      </div>
      
      <UserTable
        users={[]}  // This is a mock component that generates its own data
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
      
      {/* Modal for Add/Edit user */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {modalMode === 'add' ? 'Add New User' : 'Edit User'}
              </h2>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                      placeholder="Enter full name"
                      value={selectedUser?.name || ''}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                      placeholder="Enter email address"
                      value={selectedUser?.email || ''}
                    />
                  </div>
                </div>
                
                {modalMode === 'add' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                      placeholder="Enter password"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                    value={selectedUser?.status || 'active'}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="role-user"
                        name="role"
                        type="radio"
                        className="h-4 w-4 border-gray-300 accent-netflix-red"
                        checked={selectedUser ? !selectedUser.isAdmin : true}
                      />
                      <label htmlFor="role-user" className="ml-2 block text-sm text-gray-700">
                        User
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="role-admin"
                        name="role"
                        type="radio"
                        className="h-4 w-4 border-gray-300 accent-netflix-red"
                        checked={selectedUser?.isAdmin || false}
                      />
                      <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-700">
                        Admin
                      </label>
                    </div>
                  </div>
                </div>
                
                {modalMode === 'edit' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profiles
                    </label>
                    <div className="border border-gray-300 rounded-md p-4">
                      <div className="flex flex-wrap gap-3">
                        {selectedUser?.profiles.map((profile, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <img
                              src={profile.avatar}
                              alt={profile.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <span className="text-sm">{profile.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-netflix-red text-white rounded-md hover:bg-opacity-90 transition"
              >
                {modalMode === 'add' ? 'Add User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;