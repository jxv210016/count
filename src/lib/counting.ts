import type { Card, Rank } from '../types'
import { HI_LO_VALUES } from '../data/hiLoValues'

// Get Hi-Lo value for a single card
export function getCardCount(card: Card): number {
  return HI_LO_VALUES[card.rank]
}

// Calculate running count from an array of cards
export function calculateRunningCount(cards: Card[]): number {
  return cards.reduce((count, card) => count + getCardCount(card), 0)
}

// Calculate true count (running count / decks remaining)
export function calculateTrueCount(runningCount: number, cardsRemaining: number): number {
  const decksRemaining = cardsRemaining / 52
  if (decksRemaining < 0.5) return runningCount * 2 // Approximate for very few cards
  return Math.round((runningCount / decksRemaining) * 10) / 10 // Round to 1 decimal
}

// Get count category description
export function getCountDescription(trueCount: number): string {
  if (trueCount >= 5) return 'Very High'
  if (trueCount >= 3) return 'High'
  if (trueCount >= 1) return 'Slightly Positive'
  if (trueCount > -1) return 'Neutral'
  if (trueCount > -3) return 'Slightly Negative'
  if (trueCount > -5) return 'Low'
  return 'Very Low'
}

// Get betting advice based on true count
export function getBettingAdvice(trueCount: number): string {
  if (trueCount >= 5) return 'Max bet - strong player advantage'
  if (trueCount >= 3) return 'Increase bet significantly'
  if (trueCount >= 2) return 'Increase bet moderately'
  if (trueCount >= 1) return 'Slight bet increase'
  if (trueCount > -1) return 'Minimum bet'
  return 'Consider minimum bet or leaving table'
}

// Get color for count display
export function getCountColor(trueCount: number): string {
  if (trueCount >= 2) return 'text-green-400'
  if (trueCount >= 1) return 'text-green-300'
  if (trueCount > -1) return 'text-gray-300'
  if (trueCount > -2) return 'text-red-300'
  return 'text-red-400'
}

// Get Hi-Lo value display with color
export function getCardCountDisplay(rank: Rank): { value: string; color: string } {
  const count = HI_LO_VALUES[rank]
  let color: string
  let value: string

  if (count > 0) {
    value = `+${count}`
    color = 'text-green-400'
  } else if (count < 0) {
    value = count.toString()
    color = 'text-red-400'
  } else {
    value = '0'
    color = 'text-gray-400'
  }

  return { value, color }
}

// Format count with sign
export function formatCount(count: number): string {
  if (count > 0) return `+${count}`
  return count.toString()
}

// Check if user's count guess is correct (with tolerance)
export function isCountCorrect(userCount: number, actualCount: number, tolerance: number = 0): boolean {
  return Math.abs(userCount - actualCount) <= tolerance
}
