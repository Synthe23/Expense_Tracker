import { format, startOfMonth, getDay, getDaysInMonth, addMonths, subMonths, isSameDay, isToday } from 'date-fns'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function CalendarPicker({
  selectedDate,
  onSelectDate,
  calendarMonth,
  onMonthChange,
  datesWithExpenses = [],
}) {
  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth()
  const daysInMonth = getDaysInMonth(calendarMonth)
  const firstDayOfWeek = getDay(startOfMonth(calendarMonth))

  const hasExpense = (day) => {
    const d = new Date(year, month, day)
    return datesWithExpenses.includes(format(d, 'yyyy-MM-dd'))
  }

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(subMonths(calendarMonth, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-semibold text-white">
          {format(calendarMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => onMonthChange(addMonths(calendarMonth, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const isSelected = isSameDay(date, selectedDate)
          const isTodayDate = isToday(date)
          const hasExp = hasExpense(day)

          return (
            <button
              key={day}
              onClick={() => onSelectDate(date)}
              className={`
                relative flex flex-col items-center justify-center h-9 w-full rounded-xl text-sm font-medium transition-all duration-150
                ${isSelected
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : isTodayDate
                    ? 'bg-gray-800 text-brand-300 ring-1 ring-brand-500/50'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              {day}
              {/* Dot indicator for expenses */}
              {hasExp && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* Today button */}
      <button
        onClick={() => {
          const today = new Date()
          onSelectDate(today)
          onMonthChange(today)
        }}
        className="mt-4 w-full text-center text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
      >
        Go to today
      </button>
    </div>
  )
}
