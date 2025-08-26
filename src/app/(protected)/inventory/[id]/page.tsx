import Link from "next/link";

// Mock inventory item data
const getInventoryItem = (id: string) => {
  return {
    id: parseInt(id),
    name: "Raw Material A",
    type: "raw",
    quantity: 1500,
    unit: "kg",
    status: "normal",
    lastUpdated: "2025-08-20",
    batchNumber: "RM-A-2025-08-15",
    description: "High-quality raw material used in production of Product Alpha and Beta. Sourced from Supplier XYZ.",
    location: "Warehouse A, Section 3, Rack 12",
    minimumStock: 500,
    reorderPoint: 800,
    supplier: "Supplier XYZ",
    cost: 25.50,
    currency: "USD",
  };
};

// Mock batch history data
const batchHistory = [
  {
    date: "2025-08-15",
    action: "Received",
    quantity: 2000,
    batchNumber: "RM-A-2025-08-15",
    performedBy: "John Doe",
  },
  {
    date: "2025-08-17",
    action: "Used in Production",
    quantity: -300,
    batchNumber: "RM-A-2025-08-15",
    performedBy: "Production Line A",
  },
  {
    date: "2025-08-19",
    action: "Used in Production",
    quantity: -200,
    batchNumber: "RM-A-2025-08-15",
    performedBy: "Production Line B",
  },
];

export default function InventoryItemPage({ params }: { params: { id: string } }) {
  const item = getInventoryItem(params.id);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/inventory" className="text-indigo-600 hover:text-indigo-800 mr-4">
          &larr; Back to Inventory
        </Link>
        <h1 className="text-3xl font-bold">Inventory Item Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item Details Card */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Item Information</h2>
            <Link
              href={`/inventory/edit/${item.id}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Edit Item
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Item Name</p>
              <p className="font-medium">{item.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">
                {item.type === "raw" && "Raw Material"}
                {item.type === "semi" && "Semi-Finished"}
                {item.type === "finished" && "Finished Product"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-medium">
                {item.quantity} {item.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.status === "normal"
                    ? "bg-green-100 text-green-800"
                    : item.status === "low"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.status === "normal" && "Normal"}
                {item.status === "low" && "Low Stock"}
                {item.status === "out" && "Out of Stock"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Batch Number</p>
              <p className="font-medium">{item.batchNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{item.lastUpdated}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{item.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Supplier</p>
              <p className="font-medium">{item.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cost</p>
              <p className="font-medium">
                {item.cost} {item.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Minimum Stock</p>
              <p className="font-medium">
                {item.minimumStock} {item.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reorder Point</p>
              <p className="font-medium">
                {item.reorderPoint} {item.unit}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1">{item.description}</p>
          </div>
        </div>

        {/* Stock Level Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Stock Level</h2>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Current Stock
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {Math.round((item.quantity / item.reorderPoint) * 100)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${Math.min(100, Math.round((item.quantity / item.reorderPoint) * 100))}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Stock:</span>
              <span className="font-medium">
                {item.quantity} {item.unit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Minimum Stock:</span>
              <span className="font-medium">
                {item.minimumStock} {item.unit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reorder Point:</span>
              <span className="font-medium">
                {item.reorderPoint} {item.unit}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Adjust Stock
              </button>
              <button className="w-full bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50">
                Create Order
              </button>
              <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                Print Label
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Batch History */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Batch History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performed By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batchHistory.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={record.quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {record.quantity > 0 ? "+" : ""}{record.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.batchNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.performedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
