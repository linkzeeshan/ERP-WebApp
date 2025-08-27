"use client";

import Link from "next/link";
import { handleUpdateItem } from "./actions";
import { useFormStatus } from "react-dom";

interface InventoryItem {
  id: number;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  status: string;
  lastUpdated: string;
  batchNumber: string;
  description: string;
  location: string;
  minimumStock: number;
  reorderPoint: number;
  supplier: string;
  cost: number;
  currency: string;
}

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

export default function EditInventoryForm({ item }: { item: InventoryItem }) {
  return (
    <form action={handleUpdateItem} className="space-y-6">
      <input type="hidden" name="id" value={item.id} />
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
          href={`/inventory/${item.id}`}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 mr-4"
        >
          Cancel
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
