import React from "react";
import { MdDeleteForever, MdEdit } from "react-icons/md";

export default function ItemList({ items, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {/* Desktop View - Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-600">
        <div className="col-span-3">Name</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1 text-center">Qty</div>
        <div className="col-span-4">Note</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Items List - Adapts for Mobile and Desktop */}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center">
              {/* Mobile Labels (Visible on mobile, hidden on desktop) */}
              <div className="md:hidden col-span-1 text-sm font-semibold text-gray-500">
                Name
              </div>
              <div className="md:hidden col-span-1 text-right">
                <div className="flex gap-2 justify-end">
                  <button
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-2 md:col-span-3 font-semibold text-gray-800 truncate">
                {item.name}
              </div>

              <div className="md:hidden col-span-1 text-sm font-semibold text-gray-500">
                Category
              </div>
              <div className="col-span-2 md:col-span-2 text-gray-600 truncate">
                {item.category}
              </div>

              <div className="md:hidden col-span-1 text-sm font-semibold text-gray-500">
                Quantity
              </div>
              <div className="col-span-1 md:col-span-1 text-gray-600 md:text-center">
                {item.quantity}
              </div>

              <div className="md:hidden col-span-1 text-sm font-semibold text-gray-500">
                Note
              </div>
              <div className="col-span-2 md:col-span-4 text-gray-500 text-sm truncate">
                {item.note || "-"}
              </div>

              {/* Desktop Action Buttons (Hidden on mobile) */}
              <div className="hidden md:flex col-span-2 justify-end gap-2">
                <button
                  className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer"
                  onClick={() => onEdit(item)}
                >
                  <MdEdit className="text-2xl" />
                </button>
                <button
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer"
                  onClick={() => onDelete(item.id)}
                >
                  <MdDeleteForever className="text-2xl" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
