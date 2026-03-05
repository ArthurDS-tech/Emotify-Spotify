'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const message = searchParams.get('message') || 'Erro na autenticação'

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Erro na Autenticação</h1>
        <p className="text-gray-400 mb-8">{message}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-spotify-green hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-spotify-black flex items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 animate-pulse" />
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
