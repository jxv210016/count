export * from './database'

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  rank: Rank
  suit: Suit
  faceUp: boolean
}

export type HandAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender'

export interface Hand {
  cards: Card[]
  bet: number
  isDoubled: boolean
  isSplit: boolean
  isStanding: boolean
  isBusted: boolean
  isBlackjack: boolean
}

export interface GameState {
  shoe: Card[]
  playerHands: Hand[]
  dealerHand: Hand
  activeHandIndex: number
  runningCount: number
  cardsDealt: number
  deckCount: number
  phase: GamePhase
  lastDecisionFeedback: DecisionFeedback | null
  showCount: boolean
  dealerHitsSoft17: boolean
}

export type GamePhase =
  | 'betting'
  | 'dealing'
  | 'playerTurn'
  | 'dealerTurn'
  | 'settlement'
  | 'countCheck'

export interface DecisionFeedback {
  playerAction: HandAction
  correctAction: HandAction
  isCorrect: boolean
  explanation?: string
}

export interface SessionStats {
  handsPlayed: number
  countCorrect: number
  countChecks: number
  decisionsCorrect: number
  decisionsTotal: number
}

export interface UserStats {
  totalSessions: number
  totalHands: number
  countAccuracy: number
  decisionAccuracy: number
  currentStreak: number
  bestStreak: number
  recentSessions: Session[]
}
