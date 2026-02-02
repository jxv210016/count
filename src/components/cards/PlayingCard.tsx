import { clsx } from 'clsx'
import type { Card } from '../../types'

interface PlayingCardProps {
  card: Card
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showCount?: boolean
}

const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '\u2665',
  diamonds: '\u2666',
  clubs: '\u2663',
  spades: '\u2660',
}

const SUIT_COLORS: Record<string, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-gray-900',
  spades: 'text-gray-900',
}

export function PlayingCard({ card, size = 'md', className, showCount }: PlayingCardProps) {
  const suitSymbol = SUIT_SYMBOLS[card.suit]
  const suitColor = SUIT_COLORS[card.suit]

  const sizeClasses = {
    sm: 'w-12 h-16 text-sm',
    md: 'w-16 h-22 text-lg',
    lg: 'w-24 h-32 text-2xl',
  }

  // Get Hi-Lo count value for display
  const getCountValue = () => {
    const rank = card.rank
    if (['2', '3', '4', '5', '6'].includes(rank)) return '+1'
    if (['10', 'J', 'Q', 'K', 'A'].includes(rank)) return '-1'
    return '0'
  }

  const getCountColor = () => {
    const rank = card.rank
    if (['2', '3', '4', '5', '6'].includes(rank)) return 'text-green-500'
    if (['10', 'J', 'Q', 'K', 'A'].includes(rank)) return 'text-red-500'
    return 'text-gray-500'
  }

  if (!card.faceUp) {
    return (
      <div
        className={clsx(
          'relative rounded-lg shadow-lg flex items-center justify-center',
          'bg-gradient-to-br from-blue-800 to-blue-900 border-2 border-blue-700',
          sizeClasses[size],
          className
        )}
      >
        <div className="absolute inset-2 border border-blue-600 rounded opacity-50" />
        <div className="text-blue-500 opacity-30 text-4xl">?</div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'relative bg-white rounded-lg shadow-lg flex flex-col p-1.5',
        'border border-gray-300',
        sizeClasses[size],
        className
      )}
    >
      {/* Top left rank and suit */}
      <div className={clsx('flex flex-col items-center leading-none', suitColor)}>
        <span className="font-bold">{card.rank}</span>
        <span>{suitSymbol}</span>
      </div>

      {/* Center suit */}
      <div className={clsx('flex-1 flex items-center justify-center', suitColor)}>
        <span className="text-2xl">{suitSymbol}</span>
      </div>

      {/* Bottom right rank and suit (rotated) */}
      <div className={clsx('flex flex-col items-center leading-none rotate-180', suitColor)}>
        <span className="font-bold">{card.rank}</span>
        <span>{suitSymbol}</span>
      </div>

      {/* Count value overlay */}
      {showCount && (
        <div
          className={clsx(
            'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center',
            'text-xs font-bold bg-gray-900 border border-gray-700',
            getCountColor()
          )}
        >
          {getCountValue()}
        </div>
      )}
    </div>
  )
}
