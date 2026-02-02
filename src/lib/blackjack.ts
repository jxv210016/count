import type { Card, Hand, Rank, Suit, HandAction } from '../types'
import { CARD_VALUES } from '../data/hiLoValues'

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// Create a single deck
export function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit, faceUp: true })
    }
  }
  return deck
}

// Create a shoe with multiple decks
export function createShoe(deckCount: number): Card[] {
  const shoe: Card[] = []
  for (let i = 0; i < deckCount; i++) {
    shoe.push(...createDeck())
  }
  return shuffleArray(shoe)
}

// Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Calculate hand value(s)
export function calculateHandValue(cards: Card[]): number[] {
  let sum = 0
  let aces = 0

  for (const card of cards) {
    if (card.rank === 'A') {
      aces++
      sum += 1
    } else {
      sum += CARD_VALUES[card.rank][0]
    }
  }

  // Calculate all possible values with aces
  const values = [sum]
  for (let i = 0; i < aces; i++) {
    const withHighAce = sum + 10 * (i + 1)
    if (withHighAce <= 21 && !values.includes(withHighAce)) {
      values.push(withHighAce)
    }
  }

  return values.sort((a, b) => a - b)
}

// Get best hand value (highest without busting)
export function getBestHandValue(cards: Card[]): number {
  const values = calculateHandValue(cards)
  const validValues = values.filter(v => v <= 21)
  return validValues.length > 0 ? Math.max(...validValues) : Math.min(...values)
}

// Check if hand is soft (has usable ace)
export function isSoftHand(cards: Card[]): boolean {
  const values = calculateHandValue(cards)
  return values.length > 1 && values.some(v => v <= 21)
}

// Check if hand is blackjack
export function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && getBestHandValue(cards) === 21
}

// Check if hand is busted
export function isBusted(cards: Card[]): boolean {
  return getBestHandValue(cards) > 21
}

// Check if hand can be split
export function canSplit(hand: Hand): boolean {
  if (hand.cards.length !== 2) return false
  if (hand.isSplit) return false // Already split once

  const rank1 = hand.cards[0].rank
  const rank2 = hand.cards[1].rank

  // 10-value cards can be split together
  const isTenValue = (r: Rank) => ['10', 'J', 'Q', 'K'].includes(r)
  if (isTenValue(rank1) && isTenValue(rank2)) return true

  return rank1 === rank2
}

// Check if hand can double
export function canDouble(hand: Hand): boolean {
  return hand.cards.length === 2 && !hand.isDoubled
}

// Check if hand can surrender
export function canSurrender(hand: Hand): boolean {
  return hand.cards.length === 2 && !hand.isDoubled && !hand.isSplit
}

// Get valid actions for a hand
export function getValidActions(hand: Hand, isFirstAction: boolean = false): HandAction[] {
  if (hand.isStanding || hand.isBusted) return []

  const actions: HandAction[] = ['hit', 'stand']

  if (canDouble(hand)) {
    actions.push('double')
  }

  if (canSplit(hand)) {
    actions.push('split')
  }

  if (isFirstAction && canSurrender(hand)) {
    actions.push('surrender')
  }

  return actions
}

// Create a new empty hand
export function createHand(bet: number = 0, isSplit: boolean = false): Hand {
  return {
    cards: [],
    bet,
    isDoubled: false,
    isSplit,
    isStanding: false,
    isBusted: false,
    isBlackjack: false,
  }
}

// Deal a card to a hand
export function dealCard(hand: Hand, card: Card): Hand {
  const newCards = [...hand.cards, card]
  const busted = isBusted(newCards)
  const blackjack = !hand.isSplit && isBlackjack(newCards)

  return {
    ...hand,
    cards: newCards,
    isBusted: busted,
    isBlackjack: blackjack,
    isStanding: busted || blackjack,
  }
}

// Convert card to string format
export function cardToString(card: Card): string {
  return `${card.rank}${card.suit[0].toUpperCase()}`
}

// Get display string for hand value
export function getHandValueDisplay(cards: Card[]): string {
  const values = calculateHandValue(cards)
  if (values.length === 0) return '0'

  const best = getBestHandValue(cards)
  if (best > 21) return `${best} (Bust)`

  if (values.length > 1 && values[values.length - 1] <= 21) {
    return `${values[0]}/${values[values.length - 1]}`
  }

  return best.toString()
}

// Determine winner
export type HandResult = 'win' | 'lose' | 'push' | 'blackjack'

export function determineResult(playerHand: Hand, dealerValue: number): HandResult {
  const playerValue = getBestHandValue(playerHand.cards)

  if (playerHand.isBusted) return 'lose'
  if (playerHand.isBlackjack && dealerValue !== 21) return 'blackjack'
  if (dealerValue > 21) return 'win'
  if (playerValue > dealerValue) return 'win'
  if (playerValue < dealerValue) return 'lose'
  return 'push'
}
