import Link from "next/link";

// Mock production data
const productionOrders = [
  {
    id: 1,
    orderNumber: "PO-2025-08-001",
    product: "Product Alpha",
    quantity: 500,
    startDate: "2025-08-22",
    endDate: "2025-08-25",
    status: "in_progress",
    machine: "Machine A",
    priority: "high",
    completion: 45,
  },
  {
    id: 2,
    orderNumber: "PO-2025-08-002",
    product: "Product Beta",
    quantity: 300,
    startDate: "2025-08-23",
    endDate: "2025-08-26",
    status: "scheduled",
    machine: "Machine B",
    priority: "medium",
    completion: 0,
  },
  {
    id: 3,
    orderNumber: "PO-2025-08-003",
    product: "Product Gamma",
    quantity: 200,
    startDate: "2025-08-24",
    endDate: "2025-08-27",
    status: "scheduled",
    machine: "Machine C",
    priority: "low",
    completion: 0,
  },
  {
    id: 4,
    orderNumber: "PO-2025-08-004",
    product: "Product Delta",
    quantity: 150,
    startDate: "2025-08-21",
    endDate: "2025-08-23",
    status: "completed",
    machine: "Machine A",
    priority: "high",
    completion: 100,
  },
  {
    id: 5,
    orderNumber: "PO-2025-08-005",
    product: "Product Epsilon",
    quantity: 250,
    startDate: "2025-08-26",
    endDate: "2025-08-29",
    status: "scheduled",
    machine: "Machine B",
    priority: "medium",
    completion: 0,
  },
];

// Mock machine data
const machines = [
  { id: 1, name: "Machine A", status: "running", utilization: 85, maintenance: "2025-09-05" },
  { id: 2, name: "Machine B", status: "idle", utilization: 0, maintenance: "2025-08-25" },
  { id: 3, name: "Machine C", status: "setup", utilization: 30, maintenance: "2025-09-15" },
  { id: 4, name: "Machine D", status: "maintenance", utilization: 0, maintenance: "2025-08-22" },
];

export default function ProductionPage() {
  // Calculate the date range for the Gantt chart
  const today = new Date("2025-08-21");
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Production Scheduler</h1>
        <div className="flex gap-4">
          <Link
            href="/production/new-order"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            New Production Order
          </Link>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            Export Schedule
          </button>
        </div>
      </div>

      {/* Machine Status Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Machine Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {machines.map((machine) => (
            <div key={machine.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{machine.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    machine.status === "running"
                      ? "bg-green-100 text-green-800"
                      : machine.status === "idle"
                      ? "bg-gray-100 text-gray-800"
                      : machine.status === "setup"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Utilization:</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        machine.utilization > 80
                          ? "bg-green-500"
                          : machine.utilization > 50
                          ? "bg-blue-500"
                          : machine.utilization > 0
                          ? "bg-amber-500"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${machine.utilization}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Next Maintenance:</span>{" "}
                  <span>{machine.maintenance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Production Schedule</h2>
        <div className="min-w-[1000px]">
          {/* Gantt Header */}
          <div className="flex border-b">
            <div className="w-64 font-medium py-2 px-4">Order / Machine</div>
            {dates.map((date, index) => {
              const d = new Date(date);
              const day = d.getDate();
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div
                  key={index}
                  className={`w-16 text-center py-2 text-sm ${
                    isWeekend ? "bg-gray-100" : ""
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Machine Rows */}
          {machines.map((machine) => (
            <div key={machine.id} className="flex border-b">
              <div className="w-64 font-medium py-2 px-4 bg-gray-50">{machine.name}</div>
              {dates.map((date, index) => {
                const d = new Date(date);
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                
                // Find orders for this machine on this date
                const ordersOnDate = productionOrders.filter(
                  (order) =>
                    order.machine === machine.name &&
                    new Date(order.startDate) <= new Date(date) &&
                    new Date(order.endDate) >= new Date(date)
                );

                return (
                  <div
                    key={index}
                    className={`w-16 py-2 relative ${isWeekend ? "bg-gray-100" : ""}`}
                  >
                    {ordersOnDate.map((order) => (
                      <div
                        key={order.id}
                        className={`absolute h-5 rounded-sm ${
                          order.status === "completed"
                            ? "bg-green-500"
                            : order.status === "in_progress"
                            ? "bg-blue-500"
                            : order.priority === "high"
                            ? "bg-amber-500"
                            : order.priority === "medium"
                            ? "bg-indigo-500"
                            : "bg-gray-500"
                        }`}
                        style={{
                          left: "0",
                          right: "0",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        title={`${order.orderNumber} - ${order.product}`}
                      ></div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Production Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 pb-4">Production Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Machine
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productionOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.machine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status === "in_progress"
                        ? "In Progress"
                        : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : order.priority === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${order.completion}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{order.completion}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/production/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      href={`/production/edit/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
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
