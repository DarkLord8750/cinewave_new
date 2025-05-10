import { BarChart, TrendingUp, Users, Film, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back, Admin</h1>
        <p className="text-gray-500">Here's what's happening with your Netflix platform today.</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-800">2,543</h3>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp size={14} className="mr-1" /> 
                <span>7.2% increase this month</span>
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Content</p>
              <h3 className="text-3xl font-bold text-gray-800">384</h3>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp size={14} className="mr-1" /> 
                <span>12 new titles this week</span>
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Film className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Revenue</p>
              <h3 className="text-3xl font-bold text-gray-800">$35,642</h3>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp size={14} className="mr-1" /> 
                <span>18.3% increase this month</span>
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1">Active Sessions</p>
              <h3 className="text-3xl font-bold text-gray-800">1,287</h3>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <Activity size={14} className="mr-1" /> 
                <span>Currently streaming</span>
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Activity className="text-netflix-red" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">User Growth</h3>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart size={60} className="mx-auto mb-4 text-gray-400" />
              <p>User growth chart would display here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Content Popularity</h3>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart size={60} className="mx-auto mb-4 text-gray-400" />
              <p>Content popularity chart would display here</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {[
                {
                  title: "New content added",
                  description: "Stranger Things Season 5 has been added to the library",
                  time: "10 minutes ago",
                  icon: <Film size={16} />,
                  color: "bg-purple-500"
                },
                {
                  title: "New user registered",
                  description: "john.doe@example.com created a new account",
                  time: "1 hour ago",
                  icon: <Users size={16} />,
                  color: "bg-blue-500"
                },
                {
                  title: "Payment received",
                  description: "Received $12.99 from user sarah.williams@example.com",
                  time: "2 hours ago",
                  icon: <DollarSign size={16} />,
                  color: "bg-green-500"
                },
                {
                  title: "Server maintenance",
                  description: "Completed server maintenance and optimization",
                  time: "Yesterday",
                  icon: <Activity size={16} />,
                  color: "bg-yellow-500"
                }
              ].map((item, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== 3 ? (
                      <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    <div className="relative flex items-start space-x-3">
                      <div>
                        <div className={`relative p-2 rounded-full flex items-center justify-center ${item.color} text-white`}>
                          {item.icon}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="mt-0.5 text-sm text-gray-500">{item.time}</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all activity <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;