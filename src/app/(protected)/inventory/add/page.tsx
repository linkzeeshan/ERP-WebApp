"use client";

import Link from "next/link";
import { handleAddItem } from "./actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
    >
      {pending ? 'Adding...' : 'Add Item'}
    </button>
  );
}

export default function AddInventoryItemPage() {

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/inventory" className="text-indigo-600 hover:text-indigo-800 mr-4">
          &larr; Back to Inventory
        </Link>
        <h1 className="text-3xl font-bold">Add Inventory Item</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form action={handleAddItem} className="space-y-6">
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select Type</option>
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="kg, liters, units, etc."
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="normal">Normal</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
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
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <Link
              href="/inventory"
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
