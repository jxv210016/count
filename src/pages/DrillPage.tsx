import { useState, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { Button } from '../components/ui/Button'
import { PlayingCard } from '../components/cards/PlayingCard'
import { CardHand } from '../components/cards/CardHand'
import type { Card, Rank, Suit, HandAction } from '../types'
import { getCardCount, formatCount } from '../lib/counting'
import { getBasicStrategyAction } from '../data/basicStrategy'
import { cardToString } from '../lib/blackjack'

type DrillType = 'counting' | 'decision' | 'speed'

const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']

function randomCard(): Card {
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)]
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)]
  return { rank, suit, faceUp: true }
}

export function DrillPage() {
  const [drillType, setDrillType] = useState<DrillType>('counting')

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Practice Drills</h1>

      {/* Drill type selector */}
      <div className="flex gap-2 mb-8">
        {[
          { id: 'counting', label: 'Card Counting' },
          { id: 'decision', label: 'Basic Strategy' },
          { id: 'speed', label: 'Speed Drill' },
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setDrillType(type.id as DrillType)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              drillType === type.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Drill content */}
      {drillType === 'counting' && <CountingDrill />}
      {drillType === 'decision' && <DecisionDrill />}
      {drillType === 'speed' && <SpeedDrill />}
    </div>
  )
}

function CountingDrill() {
  const [cards, setCards] = useState<Card[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userCount, setUserCount] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [cardCount, setCardCount] = useState(10)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1000) // ms per card

  const actualCount = cards.slice(0, currentIndex).reduce(
    (sum, card) => sum + getCardCount(card),
    0
  )

  const startDrill = () => {
    const newCards = Array.from({ length: cardCount }, () => randomCard())
    setCards(newCards)
    setCurrentIndex(0)
    setShowResult(false)
    setUserCount('')
    setIsRunning(true)
  }

  useEffect(() => {
    if (!isRunning || currentIndex >= cards.length) return

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [isRunning, currentIndex, cards.length, speed])

  useEffect(() => {
    if (isRunning && currentIndex >= cards.length) {
      setIsRunning(false)
    }
  }, [currentIndex, cards.length, isRunning])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const guess = parseInt(userCount) || 0
    setIsCorrect(guess === actualCount)
    setShowResult(true)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Card Counting Drill</h2>
      <p className="text-gray-400 mb-6">
        Watch the cards flash and keep track of the running count.
      </p>

      {/* Settings */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Cards</label>
          <select
            value={cardCount}
            onChange={e => setCardCount(Number(e.target.value))}
            className="bg-gray-700 text-white rounded px-3 py-2"
            disabled={isRunning}
          >
            {[5, 10, 15, 20, 25].map(n => (
              <option key={n} value={n}>{n} cards</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Speed</label>
          <select
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="bg-gray-700 text-white rounded px-3 py-2"
            disabled={isRunning}
          >
            <option value={2000}>Slow (2s)</option>
            <option value={1000}>Normal (1s)</option>
            <option value={500}>Fast (0.5s)</option>
            <option value={250}>Very Fast (0.25s)</option>
          </select>
        </div>
      </div>

      {/* Card display */}
      <div className="h-40 flex items-center justify-center mb-6">
        {isRunning && currentIndex < cards.length ? (
          <div className="transform scale-150">
            <PlayingCard card={cards[currentIndex]} size="lg" />
          </div>
        ) : cards.length > 0 && !isRunning && !showResult ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Cards shown: {currentIndex}</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="number"
                value={userCount}
                onChange={e => setUserCount(e.target.value)}
                placeholder="Enter count"
                className="bg-gray-700 text-white rounded px-4 py-2 w-32 text-center"
                autoFocus
              />
              <Button type="submit">Submit</Button>
            </form>
          </div>
        ) : showResult ? (
          <div className="text-center">
            <div className={`text-4xl mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            <p className="text-gray-400">
              Your answer: {userCount || 0} | Actual: {formatCount(actualCount)}
            </p>
            <Button onClick={startDrill} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <Button onClick={startDrill} size="lg">
            Start Drill
          </Button>
        )}
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-200"
            style={{ width: `${(currentIndex / cards.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

function DecisionDrill() {
  const [playerCards, setPlayerCards] = useState<Card[]>([])
  const [dealerCard, setDealerCard] = useState<Card | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [lastAction, setLastAction] = useState<HandAction | null>(null)
  const [correctAction, setCorrectAction] = useState<HandAction | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const generateHand = useCallback(() => {
    // Generate player hand (2 cards)
    const card1 = randomCard()
    const card2 = randomCard()
    const dealer = randomCard()

    setPlayerCards([card1, card2])
    setDealerCard(dealer)
    setShowResult(false)
    setLastAction(null)
    setCorrectAction(null)
  }, [])

  useEffect(() => {
    generateHand()
  }, [generateHand])

  const handleAction = (action: HandAction) => {
    if (!dealerCard || showResult) return

    const cardStrings = playerCards.map(cardToString)
    const strategy = getBasicStrategyAction(
      cardStrings,
      dealerCard.rank,
      true,
      true,
      playerCards[0].rank === playerCards[1].rank
    )

    const isCorrect = action === strategy.action
    setLastAction(action)
    setCorrectAction(strategy.action)
    setShowResult(true)
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  const actions: HandAction[] = ['hit', 'stand', 'double', 'split', 'surrender']

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Basic Strategy Drill</h2>
      <p className="text-gray-400 mb-6">
        Choose the correct action for each hand.
      </p>

      {/* Score */}
      <div className="text-center mb-6">
        <span className="text-gray-400">Score: </span>
        <span className="text-white font-bold">
          {score.correct}/{score.total}
          {score.total > 0 && (
            <span className="text-gray-400 ml-2">
              ({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
        </span>
      </div>

      {/* Cards */}
      <div className="flex justify-center gap-12 mb-8">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Dealer</div>
          {dealerCard && <PlayingCard card={dealerCard} size="lg" />}
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Your Hand</div>
          <CardHand cards={playerCards} size="lg" />
        </div>
      </div>

      {/* Actions */}
      {!showResult ? (
        <div className="flex flex-wrap justify-center gap-2">
          {actions.map(action => (
            <Button
              key={action}
              onClick={() => handleAction(action)}
              variant="secondary"
              className="capitalize min-w-[100px]"
            >
              {action}
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <div
            className={`text-2xl font-bold mb-2 ${
              lastAction === correctAction ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {lastAction === correctAction ? 'Correct!' : 'Incorrect'}
          </div>
          {lastAction !== correctAction && (
            <p className="text-gray-400 mb-4">
              You chose <span className="text-white capitalize">{lastAction}</span>,
              correct is <span className="text-green-400 capitalize">{correctAction}</span>
            </p>
          )}
          <Button onClick={generateHand}>Next Hand</Button>
        </div>
      )}
    </div>
  )
}

function SpeedDrill() {
  const [cards, setCards] = useState<Card[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [userCount, setUserCount] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [cardCount, setCardCount] = useState(52)

  const actualCount = cards.reduce((sum, card) => sum + getCardCount(card), 0)

  const startDrill = () => {
    const newCards = Array.from({ length: cardCount }, () => randomCard())
    setCards(newCards)
    setIsRunning(true)
    setStartTime(Date.now())
    setShowResult(false)
    setUserCount('')
  }

  const finishDrill = () => {
    setEndTime(Date.now())
    setIsRunning(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const guess = parseInt(userCount) || 0
    setIsCorrect(guess === actualCount)
    setShowResult(true)
  }

  const elapsedTime = endTime > 0 ? ((endTime - startTime) / 1000).toFixed(1) : 0
  const cardsPerSecond = endTime > 0 ? (cardCount / ((endTime - startTime) / 1000)).toFixed(1) : 0

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Speed Counting Drill</h2>
      <p className="text-gray-400 mb-6">
        Count through the cards as fast as you can. Click each card to advance.
      </p>

      {/* Settings */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Cards</label>
        <select
          value={cardCount}
          onChange={e => setCardCount(Number(e.target.value))}
          className="bg-gray-700 text-white rounded px-3 py-2"
          disabled={isRunning}
        >
          <option value={26}>Half Deck (26)</option>
          <option value={52}>Full Deck (52)</option>
          <option value={104}>Two Decks (104)</option>
        </select>
      </div>

      {/* Card display */}
      <div className="min-h-[200px] flex items-center justify-center mb-6">
        {isRunning && cards.length > 0 ? (
          <div className="text-center">
            <div className="mb-4">
              <span className="text-gray-400">Cards remaining: </span>
              <span className="text-white font-bold">{cards.length}</span>
            </div>
            <button
              onClick={() => setCards(cards.slice(1))}
              className="transform transition-transform hover:scale-105 active:scale-95"
            >
              <PlayingCard card={cards[0]} size="lg" />
            </button>
            <p className="text-sm text-gray-500 mt-2">Click card to advance</p>
            {cards.length === 1 && (
              <Button onClick={finishDrill} className="mt-4">
                Finish
              </Button>
            )}
          </div>
        ) : !isRunning && cards.length === 0 && !showResult ? (
          <Button onClick={startDrill} size="lg">
            Start Speed Drill
          </Button>
        ) : !isRunning && endTime > 0 && !showResult ? (
          <div className="text-center">
            <p className="text-gray-400 mb-2">Time: {elapsedTime}s ({cardsPerSecond} cards/sec)</p>
            <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
              <input
                type="number"
                value={userCount}
                onChange={e => setUserCount(e.target.value)}
                placeholder="Final count"
                className="bg-gray-700 text-white rounded px-4 py-2 w-32 text-center"
                autoFocus
              />
              <Button type="submit">Submit</Button>
            </form>
          </div>
        ) : showResult ? (
          <div className="text-center">
            <div className={`text-4xl mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            <p className="text-gray-400 mb-2">
              Your answer: {userCount || 0} | Actual: {formatCount(actualCount)}
            </p>
            <p className="text-gray-400 mb-4">
              Time: {elapsedTime}s | Speed: {cardsPerSecond} cards/sec
            </p>
            <Button onClick={startDrill}>Try Again</Button>
          </div>
        ) : null}
      </div>

      {/* Tips */}
      <div className="bg-gray-700/50 rounded-lg p-4 text-sm text-gray-400">
        <h3 className="font-medium text-gray-300 mb-2">Tips for Speed:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Practice canceling pairs (e.g., a 5 and a King cancel out)</li>
          <li>Count in groups when possible</li>
          <li>Focus on accuracy first, speed will come with practice</li>
        </ul>
      </div>
    </div>
  )
}
