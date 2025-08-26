import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventory Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium">1,245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low Stock Alerts</span>
              <span className="font-medium text-amber-600">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Out of Stock</span>
              <span className="font-medium text-red-600">3</span>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/inventory" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Inventory →
            </Link>
          </div>
        </div>

        {/* Production Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Production</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Orders</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Machine Utilization</span>
              <span className="font-medium">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delayed Orders</span>
              <span className="font-medium text-amber-600">2</span>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/production" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Production →
            </Link>
          </div>
        </div>

        {/* Energy Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Energy</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Usage</span>
              <span className="font-medium">245 kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency Index</span>
              <span className="font-medium text-green-600">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Alerts</span>
              <span className="font-medium text-amber-600">1</span>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/energy" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Energy →
            </Link>
          </div>
        </div>

        {/* Forecast Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Forecast</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Next Month Demand</span>
              <span className="font-medium">+12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy (Last Forecast)</span>
              <span className="font-medium">89%</span>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/forecast" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Forecast →
            </Link>
          </div>
        </div>

        {/* Decision Support Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Decision Support</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Production Capacity</span>
              <span className="font-medium text-green-600">Optimal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Inventory Level</span>
              <span className="font-medium text-amber-600">Warning</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Energy Efficiency</span>
              <span className="font-medium text-green-600">Good</span>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/decision" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Decision Dashboard →
            </Link>
          </div>
        </div>

        {/* Reports Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Reports</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Available Reports</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Generated</span>
              <span className="font-medium">Today, 10:45 AM</span>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/reports" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Reports →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
