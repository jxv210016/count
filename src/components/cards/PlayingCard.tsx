import { clsx } from 'clsx'
import type { Card } from '../../types'
import type { ReactElement } from 'react'

interface PlayingCardProps {
  card: Card
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showCount?: boolean
}

const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const SUIT_COLORS: Record<string, string> = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-black',
  spades: 'text-black',
}

// Suit pattern layouts for numbered cards (1-10)
const getSuitPattern = (rank: string, suit: string, size: 'sm' | 'md' | 'lg') => {
  const symbol = SUIT_SYMBOLS[suit]
  
  // Responsive sizing based on card size
  const symbolSizes: Record<string, Record<string, string>> = {
    'A': { sm: 'text-3xl', md: 'text-5xl', lg: 'text-6xl' },
    '2': { sm: 'text-xl', md: 'text-3xl', lg: 'text-4xl' },
    '3': { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' },
    '4': { sm: 'text-base', md: 'text-2xl', lg: 'text-3xl' },
    '5': { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' },
    '6': { sm: 'text-sm', md: 'text-xl', lg: 'text-2xl' },
    '7': { sm: 'text-sm', md: 'text-lg', lg: 'text-xl' },
    '8': { sm: 'text-xs', md: 'text-lg', lg: 'text-xl' },
    '9': { sm: 'text-xs', md: 'text-base', lg: 'text-lg' },
    '10': { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  }
  
  const symbolSize = symbolSizes[rank]?.[size] || 'text-base'
  
  const patterns: Record<string, ReactElement[]> = {
    'A': [
      <div key="center" className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${symbolSize}`}>
        {symbol}
      </div>
    ],
    '2': [
      <div key="top" className={`absolute top-[20%] left-1/2 -translate-x-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="bottom" className={`absolute bottom-[20%] left-1/2 -translate-x-1/2 rotate-180 ${symbolSize}`}>{symbol}</div>
    ],
    '3': [
      <div key="top" className={`absolute top-[15%] left-1/2 -translate-x-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="center" className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="bottom" className={`absolute bottom-[15%] left-1/2 -translate-x-1/2 rotate-180 ${symbolSize}`}>{symbol}</div>
    ],
    '4': [
      <div key="tl" className={`absolute top-[15%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tr" className={`absolute top-[15%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="bl" className={`absolute bottom-[15%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="br" className={`absolute bottom-[15%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>
    ],
    '5': [
      <div key="tl" className={`absolute top-[15%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tr" className={`absolute top-[15%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="center" className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="bl" className={`absolute bottom-[15%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="br" className={`absolute bottom-[15%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>
    ],
    '6': [
      <div key="tl" className={`absolute top-[15%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tr" className={`absolute top-[15%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="ml" className={`absolute top-1/2 left-[20%] -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="mr" className={`absolute top-1/2 right-[20%] -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="bl" className={`absolute bottom-[15%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="br" className={`absolute bottom-[15%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>
    ],
    '7': [
      <div key="tl" className={`absolute top-[15%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tr" className={`absolute top-[15%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tm" className={`absolute top-[35%] left-1/2 -translate-x-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="ml" className={`absolute top-1/2 left-[20%] -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="mr" className={`absolute top-1/2 right-[20%] -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="bl" className={`absolute bottom-[15%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="br" className={`absolute bottom-[15%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>
    ],
    '8': [
      <div key="tl" className={`absolute top-[15%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tr" className={`absolute top-[15%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tml" className={`absolute top-[35%] left-1/2 -translate-x-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="ml" className={`absolute top-1/2 left-[20%] -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="mr" className={`absolute top-1/2 right-[20%] -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="bml" className={`absolute bottom-[35%] left-1/2 -translate-x-1/2 rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="bl" className={`absolute bottom-[15%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="br" className={`absolute bottom-[15%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>
    ],
    '9': [
      <div key="tl" className={`absolute top-[12%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tr" className={`absolute top-[12%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tml" className={`absolute top-[32%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tmr" className={`absolute top-[32%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="center" className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="bml" className={`absolute bottom-[32%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="bmr" className={`absolute bottom-[32%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="bl" className={`absolute bottom-[12%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="br" className={`absolute bottom-[12%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>
    ],
    '10': [
      <div key="tl" className={`absolute top-[10%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tr" className={`absolute top-[10%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tml" className={`absolute top-[28%] left-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tmr" className={`absolute top-[28%] right-[20%] ${symbolSize}`}>{symbol}</div>,
      <div key="tmc" className={`absolute top-[22%] left-1/2 -translate-x-1/2 ${symbolSize}`}>{symbol}</div>,
      <div key="bmc" className={`absolute bottom-[22%] left-1/2 -translate-x-1/2 rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="bml" className={`absolute bottom-[28%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="bmr" className={`absolute bottom-[28%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="bl" className={`absolute bottom-[10%] left-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>,
      <div key="br" className={`absolute bottom-[10%] right-[20%] rotate-180 ${symbolSize}`}>{symbol}</div>
    ]
  }

  return patterns[rank] || []
}

// Face card content
const getFaceCardContent = (rank: string, suit: string) => {
  const symbol = SUIT_SYMBOLS[suit]
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-1">
        <div className="text-5xl font-serif">{rank}</div>
        <div className="text-4xl">{symbol}</div>
      </div>
    </div>
  )
}

export function PlayingCard({ card, size = 'md', className, showCount }: PlayingCardProps) {
  const suitSymbol = SUIT_SYMBOLS[card.suit]
  const suitColor = SUIT_COLORS[card.suit]

  const sizeClasses = {
    sm: 'w-16 h-24',
    md: 'w-24 h-36',
    lg: 'w-32 h-48',
  }

  const cornerSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
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

  const isFaceCard = ['J', 'Q', 'K'].includes(card.rank)

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
        <div className="absolute inset-3 border border-blue-500 rounded opacity-30" />
        <div className="grid grid-cols-3 gap-1 p-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-blue-400 rounded-full opacity-20" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'relative bg-white rounded-lg shadow-xl flex flex-col overflow-hidden',
        'border-2 border-gray-200',
        sizeClasses[size],
        className
      )}
    >
      {/* Top left corner */}
      <div className={clsx(
        'absolute top-1 left-1.5 flex flex-col items-center leading-none font-bold',
        suitColor,
        cornerSizeClasses[size]
      )}>
        <div>{card.rank}</div>
        <div className="text-lg">{suitSymbol}</div>
      </div>

      {/* Bottom right corner (rotated) */}
      <div className={clsx(
        'absolute bottom-1 right-1.5 flex flex-col items-center leading-none font-bold rotate-180',
        suitColor,
        cornerSizeClasses[size]
      )}>
        <div>{card.rank}</div>
        <div className="text-lg">{suitSymbol}</div>
      </div>

      {/* Card content */}
      <div className={clsx('relative flex-1', suitColor)}>
        {isFaceCard ? getFaceCardContent(card.rank, card.suit) : getSuitPattern(card.rank, card.suit, size)}
      </div>

      {/* Count value overlay */}
      {showCount && (
        <div
          className={clsx(
            'absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center',
            'text-xs font-bold bg-gray-900 border-2 border-gray-700 shadow-lg',
            getCountColor()
          )}
        >
          {getCountValue()}
        </div>
      )}
    </div>
  )
}
