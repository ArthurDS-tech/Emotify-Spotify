'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function AuthSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      localStorage.setItem('token', token)
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } else {
      router.push('/')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-spotify-green animate-spin mx-auto mb-4" />
        <p className="text-xl text-gray-300">Autenticando...</p>
        <p className="text-sm text-gray-500 mt-2">Redirecionando para o dashboard...</p>
      </div>
    </div>
  )
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-spotify-black flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-spotify-green animate-spin" />
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  )
}
