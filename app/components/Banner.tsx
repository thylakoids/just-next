'use client'

import { useAuth } from '@/app/context/authContext'
import { useRouter } from 'next/navigation'

export default function Banner() {
  const { state, dispatch } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    router.push('/login')
  }

  return (
    <div className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>Welcome, {state.user}</div>
        <button
          onClick={handleLogout}
          className="bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
} 