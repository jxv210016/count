import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Session as GameSession } from '../types/database'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Stats {
  totalSessions: number
  totalHands: number
  avgCountAccuracy: number
  avgDecisionAccuracy: number
  recentSessions: GameSession[]
}

export function ProgressPage() {
  const { user, isConfigured } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConfigured && user) {
      loadStats()
    } else {
      setLoading(false)
    }
  }, [user, isConfigured])

  async function loadStats() {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) throw error

      const sessions = data as GameSession[] | null

      if (sessions && sessions.length > 0) {
        const totalHands = sessions.reduce((sum, s) => sum + s.hands_played, 0)
        const totalCountChecks = sessions.reduce((sum, s) => sum + s.count_checks, 0)
        const totalCountCorrect = sessions.reduce((sum, s) => sum + s.count_correct, 0)
        const totalDecisions = sessions.reduce((sum, s) => sum + s.decisions_total, 0)
        const totalDecisionsCorrect = sessions.reduce((sum, s) => sum + s.decisions_correct, 0)

        setStats({
          totalSessions: sessions.length,
          totalHands,
          avgCountAccuracy: totalCountChecks > 0
            ? Math.round((totalCountCorrect / totalCountChecks) * 100)
            : 0,
          avgDecisionAccuracy: totalDecisions > 0
            ? Math.round((totalDecisionsCorrect / totalDecisions) * 100)
            : 0,
          recentSessions: sessions,
        })
      } else {
        setStats({
          totalSessions: 0,
          totalHands: 0,
          avgCountAccuracy: 0,
          avgDecisionAccuracy: 0,
          recentSessions: [],
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConfigured) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-white mb-6">Progress</h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">
            Sign in to track your progress across sessions.
          </p>
          <p className="text-gray-500 text-sm">
            Without an account, your stats are only saved during the current session.
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-white mb-6">Progress</h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">
            Please sign in to view your progress.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-white mb-6">Progress</h1>
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    )
  }

  // Prepare chart data
  const chartData = stats?.recentSessions
    .slice()
    .reverse()
    .map((session, index) => ({
      name: `S${index + 1}`,
      countAccuracy: session.count_checks > 0
        ? Math.round((session.count_correct / session.count_checks) * 100)
        : 0,
      decisionAccuracy: session.decisions_total > 0
        ? Math.round((session.decisions_correct / session.decisions_total) * 100)
        : 0,
    })) || []

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Progress</h1>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Sessions"
          value={stats?.totalSessions || 0}
        />
        <StatCard
          label="Total Hands"
          value={stats?.totalHands || 0}
        />
        <StatCard
          label="Count Accuracy"
          value={`${stats?.avgCountAccuracy || 0}%`}
          color={getAccuracyColor(stats?.avgCountAccuracy || 0)}
        />
        <StatCard
          label="Decision Accuracy"
          value={`${stats?.avgDecisionAccuracy || 0}%`}
          color={getAccuracyColor(stats?.avgDecisionAccuracy || 0)}
        />
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Accuracy Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="countAccuracy"
                  stroke="#10B981"
                  name="Count %"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="decisionAccuracy"
                  stroke="#3B82F6"
                  name="Decision %"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">Count Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-400">Decision Accuracy</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent sessions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Sessions</h2>
        {stats?.recentSessions && stats.recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2 text-gray-400">Date</th>
                  <th className="text-center p-2 text-gray-400">Hands</th>
                  <th className="text-center p-2 text-gray-400">Decks</th>
                  <th className="text-center p-2 text-gray-400">Count %</th>
                  <th className="text-center p-2 text-gray-400">Decision %</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSessions.map(session => {
                  const countAcc = session.count_checks > 0
                    ? Math.round((session.count_correct / session.count_checks) * 100)
                    : '-'
                  const decAcc = session.decisions_total > 0
                    ? Math.round((session.decisions_correct / session.decisions_total) * 100)
                    : '-'

                  return (
                    <tr key={session.id} className="border-b border-gray-700/50">
                      <td className="p-2 text-gray-300">
                        {new Date(session.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-center p-2 text-gray-300">
                        {session.hands_played}
                      </td>
                      <td className="text-center p-2 text-gray-300">
                        {session.deck_count}
                      </td>
                      <td className={`text-center p-2 ${getAccuracyColor(typeof countAcc === 'number' ? countAcc : 0)}`}>
                        {typeof countAcc === 'number' ? `${countAcc}%` : countAcc}
                      </td>
                      <td className={`text-center p-2 ${getAccuracyColor(typeof decAcc === 'number' ? decAcc : 0)}`}>
                        {typeof decAcc === 'number' ? `${decAcc}%` : decAcc}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No sessions yet. Start playing to track your progress!
          </p>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color = 'text-white',
}: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  )
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return 'text-green-400'
  if (accuracy >= 70) return 'text-yellow-400'
  return 'text-red-400'
}
