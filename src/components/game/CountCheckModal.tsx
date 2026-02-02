import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface CountCheckModalProps {
  isOpen: boolean
  onSubmit: (guess: number) => void
  actualCount: number
  showResult: boolean
  wasCorrect: boolean
}

export function CountCheckModal({
  isOpen,
  onSubmit,
  actualCount,
  showResult,
  wasCorrect,
}: CountCheckModalProps) {
  const [guess, setGuess] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numGuess = parseInt(guess) || 0
    onSubmit(numGuess)
    setGuess('')
  }

  if (showResult) {
    return (
      <Modal isOpen={isOpen} onClose={() => {}} title="Count Check">
        <div className="text-center">
          <div
            className={`text-6xl mb-4 ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}
          >
            {wasCorrect ? '✓' : '✗'}
          </div>
          <p className="text-lg mb-2">
            {wasCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-gray-400">
            The running count was{' '}
            <span className="font-bold text-white">
              {actualCount > 0 ? `+${actualCount}` : actualCount}
            </span>
          </p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="What's the Running Count?">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-400 text-sm">
          Enter your count for all visible cards this hand.
        </p>
        <Input
          type="number"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          placeholder="Enter count (e.g., +3 or -2)"
          autoFocus
          className="text-center text-2xl"
        />
        <Button type="submit" className="w-full" size="lg">
          Submit
        </Button>
      </form>
    </Modal>
  )
}
