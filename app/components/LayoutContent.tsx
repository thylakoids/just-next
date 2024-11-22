'use client'

import { useAuth } from '../context/authContext'
import Banner from './Banner'

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { state } = useAuth()

  return (
    <>
      {state.isAuthenticated && <Banner />}
      {children}
    </>
  )
} 