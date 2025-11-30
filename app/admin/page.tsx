const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">1,234</p>
            <p className="text-sm text-blue-600 mt-2">↑ 12% from last month</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-green-800">Products</h3>
            <p className="text-2xl font-bold text-green-600">567</p>
            <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-800">Orders</h3>
            <p className="text-2xl font-bold text-yellow-600">89</p>
            <p className="text-sm text-yellow-600 mt-2">↑ 5% from last month</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800">Revenue</h3>
            <p className="text-2xl font-bold text-purple-600">$12,345</p>
            <p className="text-sm text-purple-600 mt-2">
              ↑ 15% from last month
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-gray-700">New user registration - John Doe</p>
              <span className="text-sm text-gray-500 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-700">Order #12345 completed</p>
              <span className="text-sm text-gray-500 ml-auto">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-gray-700">New product added - iPhone 15</p>
              <span className="text-sm text-gray-500 ml-auto">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
