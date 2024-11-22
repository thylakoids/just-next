import React from 'react'

export default function BannerSkeleton() {
  return (
    <div className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-32 bg-blue-500 rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-blue-700 rounded-full animate-pulse"></div>
        </div>
        <div className="h-10 w-28 bg-blue-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  )
} 