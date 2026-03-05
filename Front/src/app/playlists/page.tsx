'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Music, ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { playlistAPI } from '@/lib/api'

export default function PlaylistsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState('')

  const emotions = [
    { id: 'joy', name: 'Alegria', emoji: '😊', color: 'bg-yellow-500' },
    { id: 'sadness', name: 'Melancolia', emoji: '😢', color: 'bg-blue-500' },
    { id: 'energy', name: 'Energia', emoji: '⚡', color: 'bg-orange-500' },
    { id: 'calm', name: 'Calma', emoji: '😌', color: 'bg-sky-400' },
    { id: 'nostalgia', name: 'Nostalgia', emoji: '💭', color: 'bg-purple-400' },
    { id: 'euphoria', name: 'Euforia', emoji: '🎉', color: 'bg-pink-500' },
    { id: 'introspection', name: 'Introspecção', emoji: '🤔', color: 'bg-indigo-500' },
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    setLoading(true)
    try {
      const response = await playlistAPI.getUserPlaylists()
      setPlaylists(response.data.playlists)
    } catch (error) {
      console.error('Error loading playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!selectedEmotion) return

    setCreating(true)
    try {
      const emotion = emotions.find(e => e.id === selectedEmotion)
      await playlistAPI.createEmotionPlaylist({
        emotion: selectedEmotion,
        name: `Emotify - ${emotion?.name}`,
        description: `Playlist criada automaticamente com músicas ${emotion?.name.toLowerCase()}`,
        trackCount: 20
      })
      
      setShowCreateModal(false)
      setSelectedEmotion('')
      await loadPlaylists()
      alert('Playlist criada com sucesso!')
    } catch (error: any) {
      console.error('Error creating playlist:', error)
      alert(error.response?.data?.error || 'Erro ao criar playlist. Analise suas músicas primeiro!')
    } finally {
      setCreating(false)
    }
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
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold mb-4">Suas Playlists</h1>
            <p className="text-gray-400">Crie playlists baseadas em emoções</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-spotify-green hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Criar Playlist Emocional
          </button>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-spotify-green animate-pulse mx-auto mb-4" />
            <p className="text-gray-400">Carregando playlists...</p>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Você ainda não tem playlists</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-spotify-green hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-all"
            >
              Criar Primeira Playlist
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-spotify-green transition-all cursor-pointer"
                onClick={() => window.open(`https://open.spotify.com/playlist/${playlist.id}`, '_blank')}
              >
                {playlist.images?.[0] && (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-bold text-xl mb-2">{playlist.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{playlist.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{playlist.tracks?.total || 0} músicas</span>
                  <span className="text-spotify-green text-sm font-semibold">Abrir no Spotify</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-8 rounded-3xl border border-gray-800 max-w-2xl w-full"
          >
            <h2 className="text-3xl font-bold mb-6">Criar Playlist Emocional</h2>
            <p className="text-gray-400 mb-8">
              Selecione uma emoção para criar uma playlist com suas músicas que correspondem a esse sentimento
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {emotions.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className={`${emotion.color} p-6 rounded-2xl text-center transition-all ${
                    selectedEmotion === emotion.id
                      ? 'ring-4 ring-white scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="text-4xl mb-2">{emotion.emoji}</div>
                  <div className="text-sm font-semibold text-white">{emotion.name}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setSelectedEmotion('')
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!selectedEmotion || creating}
                className="flex-1 bg-spotify-green hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando...
                  </span>
                ) : (
                  'Criar Playlist'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
