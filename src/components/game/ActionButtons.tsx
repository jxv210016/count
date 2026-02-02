import { clsx } from 'clsx'
import { Button } from '../ui/Button'
import type { HandAction } from '../../types'

interface ActionButtonsProps {
  validActions: HandAction[]
  onAction: (action: HandAction) => void
  disabled?: boolean
}

const ACTION_LABELS: Record<HandAction, string> = {
  hit: 'Hit',
  stand: 'Stand',
  double: 'Double',
  split: 'Split',
  surrender: 'Surrender',
}

const ACTION_SHORTCUTS: Record<HandAction, string> = {
  hit: 'H',
  stand: 'S',
  double: 'D',
  split: 'P',
  surrender: 'R',
}

export function ActionButtons({ validActions, onAction, disabled }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {validActions.map(action => (
        <Button
          key={action}
          onClick={() => onAction(action)}
          disabled={disabled}
          variant={action === 'hit' ? 'primary' : 'secondary'}
          className={clsx(
            'min-w-[80px]',
            action === 'surrender' && 'bg-yellow-600 hover:bg-yellow-500'
          )}
        >
          <span>{ACTION_LABELS[action]}</span>
          <span className="ml-1 text-xs opacity-70">({ACTION_SHORTCUTS[action]})</span>
        </Button>
      ))}
    </div>
  )
}
