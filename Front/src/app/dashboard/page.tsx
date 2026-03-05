'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Music, TrendingUp, Heart, Sparkles, Loader2 } from 'lucide-react'
import { emotionAPI, userAPI } from '@/lib/api'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [distribution, setDistribution] = useState<any>(null)
  const [insights, setInsights] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profileRes, distributionRes, insightsRes] = await Promise.all([
        userAPI.getProfile(),
        emotionAPI.getEmotionDistribution(),
        emotionAPI.getInsights(),
      ])

      setUser(profileRes.data.user)
      setDistribution(distributionRes.data)
      setInsights(insightsRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      await emotionAPI.analyzeTopTracks('medium_term', 50)
      await loadData()
    } catch (error) {
      console.error('Error analyzing:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-spotify-green animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-spotify-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-spotify-green" />
            <h1 className="text-2xl font-bold">Emotify</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                {user.profile_image && (
                  <img
                    src={user.profile_image}
                    alt={user.display_name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <span className="text-gray-300">{user.display_name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Bem-vindo, {user?.display_name}! 👋
          </h2>
          <p className="text-gray-400 text-lg">
            Vamos descobrir as emoções por trás da sua música
          </p>
        </motion.div>

        {/* Analyze Button */}
        {(!distribution || distribution.totalTracks === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-spotify-green to-green-600 p-8 rounded-3xl mb-12 text-center"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Pronto para começar?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Analise suas músicas favoritas e descubra seu perfil emocional
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-white text-spotify-black font-bold py-4 px-12 rounded-full text-lg hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {analyzing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analisando...
                </span>
              ) : (
                'Analisar Minhas Músicas'
              )}
            </button>
          </motion.div>
        )}

        {/* Stats Grid */}
        {distribution && distribution.totalTracks > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <StatCard
              icon={<Music className="w-8 h-8" />}
              title="Músicas Analisadas"
              value={distribution.totalTracks}
              color="text-blue-400"
            />
            <StatCard
              icon={<Heart className="w-8 h-8" />}
              title="Emoção Dominante"
              value={distribution.dominantEmotion}
              subtitle={`${distribution.dominantPercentage?.toFixed(1)}%`}
              color="text-red-400"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Perfil Emocional"
              value="Disponível"
              color="text-green-400"
            />
          </motion.div>
        )}

        {/* Emotion Distribution */}
        {distribution && distribution.distribution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 mb-12"
          >
            <h3 className="text-2xl font-bold mb-6">Distribuição Emocional</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(distribution.distribution).map(([emotion, count]: any) => (
                <EmotionCard
                  key={emotion}
                  emotion={emotion}
                  count={count}
                  total={distribution.totalTracks}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Insights */}
        {insights && insights.personalizedInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800"
          >
            <h3 className="text-2xl font-bold mb-6">Seus Insights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {insights.personalizedInsights.map((insight: any, index: number) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
      <div className={`${color} mb-3`}>{icon}</div>
      <h4 className="text-gray-400 text-sm mb-1">{title}</h4>
      <p className="text-3xl font-bold capitalize">{value}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

function EmotionCard({ emotion, count, total }: any) {
  const percentage = ((count / total) * 100).toFixed(1)
  const emotionConfig: any = {
    joy: { emoji: '😊', color: 'bg-yellow-500', name: 'Alegria' },
    sadness: { emoji: '😢', color: 'bg-blue-500', name: 'Melancolia' },
    energy: { emoji: '⚡', color: 'bg-orange-500', name: 'Energia' },
    calm: { emoji: '😌', color: 'bg-sky-400', name: 'Calma' },
    nostalgia: { emoji: '💭', color: 'bg-purple-400', name: 'Nostalgia' },
    euphoria: { emoji: '🎉', color: 'bg-pink-500', name: 'Euforia' },
    introspection: { emoji: '🤔', color: 'bg-indigo-500', name: 'Introspecção' },
  }

  const config = emotionConfig[emotion] || { emoji: '🎵', color: 'bg-gray-500', name: emotion }

  return (
    <div className={`${config.color} p-6 rounded-2xl text-center`}>
      <div className="text-4xl mb-2">{config.emoji}</div>
      <div className="text-sm font-semibold text-white mb-1">{config.name}</div>
      <div className="text-2xl font-bold">{percentage}%</div>
      <div className="text-xs opacity-75">{count} músicas</div>
    </div>
  )
}

function InsightCard({ insight }: any) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <div className="text-3xl mb-3">{insight.icon}</div>
      <h4 className="text-xl font-bold mb-2">{insight.title}</h4>
      <p className="text-gray-400">{insight.description}</p>
    </div>
  )
}
