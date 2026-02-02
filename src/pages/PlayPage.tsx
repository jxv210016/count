import { useState } from 'react'
import { BlackjackTable } from '../components/game/BlackjackTable'
import { useGameStore } from '../hooks/useGameStore'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

export function PlayPage() {
  const [showSettings, setShowSettings] = useState(false)
  const { deckCount, dealerHitsSoft17, initializeGame } = useGameStore()
  const [tempDeckCount, setTempDeckCount] = useState(deckCount)
  const [tempDealerHits, setTempDealerHits] = useState(dealerHitsSoft17)

  const handleSaveSettings = () => {
    initializeGame(tempDeckCount, tempDealerHits)
    setShowSettings(false)
  }

  return (
    <div className="relative">
      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 left-4 z-30 p-2 bg-gray-800/90 rounded-lg hover:bg-gray-700 transition-colors"
        title="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Main game table */}
      <BlackjackTable />

      {/* Settings modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Game Settings"
      >
        <div className="space-y-6">
          {/* Deck count */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Decks
            </label>
            <div className="flex gap-2">
              {[1, 2, 4, 6, 8].map(count => (
                <button
                  key={count}
                  onClick={() => setTempDeckCount(count)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tempDeckCount === count
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Dealer rule */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dealer Hits Soft 17
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTempDealerHits(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tempDealerHits
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Yes (H17)
              </button>
              <button
                onClick={() => setTempDealerHits(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !tempDealerHits
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                No (S17)
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-700/50 rounded-lg p-3 text-sm text-gray-400">
            <p className="mb-2">
              <strong className="text-gray-300">Keyboard shortcuts:</strong>
            </p>
            <ul className="space-y-1">
              <li>H - Hit</li>
              <li>S - Stand</li>
              <li>D - Double</li>
              <li>P - Split</li>
              <li>R - Surrender</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowSettings(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} className="flex-1">
              Save & Restart
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
