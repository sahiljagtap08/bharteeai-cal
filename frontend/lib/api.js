// frontend/lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) throw new Error('Login failed')
  return response.json()
}

export async function getInterview(id) {
  const response = await fetch(`${API_URL}/api/interview/${id}`)
  if (!response.ok) throw new Error('Failed to fetch interview')
  return response.json()
}
