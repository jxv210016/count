import { useState } from 'react'
import { clsx } from 'clsx'

type Tab = 'hilo' | 'strategy' | 'deviations'

export function LearnPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hilo')

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Learn Card Counting</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2">
        {[
          { id: 'hilo', label: 'Hi-Lo System' },
          { id: 'strategy', label: 'Basic Strategy' },
          { id: 'deviations', label: 'Deviations' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={clsx(
              'px-4 py-2 rounded-t-lg font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'hilo' && <HiLoContent />}
      {activeTab === 'strategy' && <StrategyContent />}
      {activeTab === 'deviations' && <DeviationsContent />}
    </div>
  )
}

function HiLoContent() {
  return (
    <div className="space-y-8">
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">The Hi-Lo Counting System</h2>
        <p className="text-gray-300 mb-4">
          Hi-Lo is the most popular card counting system. It assigns a value to each card,
          and you keep a running total as cards are dealt.
        </p>

        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">+1</div>
            <div className="text-gray-400">2, 3, 4, 5, 6</div>
            <div className="text-xs text-gray-500 mt-2">Low cards favor dealer</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
            <div className="text-gray-400">7, 8, 9</div>
            <div className="text-xs text-gray-500 mt-2">Neutral cards</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">-1</div>
            <div className="text-gray-400">10, J, Q, K, A</div>
            <div className="text-xs text-gray-500 mt-2">High cards favor player</div>
          </div>
        </div>
      </section>

      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Running Count vs True Count</h2>

        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="font-medium text-white mb-2">Running Count</h3>
            <p>The sum of all card values seen so far. Start at 0 at the beginning of the shoe.</p>
          </div>

          <div>
            <h3 className="font-medium text-white mb-2">True Count</h3>
            <p>Running count divided by decks remaining. This normalizes the count across different deck sizes.</p>
            <div className="bg-gray-700/50 rounded-lg p-4 mt-2 font-mono text-center">
              True Count = Running Count ÷ Decks Remaining
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Example:</h4>
            <ul className="space-y-1 text-sm">
              <li>Running count: +12</li>
              <li>Decks remaining: 4</li>
              <li>True count: +12 ÷ 4 = <span className="text-green-400 font-bold">+3</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Why It Works</h2>
        <p className="text-gray-300 mb-4">
          A positive count means more high cards (10s and Aces) remain in the deck.
          This benefits the player because:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Blackjacks pay 3:2 (player advantage)</li>
          <li>Dealer busts more often when hitting stiff hands</li>
          <li>Double downs are more effective with high cards</li>
          <li>Insurance becomes profitable at high counts</li>
        </ul>
      </section>
    </div>
  )
}

function StrategyContent() {
  return (
    <div className="space-y-8">
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Basic Strategy Overview</h2>
        <p className="text-gray-300 mb-4">
          Basic strategy is the mathematically optimal play for every hand combination.
          It reduces the house edge to about 0.5% when played perfectly.
        </p>
      </section>

      {/* Hard Totals */}
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Hard Totals</h2>
        <div className="overflow-x-auto">
          <StrategyTable type="hard" />
        </div>
      </section>

      {/* Soft Totals */}
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Soft Totals (Hands with Ace)</h2>
        <div className="overflow-x-auto">
          <StrategyTable type="soft" />
        </div>
      </section>

      {/* Pairs */}
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Pair Splitting</h2>
        <div className="overflow-x-auto">
          <StrategyTable type="pairs" />
        </div>
      </section>

      {/* Legend */}
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Legend</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded"></div>
            <span className="text-gray-300">H = Hit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded"></div>
            <span className="text-gray-300">S = Stand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-600 rounded"></div>
            <span className="text-gray-300">D = Double</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded"></div>
            <span className="text-gray-300">P = Split</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded"></div>
            <span className="text-gray-300">R = Surrender</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function StrategyTable({ type }: { type: 'hard' | 'soft' | 'pairs' }) {
  const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A']

  const hardRows = [
    { hand: '17+', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
    { hand: '16', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'R', 'R', 'R'] },
    { hand: '15', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'R', 'R'] },
    { hand: '14', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
    { hand: '13', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
    { hand: '12', actions: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
    { hand: '11', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'] },
    { hand: '10', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
    { hand: '9', actions: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    { hand: '8-', actions: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'] },
  ]

  const softRows = [
    { hand: 'A,9', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
    { hand: 'A,8', actions: ['S', 'S', 'S', 'S', 'D', 'S', 'S', 'S', 'S', 'S'] },
    { hand: 'A,7', actions: ['D', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'] },
    { hand: 'A,6', actions: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    { hand: 'A,5', actions: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    { hand: 'A,4', actions: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    { hand: 'A,3', actions: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    { hand: 'A,2', actions: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  ]

  const pairRows = [
    { hand: 'A,A', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] },
    { hand: '10,10', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
    { hand: '9,9', actions: ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'] },
    { hand: '8,8', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'R'] },
    { hand: '7,7', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
    { hand: '6,6', actions: ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
    { hand: '5,5', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
    { hand: '4,4', actions: ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
    { hand: '3,3', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
    { hand: '2,2', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
  ]

  const rows = type === 'hard' ? hardRows : type === 'soft' ? softRows : pairRows

  const getActionColor = (action: string) => {
    switch (action) {
      case 'H': return 'bg-green-600'
      case 'S': return 'bg-red-600'
      case 'D': return 'bg-yellow-600'
      case 'P': return 'bg-blue-600'
      case 'R': return 'bg-purple-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="p-2 text-left text-gray-400">Hand</th>
          {dealerCards.map(card => (
            <th key={card} className="p-2 text-center text-gray-400 min-w-[36px]">
              {card}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.hand} className="border-t border-gray-700">
            <td className="p-2 font-medium text-white">{row.hand}</td>
            {row.actions.map((action, i) => (
              <td key={i} className="p-1 text-center">
                <span
                  className={clsx(
                    'inline-block w-7 h-7 leading-7 rounded text-white font-bold text-xs',
                    getActionColor(action)
                  )}
                >
                  {action}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DeviationsContent() {
  const deviations = [
    { count: '+3', hand: '16 vs 10', normal: 'Hit', deviation: 'Stand', reason: 'More 10s in deck make hitting riskier' },
    { count: '+3', hand: '12 vs 3', normal: 'Hit', deviation: 'Stand', reason: 'Dealer more likely to bust' },
    { count: '+3', hand: '12 vs 2', normal: 'Hit', deviation: 'Stand', reason: 'Dealer more likely to bust' },
    { count: '+1', hand: 'Insurance', normal: 'Never', deviation: 'Take it', reason: 'Insurance profitable at TC +3+' },
    { count: '+4', hand: '10 vs 10', normal: 'Hit', deviation: 'Double', reason: 'Enough high cards for profitable double' },
    { count: '+4', hand: '10 vs A', normal: 'Hit', deviation: 'Double', reason: 'Enough high cards for profitable double' },
    { count: '-1', hand: '13 vs 2', normal: 'Stand', deviation: 'Hit', reason: 'Fewer high cards, safer to hit' },
    { count: '0', hand: '16 vs 9', normal: 'Hit', deviation: 'Surrender', reason: 'Surrender becomes better at neutral counts' },
  ]

  return (
    <div className="space-y-8">
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Index Plays (Deviations)</h2>
        <p className="text-gray-300 mb-4">
          Deviations are situations where the count tells you to play differently from basic strategy.
          These are based on the True Count.
        </p>
      </section>

      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Common Deviations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left text-gray-400">True Count</th>
                <th className="p-3 text-left text-gray-400">Hand</th>
                <th className="p-3 text-left text-gray-400">Basic Strategy</th>
                <th className="p-3 text-left text-gray-400">Deviation</th>
                <th className="p-3 text-left text-gray-400">Reason</th>
              </tr>
            </thead>
            <tbody>
              {deviations.map((dev, i) => (
                <tr key={i} className="border-b border-gray-700/50">
                  <td className={clsx(
                    'p-3 font-bold',
                    dev.count.startsWith('+') ? 'text-green-400' : dev.count.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                  )}>
                    {dev.count}
                  </td>
                  <td className="p-3 text-white">{dev.hand}</td>
                  <td className="p-3 text-gray-400">{dev.normal}</td>
                  <td className="p-3 text-yellow-400 font-medium">{dev.deviation}</td>
                  <td className="p-3 text-gray-400 text-xs">{dev.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Learning Tips</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Master basic strategy first before learning deviations</li>
          <li>Start with the "Illustrious 18" - the most valuable deviations</li>
          <li>Practice at low stakes until deviations become automatic</li>
          <li>Use the Drill mode to test your knowledge</li>
        </ul>
      </section>
    </div>
  )
}
