import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <Link 
             href="/analysis?tab=orders"
             className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
           >
             <div className="text-2xl mr-3">📊</div>
             <div>
               <h3 className="font-medium">Order Analytics</h3>
               <p className="text-sm text-gray-600">View demand patterns</p>
             </div>
           </Link>
          
          <Link 
            href="/analysis?tab=stock"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mr-3">📦</div>
            <div>
              <h3 className="font-medium">Stock Insights</h3>
              <p className="text-sm text-gray-600">Check inventory levels</p>
            </div>
          </Link>
          
                     <Link 
             href="/analysis?tab=production"
             className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
           >
             <div className="text-2xl mr-3">🏭</div>
             <div>
               <h3 className="font-medium">Production Analytics</h3>
               <p className="text-sm text-gray-600">Plan production</p>
             </div>
           </Link>
          
                     <Link 
             href="/analysis?tab=sales"
             className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
           >
             <div className="text-2xl mr-3">💰</div>
             <div>
               <h3 className="font-medium">Sales Analytics</h3>
               <p className="text-sm text-gray-600">Optimize sales</p>
             </div>
           </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventory Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium">5 Products</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low Stock Alerts</span>
              <span className="font-medium text-amber-600">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">High Stock Items</span>
              <span className="font-medium text-blue-600">1</span>
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
              <span className="text-gray-600">High Priority Needs</span>
              <span className="font-medium text-red-600">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Medium Priority</span>
              <span className="font-medium text-amber-600">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low Priority</span>
              <span className="font-medium text-green-600">1</span>
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
              <span className="text-gray-600">Optimization Opportunity</span>
              <span className="font-medium text-amber-600">8%</span>
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
            <div className="flex justify-between">
              <span className="text-gray-600">Trend</span>
              <span className="font-medium text-green-600">↗️ Upward</span>
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

        {/* Sales Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sales</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">High Urgency Items</span>
              <span className="font-medium text-red-600">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Liquidation Needed</span>
              <span className="font-medium text-amber-600">150 MT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price Actions</span>
              <span className="font-medium text-blue-600">2↑ 1↓</span>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/analysis?tab=sales" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Sales →
            </Link>
          </div>
        </div>

        {/* Decision Support Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Decision Support</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Overall Status</span>
              <span className="font-medium text-amber-600">⚠️ Attention</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Critical Alerts</span>
              <span className="font-medium text-red-600">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Actions Required</span>
              <span className="font-medium text-blue-600">5</span>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/decision" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Decisions →
            </Link>
          </div>
        </div>
      </div>

      {/* Data Analytics */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Data Analytics</h2>
                    <p className="text-blue-700 mb-4">Analyze existing data from Sunflag legacy system</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <Link 
             href="/real-analysis?tab=orders"
             className="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors bg-white"
           >
             <div className="text-2xl mr-3">📈</div>
             <div>
               <h3 className="font-medium text-blue-900">Order Analytics</h3>
               <p className="text-sm text-blue-700">Export & Local orders</p>
             </div>
           </Link>
          
                     <Link 
             href="/real-analysis?tab=stock"
             className="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors bg-white"
           >
             <div className="text-2xl mr-3">📋</div>
             <div>
               <h3 className="font-medium text-blue-900">Stock Insights</h3>
               <p className="text-sm text-blue-700">Box in Hand data</p>
             </div>
           </Link>
          
                     <Link 
             href="/real-analysis?tab=production"
             className="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors bg-white"
           >
             <div className="text-2xl mr-3">⚙️</div>
             <div>
               <h3 className="font-medium text-blue-900">Production Analytics</h3>
               <p className="text-sm text-blue-700">Production gaps</p>
             </div>
           </Link>
          
                     <Link 
             href="/real-analysis?tab=sales"
             className="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors bg-white"
           >
             <div className="text-2xl mr-3">🎯</div>
             <div>
               <h3 className="font-medium text-blue-900">Sales Analytics</h3>
               <p className="text-sm text-blue-700">Sales recommendations</p>
             </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
