// frontend/components/Header.js
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <a className="text-xl font-bold">BharteeAI</a>
        </Link>
        <div>
          {user ? (
            <>
              <Link href="/dashboard">
                <a className="mr-4">Dashboard</a>
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="mr-4">Login</a>
              </Link>
              <Link href="/register">
                <a>Register</a>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}