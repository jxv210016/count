import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { signIn, signUp, isConfigured } = useAuth()

  if (!isConfigured) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Auth Not Configured</h1>
          <p className="text-gray-400 mb-6">
            Supabase credentials are not configured. You can still use the app without an account.
          </p>
          <Link to="/play">
            <Button>Continue to Play</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (authError) {
        setError(authError.message)
      } else {
        navigate('/play')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">♠</div>
          <h1 className="text-2xl font-bold text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400 mt-2">
            {isSignUp
              ? 'Start tracking your progress'
              : 'Sign in to continue practicing'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/play"
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Continue without account
          </Link>
        </div>
      </div>
    </div>
  )
}
