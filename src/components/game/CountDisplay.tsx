import { clsx } from 'clsx'
import { formatCount, getCountColor } from '../../lib/counting'

interface CountDisplayProps {
  runningCount: number
  trueCount: number
  cardsRemaining: number
  deckCount: number
  showCount: boolean
  onToggle: () => void
}

export function CountDisplay({
  runningCount,
  trueCount,
  cardsRemaining,
  deckCount,
  showCount,
  onToggle,
}: CountDisplayProps) {
  const decksRemaining = (cardsRemaining / 52).toFixed(1)
  const penetration = ((1 - cardsRemaining / (deckCount * 52)) * 100).toFixed(0)

  return (
    <div className="bg-gray-800/90 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">Count</h3>
        <button
          onClick={onToggle}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {showCount ? 'Hide' : 'Show'}
        </button>
      </div>

      {showCount ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Running:</span>
            <span className={clsx('text-xl font-bold', getCountColor(trueCount))}>
              {formatCount(runningCount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">True:</span>
            <span className={clsx('text-xl font-bold', getCountColor(trueCount))}>
              {formatCount(Math.round(trueCount))}
            </span>
          </div>
          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Decks: {decksRemaining}</span>
              <span>Pen: {penetration}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <span className="text-2xl text-gray-600">???</span>
        </div>
      )}
    </div>
  )
}
