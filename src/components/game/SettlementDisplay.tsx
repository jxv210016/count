import { clsx } from 'clsx'
import type { Hand } from '../../types'
import { getBestHandValue, determineResult } from '../../lib/blackjack'

interface SettlementDisplayProps {
  playerHands: Hand[]
  dealerValue: number
}

const RESULT_MESSAGES: Record<string, { text: string; color: string }> = {
  win: { text: 'Win!', color: 'text-green-400' },
  lose: { text: 'Lose', color: 'text-red-400' },
  push: { text: 'Push', color: 'text-yellow-400' },
  blackjack: { text: 'Blackjack!', color: 'text-green-400' },
}

export function SettlementDisplay({ playerHands, dealerValue }: SettlementDisplayProps) {
  return (
    <div className="space-y-2">
      {playerHands.map((hand, index) => {
        const result = determineResult(hand, dealerValue)
        const { text, color } = RESULT_MESSAGES[result]
        const handValue = getBestHandValue(hand.cards)

        return (
          <div
            key={index}
            className={clsx(
              'flex items-center justify-between px-4 py-2 rounded-lg',
              'bg-gray-800/50'
            )}
          >
            <span className="text-gray-400">
              Hand {playerHands.length > 1 ? index + 1 : ''}: {handValue}
              {hand.isDoubled && ' (Doubled)'}
            </span>
            <span className={clsx('font-bold', color)}>{text}</span>
          </div>
        )
      })}
    </div>
  )
}
