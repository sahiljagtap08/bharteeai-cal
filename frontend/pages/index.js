// frontend/pages/index.js
import Head from 'next/head'
import { useState } from 'react'
import { Button } from '@radix-ui/react-button'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div>
      <Head>
        <title>BharteeAI</title>
        <meta name="description" content="AI-powered interview platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to BharteeAI</h1>
        {isLoggedIn ? (
          <Button onClick={() => setIsLoggedIn(false)}>Log Out</Button>
        ) : (
          <Button onClick={() => setIsLoggedIn(true)}>Log In</Button>
        )}
      </main>
    </div>
  )
}
