'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      localStorage.setItem('token', token)
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-spotify-green animate-spin mx-auto mb-4" />
        <p className="text-xl text-gray-300">Autenticando...</p>
      </div>
    </div>
  )
}
