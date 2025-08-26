"use client";

import Link from "next/link";
import { handleUpdateItem } from "./actions";
import { useFormStatus } from "react-dom";

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

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
    >
      {pending ? 'Updating...' : 'Update Item'}
    </button>
  );
}

export default function EditInventoryItemPage({ params }: { params: { id: string } }) {
  const item = getInventoryItem(params.id);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href={`/inventory/${params.id}`} className="text-indigo-600 hover:text-indigo-800 mr-4">
          &larr; Back to Item Details
        </Link>
        <h1 className="text-3xl font-bold">Edit Inventory Item</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form action={handleUpdateItem} className="space-y-6">
          <input type="hidden" name="id" value={params.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={item.name}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                required
                defaultValue={item.type}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="raw">Raw Material</option>
                <option value="semi">Semi-Finished</option>
                <option value="finished">Finished Product</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                required
                defaultValue={item.quantity}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                required
                defaultValue={item.unit}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Batch Number
              </label>
              <input
                type="text"
                id="batchNumber"
                name="batchNumber"
                required
                defaultValue={item.batchNumber}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue={item.status}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="normal">Normal</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={item.location}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                defaultValue={item.supplier}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                Cost
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                step="0.01"
                min="0"
                defaultValue={item.cost}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                id="currency"
                name="currency"
                defaultValue={item.currency}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock
              </label>
              <input
                type="number"
                id="minimumStock"
                name="minimumStock"
                min="0"
                defaultValue={item.minimumStock}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700 mb-1">
                Reorder Point
              </label>
              <input
                type="number"
                id="reorderPoint"
                name="reorderPoint"
                min="0"
                defaultValue={item.reorderPoint}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={item.description}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <Link
              href={`/inventory/${params.id}`}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 mr-4"
            >
              Cancel
            </Link>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
