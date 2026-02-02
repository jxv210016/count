import { clsx } from 'clsx'
import type { DecisionFeedback } from '../../types'

interface FeedbackOverlayProps {
  feedback: DecisionFeedback | null
}

const ACTION_NAMES: Record<string, string> = {
  hit: 'Hit',
  stand: 'Stand',
  double: 'Double',
  split: 'Split',
  surrender: 'Surrender',
}

export function FeedbackOverlay({ feedback }: FeedbackOverlayProps) {
  if (!feedback) return null

  return (
    <div
      className={clsx(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50',
        'px-6 py-3 rounded-lg shadow-lg',
        'animate-slide-up',
        feedback.isCorrect
          ? 'bg-green-600/90 text-white'
          : 'bg-red-600/90 text-white'
      )}
    >
      <div className="text-center">
        <div className="text-lg font-bold">
          {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
        </div>
        {!feedback.isCorrect && (
          <div className="text-sm mt-1 opacity-90">
            You chose <span className="font-semibold">{ACTION_NAMES[feedback.playerAction]}</span>,
            correct is <span className="font-semibold">{ACTION_NAMES[feedback.correctAction]}</span>
          </div>
        )}
        {feedback.explanation && (
          <div className="text-xs mt-1 opacity-75">{feedback.explanation}</div>
        )}
      </div>
    </div>
  )
}
