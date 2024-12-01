'use client'

import Link from 'next/link'

export default function TodoPanel() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Link 
        href="/todo"
        className="block relative hover:opacity-75 transition-opacity"
      >
        <div className="absolute -left-2 -top-2 w-12 h-12 bg-green-100 rounded-lg transform -rotate-6"></div>
        <div className="relative">
          <h2 className="text-2xl font-semibold text-gray-900">
            Todo List
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your tasks and todos
          </p>
        </div>
      </Link>
    </div>
  )
} 