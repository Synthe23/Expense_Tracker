import { format } from 'date-fns'

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default function ExpenseList({ expenses, selectedDate, onAdd, onEdit, onDelete, loading }) {
  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-white">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
          </p>
        </div>
        <button onClick={onAdd} className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <svg className="animate-spin w-6 h-6 text-brand-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-gray-500 text-sm">No expenses on this day</p>
          <button onClick={onAdd} className="mt-3 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
            + Add your first expense
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense, idx) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              index={idx + 1}
              onEdit={() => onEdit(expense)}
              onDelete={() => onDelete(expense._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ExpenseItem({ expense, index, onEdit, onDelete }) {
  return (
    <div className="group flex items-center gap-3 bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-700 rounded-xl px-4 py-3 transition-all duration-150">
      {/* Index badge */}
      <div className="w-6 h-6 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
        {index}
      </div>

      {/* Item name & note */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-100 truncate">{expense.itemName}</p>
        {expense.note && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{expense.note}</p>
        )}
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <span className="text-base font-semibold text-white">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(expense.amount)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={onEdit}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-500/20 text-gray-500 hover:text-brand-300 transition-colors"
          title="Edit"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
