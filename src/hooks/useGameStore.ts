import { create } from 'zustand'
import type { Card, Hand, GameState, GamePhase, DecisionFeedback, HandAction, SessionStats } from '../types'
import {
  createShoe,
  createHand,
  dealCard,
  getBestHandValue,
  getValidActions,
  isBlackjack,
  isBusted,
  cardToString,
} from '../lib/blackjack'
import { calculateRunningCount, calculateTrueCount } from '../lib/counting'
import { getBasicStrategyAction } from '../data/basicStrategy'

interface GameStore extends GameState {
  // Session tracking
  sessionStats: SessionStats

  // Actions
  initializeGame: (deckCount: number, dealerHitsSoft17?: boolean) => void
  dealNewHand: () => void
  playerAction: (action: HandAction) => DecisionFeedback | null
  playDealerHand: () => void
  submitCountGuess: (guess: number) => boolean
  toggleCountDisplay: () => void
  resetSession: () => void

  // Getters
  getCurrentHand: () => Hand | null
  getTrueCount: () => number
  getCardsRemaining: () => number
}

const initialStats: SessionStats = {
  handsPlayed: 0,
  countCorrect: 0,
  countChecks: 0,
  decisionsCorrect: 0,
  decisionsTotal: 0,
}

const initialState: Omit<GameState, 'shoe'> & { shoe: Card[] } = {
  shoe: [],
  playerHands: [],
  dealerHand: createHand(),
  activeHandIndex: 0,
  runningCount: 0,
  cardsDealt: 0,
  deckCount: 6,
  phase: 'betting',
  lastDecisionFeedback: null,
  showCount: true,
  dealerHitsSoft17: true,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  sessionStats: { ...initialStats },

  initializeGame: (deckCount: number, dealerHitsSoft17 = true) => {
    const shoe = createShoe(deckCount)
    set({
      shoe,
      playerHands: [],
      dealerHand: createHand(),
      activeHandIndex: 0,
      runningCount: 0,
      cardsDealt: 0,
      deckCount,
      phase: 'betting',
      lastDecisionFeedback: null,
      dealerHitsSoft17,
      sessionStats: { ...initialStats },
    })
  },

  dealNewHand: () => {
    const state = get()
    let { shoe, runningCount, cardsDealt } = state

    // Check if we need to reshuffle (penetration ~75%)
    const cardsRemaining = shoe.length
    const totalCards = state.deckCount * 52
    if (cardsRemaining < totalCards * 0.25) {
      shoe = createShoe(state.deckCount)
      runningCount = 0
      cardsDealt = 0
    }

    // Deal cards
    const playerHand = createHand()
    const dealerHand = createHand()

    // Deal alternating: player, dealer, player, dealer
    const card1 = shoe.pop()!
    const card2 = { ...shoe.pop()!, faceUp: true }
    const card3 = shoe.pop()!
    const card4 = { ...shoe.pop()!, faceUp: false } // Dealer hole card

    const playerCards = [card1, card3]
    const dealerCards = [card2, card4]

    // Update count for visible cards
    runningCount += calculateRunningCount([card1, card2, card3])
    cardsDealt += 4

    const newPlayerHand = {
      ...playerHand,
      cards: playerCards,
      isBlackjack: isBlackjack(playerCards),
    }

    const newDealerHand = {
      ...dealerHand,
      cards: dealerCards,
    }

    // Check for blackjacks
    const playerBJ = isBlackjack(playerCards)
    const dealerShowsTen = ['10', 'J', 'Q', 'K'].includes(dealerCards[0].rank)
    const dealerShowsAce = dealerCards[0].rank === 'A'

    let phase: GamePhase = 'playerTurn'
    if (playerBJ) {
      // Reveal dealer hole card and check for push
      newDealerHand.cards[1].faceUp = true
      runningCount += calculateRunningCount([dealerCards[1]])
      if (isBlackjack(dealerCards)) {
        phase = 'settlement'
      } else {
        phase = 'settlement'
      }
    }

    set({
      shoe,
      playerHands: [newPlayerHand],
      dealerHand: newDealerHand,
      activeHandIndex: 0,
      runningCount,
      cardsDealt,
      phase,
      lastDecisionFeedback: null,
      sessionStats: {
        ...state.sessionStats,
        handsPlayed: state.sessionStats.handsPlayed + 1,
      },
    })
  },

  playerAction: (action: HandAction) => {
    const state = get()
    const { shoe, playerHands, activeHandIndex, runningCount, cardsDealt, dealerHand } = state

    if (state.phase !== 'playerTurn') return null

    const currentHand = playerHands[activeHandIndex]
    if (!currentHand) return null

    // Get correct action for feedback
    const playerCards = currentHand.cards.map(cardToString)
    const dealerUpcard = dealerHand.cards[0].rank
    const validActions = getValidActions(currentHand, currentHand.cards.length === 2)
    const canDoubleNow = validActions.includes('double')
    const canSurrenderNow = validActions.includes('surrender')
    const canSplitNow = validActions.includes('split')

    const strategy = getBasicStrategyAction(
      playerCards,
      dealerUpcard,
      canDoubleNow,
      canSurrenderNow,
      canSplitNow
    )

    const isCorrect = action === strategy.action
    const feedback: DecisionFeedback = {
      playerAction: action,
      correctAction: strategy.action,
      isCorrect,
      explanation: strategy.explanation,
    }

    // Update stats
    const newStats = {
      ...state.sessionStats,
      decisionsCorrect: state.sessionStats.decisionsCorrect + (isCorrect ? 1 : 0),
      decisionsTotal: state.sessionStats.decisionsTotal + 1,
    }

    let newShoe = [...shoe]
    let newRunningCount = runningCount
    let newCardsDealt = cardsDealt
    let newPlayerHands = [...playerHands]
    let newActiveIndex = activeHandIndex
    let newPhase: GamePhase = 'playerTurn'

    switch (action) {
      case 'hit': {
        const card = newShoe.pop()!
        newRunningCount += calculateRunningCount([card])
        newCardsDealt++
        const updatedHand = dealCard(currentHand, card)
        newPlayerHands[activeHandIndex] = updatedHand

        if (updatedHand.isBusted || updatedHand.isStanding) {
          // Move to next hand or dealer turn
          if (activeHandIndex < newPlayerHands.length - 1) {
            newActiveIndex++
          } else {
            newPhase = 'dealerTurn'
          }
        }
        break
      }

      case 'stand': {
        newPlayerHands[activeHandIndex] = { ...currentHand, isStanding: true }
        if (activeHandIndex < newPlayerHands.length - 1) {
          newActiveIndex++
        } else {
          newPhase = 'dealerTurn'
        }
        break
      }

      case 'double': {
        const card = newShoe.pop()!
        newRunningCount += calculateRunningCount([card])
        newCardsDealt++
        const updatedHand = {
          ...dealCard(currentHand, card),
          isDoubled: true,
          isStanding: true,
        }
        newPlayerHands[activeHandIndex] = updatedHand

        if (activeHandIndex < newPlayerHands.length - 1) {
          newActiveIndex++
        } else {
          newPhase = 'dealerTurn'
        }
        break
      }

      case 'split': {
        const card1 = newShoe.pop()!
        const card2 = newShoe.pop()!
        newRunningCount += calculateRunningCount([card1, card2])
        newCardsDealt += 2

        const hand1: Hand = {
          ...createHand(0, true),
          cards: [currentHand.cards[0], card1],
        }
        const hand2: Hand = {
          ...createHand(0, true),
          cards: [currentHand.cards[1], card2],
        }

        // Check for blackjack on split aces
        if (currentHand.cards[0].rank === 'A') {
          hand1.isStanding = true
          hand2.isStanding = true
          newPlayerHands = [hand1, hand2]
          newPhase = 'dealerTurn'
        } else {
          newPlayerHands = [
            ...newPlayerHands.slice(0, activeHandIndex),
            hand1,
            hand2,
            ...newPlayerHands.slice(activeHandIndex + 1),
          ]
        }
        break
      }

      case 'surrender': {
        newPlayerHands[activeHandIndex] = { ...currentHand, isStanding: true }
        newPhase = 'settlement'
        break
      }
    }

    // Check if all hands are done
    const allHandsDone = newPlayerHands.every(h => h.isStanding || h.isBusted)
    if (allHandsDone && newPhase === 'playerTurn') {
      newPhase = 'dealerTurn'
    }

    set({
      shoe: newShoe,
      playerHands: newPlayerHands,
      activeHandIndex: newActiveIndex,
      runningCount: newRunningCount,
      cardsDealt: newCardsDealt,
      phase: newPhase,
      lastDecisionFeedback: feedback,
      sessionStats: newStats,
    })

    // Auto-play dealer if needed
    if (newPhase === 'dealerTurn') {
      setTimeout(() => get().playDealerHand(), 500)
    }

    return feedback
  },

  playDealerHand: () => {
    const state = get()
    let { shoe, dealerHand, runningCount, cardsDealt, playerHands } = state

    // Check if all player hands busted
    const allBusted = playerHands.every(h => h.isBusted)
    if (allBusted) {
      set({ phase: 'countCheck' })
      return
    }

    // Reveal hole card
    const newDealerCards = [...dealerHand.cards]
    if (!newDealerCards[1].faceUp) {
      newDealerCards[1] = { ...newDealerCards[1], faceUp: true }
      runningCount += calculateRunningCount([newDealerCards[1]])
    }

    // Dealer draws
    let dealerValue = getBestHandValue(newDealerCards)
    const isSoft = (cards: Card[]) => {
      const hasAce = cards.some(c => c.rank === 'A')
      const total = cards.reduce((sum, c) => {
        if (c.rank === 'A') return sum + 1
        if (['10', 'J', 'Q', 'K'].includes(c.rank)) return sum + 10
        return sum + parseInt(c.rank)
      }, 0)
      return hasAce && total + 10 <= 21
    }

    while (
      dealerValue < 17 ||
      (state.dealerHitsSoft17 && dealerValue === 17 && isSoft(newDealerCards))
    ) {
      const card = shoe.pop()!
      newDealerCards.push(card)
      runningCount += calculateRunningCount([card])
      cardsDealt++
      dealerValue = getBestHandValue(newDealerCards)
    }

    set({
      shoe,
      dealerHand: {
        ...dealerHand,
        cards: newDealerCards,
        isBusted: dealerValue > 21,
      },
      runningCount,
      cardsDealt,
      phase: 'countCheck',
    })
  },

  submitCountGuess: (guess: number) => {
    const state = get()
    const isCorrect = guess === state.runningCount

    set({
      phase: 'settlement',
      sessionStats: {
        ...state.sessionStats,
        countCorrect: state.sessionStats.countCorrect + (isCorrect ? 1 : 0),
        countChecks: state.sessionStats.countChecks + 1,
      },
    })

    return isCorrect
  },

  toggleCountDisplay: () => {
    set(state => ({ showCount: !state.showCount }))
  },

  resetSession: () => {
    const state = get()
    set({
      ...initialState,
      shoe: createShoe(state.deckCount),
      deckCount: state.deckCount,
      dealerHitsSoft17: state.dealerHitsSoft17,
      sessionStats: { ...initialStats },
    })
  },

  getCurrentHand: () => {
    const state = get()
    return state.playerHands[state.activeHandIndex] || null
  },

  getTrueCount: () => {
    const state = get()
    const cardsRemaining = state.shoe.length
    return calculateTrueCount(state.runningCount, cardsRemaining)
  },

  getCardsRemaining: () => {
    return get().shoe.length
  },
}))
