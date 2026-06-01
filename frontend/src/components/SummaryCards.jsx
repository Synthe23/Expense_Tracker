import { format } from 'date-fns'

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default function SummaryCards({ dailyTotal, monthlyTotal, calendarMonth, selectedDate }) {
  return (
    <div className="space-y-3">
      {/* Daily Total */}
      <div className="card p-4 bg-gradient-to-br from-brand-500/10 to-brand-600/5 border-brand-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-xl flex-shrink-0">
            📅
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">
              {format(selectedDate, 'EEE, MMM d')}
            </p>
            <p className="text-xl font-bold text-white mt-0.5 truncate">{formatINR(dailyTotal)}</p>
            <p className="text-xs text-brand-400">Day's total</p>
          </div>
        </div>
      </div>

      {/* Monthly Total */}
      <div className="card p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl flex-shrink-0">
            🗓️
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">
              {format(calendarMonth, 'MMMM yyyy')}
            </p>
            <p className="text-xl font-bold text-white mt-0.5 truncate">{formatINR(monthlyTotal)}</p>
            <p className="text-xs text-purple-400">Monthly total</p>
          </div>
        </div>
      </div>
    </div>
  )
}
