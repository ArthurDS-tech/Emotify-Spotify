'use client'

import { useEffect, useState } from 'react'
import { Music, Heart, TrendingUp, Users, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login')
      const data = await response.json()
      window.location.href = data.authUrl
    } catch (error) {
      console.error('Error getting auth URL:', error)
      alert('Erro ao conectar com Spotify. Verifique se o backend está rodando.')
    }
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-black">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Music className="w-24 h-24 text-spotify-green" />
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-spotify-green via-green-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Emotify
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 mb-4">
            Descubra as emoções por trás da sua música
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Transforme seus dados do Spotify em insights emocionais profundos.
            Entenda o DNA emocional das suas músicas favoritas.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="bg-spotify-green hover:bg-green-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all shadow-lg hover:shadow-spotify-green/50"
          >
            Conectar com Spotify
          </motion.button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32"
        >
          <FeatureCard
            icon={<Heart className="w-12 h-12" />}
            title="Análise Emocional"
            description="IA avançada identifica 7 emoções diferentes nas suas músicas"
            color="text-red-400"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12" />}
            title="Insights Personalizados"
            description="Visualize padrões e tendências do seu gosto musical"
            color="text-blue-400"
          />
          <FeatureCard
            icon={<Music className="w-12 h-12" />}
            title="Playlists Inteligentes"
            description="Crie playlists baseadas em emoções específicas"
            color="text-purple-400"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12" />}
            title="Conexões Sociais"
            description="Encontre pessoas com gosto musical similar"
            color="text-green-400"
          />
        </motion.div>

        {/* Emotions Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-32"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            7 Emoções Identificadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <EmotionBadge emoji="😊" name="Alegria" color="bg-yellow-500" />
            <EmotionBadge emoji="😢" name="Melancolia" color="bg-blue-500" />
            <EmotionBadge emoji="⚡" name="Energia" color="bg-orange-500" />
            <EmotionBadge emoji="😌" name="Calma" color="bg-sky-400" />
            <EmotionBadge emoji="💭" name="Nostalgia" color="bg-purple-400" />
            <EmotionBadge emoji="🎉" name="Euforia" color="bg-pink-500" />
            <EmotionBadge emoji="🤔" name="Introspecção" color="bg-indigo-500" />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-32 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Feito com ❤️ e muita música</p>
          <p className="mt-2 text-sm">Powered by Spotify Web API</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-spotify-green transition-all"
    >
      <div className={`${color} mb-4`}>{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

function EmotionBadge({ emoji, name, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`${color} p-6 rounded-2xl text-center cursor-pointer transition-all hover:shadow-lg`}
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="text-sm font-semibold text-white">{name}</div>
    </motion.div>
  )
}
