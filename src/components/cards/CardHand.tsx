import { clsx } from 'clsx'
import type { Card } from '../../types'
import { PlayingCard } from './PlayingCard'

interface CardHandProps {
  cards: Card[]
  size?: 'sm' | 'md' | 'lg'
  overlap?: boolean
  showCount?: boolean
  className?: string
}

export function CardHand({ cards, size = 'md', overlap = true, showCount, className }: CardHandProps) {
  const overlapAmount = {
    sm: '-ml-8',
    md: '-ml-10',
    lg: '-ml-14',
  }

  return (
    <div className={clsx('flex items-center', className)}>
      {cards.map((card, index) => (
        <div
          key={`${card.rank}-${card.suit}-${index}`}
          className={clsx(
            'transition-transform duration-200',
            index > 0 && overlap && overlapAmount[size]
          )}
          style={{ zIndex: index }}
        >
          <PlayingCard card={card} size={size} showCount={showCount} />
        </div>
      ))}
    </div>
  )
}
