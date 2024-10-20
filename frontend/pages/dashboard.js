// frontend/pages/dashboard.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@radix-ui/react-button'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch user data from API
    // If not authenticated, redirect to login
  }, [])

  const startNewInterview = () => {
    router.push('/interview/new')
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.name}</p>
          <Button onClick={startNewInterview}>Start New Interview</Button>
        </div>
      )}
    </div>
  )
}
