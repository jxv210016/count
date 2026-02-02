import { useEffect, useState, useCallback } from 'react'
import { clsx } from 'clsx'
import { useGameStore } from '../../hooks/useGameStore'
import { CardHand } from '../cards/CardHand'
import { ActionButtons } from './ActionButtons'
import { CountDisplay } from './CountDisplay'
import { FeedbackOverlay } from './FeedbackOverlay'
import { CountCheckModal } from './CountCheckModal'
import { SettlementDisplay } from './SettlementDisplay'
import { Button } from '../ui/Button'
import { getValidActions, getHandValueDisplay, getBestHandValue } from '../../lib/blackjack'
import type { HandAction } from '../../types'

export function BlackjackTable() {
  const {
    playerHands,
    dealerHand,
    activeHandIndex,
    phase,
    runningCount,
    showCount,
    deckCount,
    lastDecisionFeedback,
    sessionStats,
    dealNewHand,
    playerAction,
    submitCountGuess,
    toggleCountDisplay,
    initializeGame,
    getTrueCount,
    getCardsRemaining,
  } = useGameStore()

  const [showCountResult, setShowCountResult] = useState(false)
  const [countWasCorrect, setCountWasCorrect] = useState(false)

  // Initialize game on mount
  useEffect(() => {
    initializeGame(deckCount)
  }, [])

  // Keyboard shortcuts
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== 'playerTurn') return

      const currentHand = playerHands[activeHandIndex]
      if (!currentHand) return

      const validActions = getValidActions(currentHand, currentHand.cards.length === 2)
      const keyMap: Record<string, HandAction> = {
        h: 'hit',
        s: 'stand',
        d: 'double',
        p: 'split',
        r: 'surrender',
      }

      const action = keyMap[e.key.toLowerCase()]
      if (action && validActions.includes(action)) {
        playerAction(action)
      }
    },
    [phase, playerHands, activeHandIndex, playerAction]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const handleCountSubmit = (guess: number) => {
    const correct = submitCountGuess(guess)
    setCountWasCorrect(correct)
    setShowCountResult(true)

    // Auto-advance after showing result
    setTimeout(() => {
      setShowCountResult(false)
    }, 2000)
  }

  const handleNextHand = () => {
    dealNewHand()
  }

  const currentHand = playerHands[activeHandIndex]
  const validActions = currentHand
    ? getValidActions(currentHand, currentHand.cards.length === 2)
    : []
  const dealerValue = getBestHandValue(dealerHand.cards)

  // Calculate accuracy percentages
  const countAccuracy =
    sessionStats.countChecks > 0
      ? Math.round((sessionStats.countCorrect / sessionStats.countChecks) * 100)
      : 0
  const decisionAccuracy =
    sessionStats.decisionsTotal > 0
      ? Math.round((sessionStats.decisionsCorrect / sessionStats.decisionsTotal) * 100)
      : 0

  return (
    <div className="min-h-screen felt-bg p-4 flex flex-col">
      {/* Feedback overlay */}
      <FeedbackOverlay feedback={lastDecisionFeedback} />

      {/* Count check modal */}
      <CountCheckModal
        isOpen={phase === 'countCheck'}
        onSubmit={handleCountSubmit}
        actualCount={runningCount}
        showResult={showCountResult}
        wasCorrect={countWasCorrect}
      />

      {/* Stats bar */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-300">
        <div className="flex gap-4">
          <span>Hands: {sessionStats.handsPlayed}</span>
          <span>
            Decisions: {decisionAccuracy}%
            <span className="text-gray-500 ml-1">
              ({sessionStats.decisionsCorrect}/{sessionStats.decisionsTotal})
            </span>
          </span>
          <span>
            Count: {countAccuracy}%
            <span className="text-gray-500 ml-1">
              ({sessionStats.countCorrect}/{sessionStats.countChecks})
            </span>
          </span>
        </div>
      </div>

      {/* Main table area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Dealer area */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Dealer</div>
          <CardHand cards={dealerHand.cards} size="lg" />
          {dealerHand.cards.length > 0 && (
            <div className="mt-2 text-white font-semibold">
              {dealerHand.cards[1]?.faceUp
                ? getHandValueDisplay(dealerHand.cards)
                : dealerHand.cards[0]?.rank || ''}
            </div>
          )}
        </div>

        {/* Settlement display */}
        {phase === 'settlement' && (
          <SettlementDisplay playerHands={playerHands} dealerValue={dealerValue} />
        )}

        {/* Player hands */}
        <div className="flex flex-wrap gap-4 justify-center">
          {playerHands.map((hand, index) => (
            <div
              key={index}
              className={clsx(
                'text-center p-4 rounded-lg',
                index === activeHandIndex && phase === 'playerTurn' && 'ring-2 ring-yellow-400'
              )}
            >
              {playerHands.length > 1 && (
                <div className="text-gray-400 text-xs mb-1">Hand {index + 1}</div>
              )}
              <CardHand cards={hand.cards} size="lg" />
              <div className="mt-2 text-white font-semibold">
                {getHandValueDisplay(hand.cards)}
                {hand.isBlackjack && ' - Blackjack!'}
                {hand.isBusted && ' - Bust!'}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {phase === 'playerTurn' && (
          <ActionButtons
            validActions={validActions}
            onAction={playerAction}
            disabled={!currentHand}
          />
        )}

        {/* Start/Next hand buttons */}
        {(phase === 'betting' || phase === 'settlement') && (
          <Button onClick={handleNextHand} size="lg">
            {phase === 'betting' ? 'Deal' : 'Next Hand'}
          </Button>
        )}
      </div>

      {/* Count display - fixed position */}
      <div className="fixed top-20 right-4 w-48">
        <CountDisplay
          runningCount={runningCount}
          trueCount={getTrueCount()}
          cardsRemaining={getCardsRemaining()}
          deckCount={deckCount}
          showCount={showCount}
          onToggle={toggleCountDisplay}
        />
      </div>
    </div>
  )
}
