import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-8xl mb-6">♠</div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Card Counter Pro
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-400 mb-8">
          Master the Hi-Lo card counting system with realistic blackjack practice
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/play">
            <Button size="lg" className="w-full sm:w-auto min-w-[160px]">
              Start Playing
            </Button>
          </Link>
          <Link to="/learn">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto min-w-[160px]">
              Learn First
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="text-3xl mb-3">🎰</div>
            <h3 className="text-lg font-semibold text-white mb-2">Practice</h3>
            <p className="text-sm text-gray-400">
              Full blackjack gameplay with real-time feedback on every decision
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-white mb-2">Learn</h3>
            <p className="text-sm text-gray-400">
              Interactive strategy charts and Hi-Lo counting tutorials
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Drill</h3>
            <p className="text-sm text-gray-400">
              Practice counting cards with focused drills and timed exercises
            </p>
          </div>
        </div>

        {/* Hi-Lo quick reference */}
        <div className="mt-12 bg-gray-800/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Hi-Lo Quick Reference</h3>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold">+1</div>
              <div className="text-gray-400 text-sm">2, 3, 4, 5, 6</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-2xl font-bold">0</div>
              <div className="text-gray-400 text-sm">7, 8, 9</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 text-2xl font-bold">-1</div>
              <div className="text-gray-400 text-sm">10, J, Q, K, A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
