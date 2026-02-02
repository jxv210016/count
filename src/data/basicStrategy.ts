import type { HandAction } from '../types'

// Basic strategy lookup tables
// Key format: "playerHand-dealerUpcard"
// Player hand can be: "hard8", "soft17", "pair8", etc.

type StrategyAction = HandAction | 'Dh' | 'Ds' | 'Rh' | 'Rs' | 'Ph'

// Hard totals strategy (8-17)
// H = Hit, S = Stand, D = Double (or Hit if not allowed), Dh = Double or Hit, Ds = Double or Stand
const HARD_STRATEGY: Record<string, Record<string, StrategyAction>> = {
  '8': { '2': 'hit', '3': 'hit', '4': 'hit', '5': 'hit', '6': 'hit', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '9': { '2': 'hit', '3': 'Dh', '4': 'Dh', '5': 'Dh', '6': 'Dh', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '10': { '2': 'Dh', '3': 'Dh', '4': 'Dh', '5': 'Dh', '6': 'Dh', '7': 'Dh', '8': 'Dh', '9': 'Dh', '10': 'hit', 'A': 'hit' },
  '11': { '2': 'Dh', '3': 'Dh', '4': 'Dh', '5': 'Dh', '6': 'Dh', '7': 'Dh', '8': 'Dh', '9': 'Dh', '10': 'Dh', 'A': 'Dh' },
  '12': { '2': 'hit', '3': 'hit', '4': 'stand', '5': 'stand', '6': 'stand', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '13': { '2': 'stand', '3': 'stand', '4': 'stand', '5': 'stand', '6': 'stand', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '14': { '2': 'stand', '3': 'stand', '4': 'stand', '5': 'stand', '6': 'stand', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '15': { '2': 'stand', '3': 'stand', '4': 'stand', '5': 'stand', '6': 'stand', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'Rh', 'A': 'Rh' },
  '16': { '2': 'stand', '3': 'stand', '4': 'stand', '5': 'stand', '6': 'stand', '7': 'hit', '8': 'hit', '9': 'Rh', '10': 'Rh', 'A': 'Rh' },
  '17': { '2': 'stand', '3': 'stand', '4': 'stand', '5': 'stand', '6': 'stand', '7': 'stand', '8': 'stand', '9': 'stand', '10': 'stand', 'A': 'stand' },
}

// Soft totals strategy (A,2 through A,9)
const SOFT_STRATEGY: Record<string, Record<string, StrategyAction>> = {
  '13': { '2': 'hit', '3': 'hit', '4': 'hit', '5': 'Dh', '6': 'Dh', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' }, // A,2
  '14': { '2': 'hit', '3': 'hit', '4': 'hit', '5': 'Dh', '6': 'Dh', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' }, // A,3
  '15': { '2': 'hit', '3': 'hit', '4': 'Dh', '5': 'Dh', '6': 'Dh', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' }, // A,4
  '16': { '2': 'hit', '3': 'hit', '4': 'Dh', '5': 'Dh', '6': 'Dh', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' }, // A,5
  '17': { '2': 'hit', '3': 'Dh', '4': 'Dh', '5': 'Dh', '6': 'Dh', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' }, // A,6
  '18': { '2': 'Ds', '3': 'Ds', '4': 'Ds', '5': 'Ds', '6': 'Ds', '7': 'stand', '8': 'stand', '9': 'hit', '10': 'hit', 'A': 'hit' }, // A,7
  '19': { '2': 'stand', '3': 'stand', '4': 'stand', '5': 'stand', '6': 'Ds', '7': 'stand', '8': 'stand', '9': 'stand', '10': 'stand', 'A': 'stand' }, // A,8
  '20': { '2': 'stand', '3': 'stand', '4': 'stand', '5': 'stand', '6': 'stand', '7': 'stand', '8': 'stand', '9': 'stand', '10': 'stand', 'A': 'stand' }, // A,9
}

// Pair splitting strategy
const PAIR_STRATEGY: Record<string, Record<string, StrategyAction>> = {
  'A': { '2': 'split', '3': 'split', '4': 'split', '5': 'split', '6': 'split', '7': 'split', '8': 'split', '9': 'split', '10': 'split', 'A': 'split' },
  '10': { '2': 'stand', '3': 'stand', '4': 'stand', '5': 'stand', '6': 'stand', '7': 'stand', '8': 'stand', '9': 'stand', '10': 'stand', 'A': 'stand' },
  '9': { '2': 'split', '3': 'split', '4': 'split', '5': 'split', '6': 'split', '7': 'stand', '8': 'split', '9': 'split', '10': 'stand', 'A': 'stand' },
  '8': { '2': 'split', '3': 'split', '4': 'split', '5': 'split', '6': 'split', '7': 'split', '8': 'split', '9': 'split', '10': 'Rh', 'A': 'Rh' },
  '7': { '2': 'split', '3': 'split', '4': 'split', '5': 'split', '6': 'split', '7': 'split', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '6': { '2': 'Ph', '3': 'split', '4': 'split', '5': 'split', '6': 'split', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '5': { '2': 'Dh', '3': 'Dh', '4': 'Dh', '5': 'Dh', '6': 'Dh', '7': 'Dh', '8': 'Dh', '9': 'Dh', '10': 'hit', 'A': 'hit' },
  '4': { '2': 'hit', '3': 'hit', '4': 'hit', '5': 'Ph', '6': 'Ph', '7': 'hit', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '3': { '2': 'Ph', '3': 'Ph', '4': 'split', '5': 'split', '6': 'split', '7': 'split', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
  '2': { '2': 'Ph', '3': 'Ph', '4': 'split', '5': 'split', '6': 'split', '7': 'split', '8': 'hit', '9': 'hit', '10': 'hit', 'A': 'hit' },
}

export interface StrategyLookup {
  action: HandAction
  isDouble: boolean
  isSurrender: boolean
  explanation: string
}

function normalizeDealer(dealerRank: string): string {
  if (['J', 'Q', 'K'].includes(dealerRank)) return '10'
  return dealerRank
}

function resolveAction(
  action: StrategyAction,
  canDouble: boolean,
  canSurrender: boolean,
  canSplit: boolean
): { resolved: HandAction; isDouble: boolean; isSurrender: boolean } {
  switch (action) {
    case 'Dh': // Double or Hit
      return { resolved: canDouble ? 'double' : 'hit', isDouble: canDouble, isSurrender: false }
    case 'Ds': // Double or Stand
      return { resolved: canDouble ? 'double' : 'stand', isDouble: canDouble, isSurrender: false }
    case 'Rh': // Surrender or Hit
      return { resolved: canSurrender ? 'surrender' : 'hit', isDouble: false, isSurrender: canSurrender }
    case 'Rs': // Surrender or Stand
      return { resolved: canSurrender ? 'surrender' : 'stand', isDouble: false, isSurrender: canSurrender }
    case 'Ph': // Split if DAS allowed, otherwise Hit
      return { resolved: canSplit ? 'split' : 'hit', isDouble: false, isSurrender: false }
    default:
      return { resolved: action as HandAction, isDouble: action === 'double', isSurrender: action === 'surrender' }
  }
}

export function getBasicStrategyAction(
  playerCards: string[],
  dealerUpcard: string,
  canDouble: boolean = true,
  canSurrender: boolean = true,
  canSplit: boolean = true
): StrategyLookup {
  const dealer = normalizeDealer(dealerUpcard)

  // Check for pair
  if (playerCards.length === 2) {
    const card1 = playerCards[0].replace(/[^A0-9JQK]/g, '')
    const card2 = playerCards[1].replace(/[^A0-9JQK]/g, '')
    const rank1 = ['J', 'Q', 'K'].includes(card1) ? '10' : card1
    const rank2 = ['J', 'Q', 'K'].includes(card2) ? '10' : card2

    if (rank1 === rank2 && PAIR_STRATEGY[rank1]) {
      const action = PAIR_STRATEGY[rank1][dealer]
      if (action) {
        const { resolved, isDouble, isSurrender } = resolveAction(action, canDouble, canSurrender, canSplit)
        return {
          action: resolved,
          isDouble,
          isSurrender,
          explanation: `Pair of ${rank1}s vs ${dealer}: ${resolved}`,
        }
      }
    }
  }

  // Calculate hand values
  const values = playerCards.map(c => {
    const rank = c.replace(/[^A0-9JQK]/g, '')
    if (rank === 'A') return [1, 11]
    if (['J', 'Q', 'K'].includes(rank)) return [10]
    return [parseInt(rank)]
  })

  // Check if soft hand (has usable Ace)
  const hasAce = values.some(v => v.includes(11))
  let total = values.reduce((sum, v) => sum + v[0], 0)
  let isSoft = false

  if (hasAce) {
    const softTotal = values.reduce((sum, v) => sum + (v.length > 1 ? 11 : v[0]), 0)
    if (softTotal <= 21) {
      total = softTotal
      isSoft = true
    }
  }

  // Lookup strategy
  let strategyTable: Record<string, Record<string, StrategyAction>>
  let handType: string

  if (isSoft && total >= 13 && total <= 20) {
    strategyTable = SOFT_STRATEGY
    handType = `Soft ${total}`
  } else if (total >= 8 && total <= 17) {
    strategyTable = HARD_STRATEGY
    handType = `Hard ${total}`
  } else if (total < 8) {
    return { action: 'hit', isDouble: false, isSurrender: false, explanation: `${total}: Always hit` }
  } else {
    return { action: 'stand', isDouble: false, isSurrender: false, explanation: `${total}: Always stand` }
  }

  const action = strategyTable[total.toString()]?.[dealer]
  if (!action) {
    return { action: total >= 17 ? 'stand' : 'hit', isDouble: false, isSurrender: false, explanation: `${handType} vs ${dealer}` }
  }

  const { resolved, isDouble, isSurrender } = resolveAction(action, canDouble, canSurrender, canSplit)
  return {
    action: resolved,
    isDouble,
    isSurrender,
    explanation: `${handType} vs ${dealer}: ${resolved}`,
  }
}

// Export strategy tables for Learn mode
export { HARD_STRATEGY, SOFT_STRATEGY, PAIR_STRATEGY }
