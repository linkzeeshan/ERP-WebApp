import Link from "next/link";
import { handleUpdateItem } from "./actions";
import EditInventoryForm from "./EditInventoryForm";

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

export default async function EditInventoryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getInventoryItem(id);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href={`/inventory/${id}`} className="text-indigo-600 hover:text-indigo-800 mr-4">
          &larr; Back to Item Details
        </Link>
        <h1 className="text-3xl font-bold">Edit Inventory Item</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <EditInventoryForm item={item} />
      </div>
    </div>
  );
}
