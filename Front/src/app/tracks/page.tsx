'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Music, ArrowLeft, Clock, TrendingUp, Loader2 } from 'lucide-react'
import { tracksAPI, emotionAPI } from '@/lib/api'
import Image from 'next/image'

export default function TracksPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tracks, setTracks] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState('medium_term')
  const [analysisByTrackId, setAnalysisByTrackId] = useState<Record<string, any>>({})
  const [error, setError] = useState('')

  const loadTracks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [tracksResponse, analysesResponse] = await Promise.all([
        tracksAPI.getTopTracks(timeRange, 50),
        emotionAPI.getUserAnalyses(300),
      ])

      const loadedTracks = tracksResponse.data.tracks || []
      const analyses = analysesResponse.data.analyses || []

      const byTrackId: Record<string, any> = {}
      analyses.forEach((analysis: any) => {
        const trackId = analysis.track_id
        if (!trackId || byTrackId[trackId]) return
        byTrackId[trackId] = {
          primaryEmotion: analysis.primary_emotion,
          intensity: analysis.emotion_intensity,
        }
      })

      setTracks(loadedTracks)
      setAnalysisByTrackId(byTrackId)
    } catch (error) {
      console.error('Error loading tracks:', error)
      setError('Não foi possível carregar as músicas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    loadTracks()
  }, [loadTracks, router])

  const emotionBadge: Record<string, { label: string; color: string }> = {
    joy: { label: 'Alegria', color: 'bg-yellow-600/70' },
    sadness: { label: 'Melancolia', color: 'bg-blue-600/70' },
    energy: { label: 'Energia', color: 'bg-orange-600/70' },
    calm: { label: 'Calma', color: 'bg-cyan-700/70' },
    nostalgia: { label: 'Nostalgia', color: 'bg-purple-600/70' },
    euphoria: { label: 'Euforia', color: 'bg-pink-600/70' },
    introspection: { label: 'Introspecção', color: 'bg-indigo-600/70' },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-black">
      <header className="border-b border-gray-800 bg-spotify-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Suas Top Músicas</h1>
          <p className="text-gray-400">Descubra suas músicas mais ouvidas</p>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTimeRange('short_term')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              timeRange === 'short_term'
                ? 'bg-spotify-green text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Último Mês
          </button>
          <button
            onClick={() => setTimeRange('medium_term')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              timeRange === 'medium_term'
                ? 'bg-spotify-green text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Últimos 6 Meses
          </button>
          <button
            onClick={() => setTimeRange('long_term')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              timeRange === 'long_term'
                ? 'bg-spotify-green text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Todo o Tempo
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/20 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Tracks List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-spotify-green animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando suas músicas...</p>
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Nenhuma música encontrada para este período.
          </div>
        ) : (
          <div className="grid gap-4">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-spotify-green transition-all flex items-center gap-4"
              >
                <div className="text-2xl font-bold text-gray-600 w-8">
                  {index + 1}
                </div>
                {track.album?.images?.[0] && (
                  <Image
                    src={track.album.images[0].url}
                    alt={track.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{track.name}</h3>
                  <p className="text-gray-400">
                    {track.artists?.map((a: any) => a.name).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor(track.duration_ms / 60000)}:
                    {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-spotify-green" />
                  <span className="text-spotify-green font-semibold">
                    {track.popularity}%
                  </span>
                </div>
                {analysisByTrackId[track.id]?.primaryEmotion && (
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${emotionBadge[analysisByTrackId[track.id].primaryEmotion]?.color || 'bg-gray-700'}`}>
                    {emotionBadge[analysisByTrackId[track.id].primaryEmotion]?.label || analysisByTrackId[track.id].primaryEmotion}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
