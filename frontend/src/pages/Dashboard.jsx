import { useState, useEffect, useCallback } from 'react'
import { format, isSameDay, getDaysInMonth, addMonths, subMonths } from 'date-fns'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import CalendarPicker from '../components/CalendarPicker'
import ExpenseList from '../components/ExpenseList'
import ExpenseModal from '../components/ExpenseModal'
import DailyBarChart from '../components/DailyBarChart'
import SummaryCards from '../components/SummaryCards'

export default function Dashboard() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [calendarMonth, setCalendarMonth] = useState(today)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // expense to delete

  // Sync calendarMonth when selectedDate changes month
  const handleSelectDate = (date) => {
    setSelectedDate(date)
    if (
      date.getMonth() !== calendarMonth.getMonth() ||
      date.getFullYear() !== calendarMonth.getFullYear()
    ) {
      setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
  }

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const year = calendarMonth.getFullYear()
      const month = calendarMonth.getMonth() + 1
      const res = await api.get(`/expenses/monthly?year=${year}&month=${month}`)
      setExpenses(res.data)
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    } finally {
      setLoading(false)
    }
  }, [calendarMonth])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  // Expenses for selected date
  const selectedDateExpenses = expenses.filter((e) =>
    isSameDay(new Date(e.date), selectedDate)
  )

  // Totals
  const dailyTotal = selectedDateExpenses.reduce((sum, e) => sum + e.amount, 0)
  const monthlyTotal = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Dates that have expenses (for calendar dots)
  const datesWithExpenses = [
    ...new Set(expenses.map((e) => format(new Date(e.date), 'yyyy-MM-dd'))),
  ]

  // Chart data: one entry per day of the month
  const chartData = Array.from({ length: getDaysInMonth(calendarMonth) }, (_, i) => {
    const day = i + 1
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    const dayExpenses = expenses.filter((e) => isSameDay(new Date(e.date), date))
    return {
      day: String(day),
      amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
    }
  })

  // Handlers
  const handleAdd = () => {
    setEditingExpense(null)
    setShowModal(true)
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowModal(true)
  }

  const handleDeleteClick = (id) => setDeleteConfirm(id)

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    try {
      await api.delete(`/expenses/${deleteConfirm}`)
      setDeleteConfirm(null)
      fetchExpenses()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleSave = async (data) => {
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense._id}`, data)
      } else {
        await api.post('/expenses', data)
      }
      setShowModal(false)
      // If expense date is in current calendar month, refresh
      const expDate = new Date(data.date)
      if (
        expDate.getMonth() === calendarMonth.getMonth() &&
        expDate.getFullYear() === calendarMonth.getFullYear()
      ) {
        fetchExpenses()
      } else {
        // Navigate to that month
        setCalendarMonth(new Date(expDate.getFullYear(), expDate.getMonth(), 1))
        setSelectedDate(expDate)
      }
    } catch (err) {
      throw err
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column ── */}
          <div className="space-y-4">
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              calendarMonth={calendarMonth}
              onMonthChange={setCalendarMonth}
              datesWithExpenses={datesWithExpenses}
            />
            <SummaryCards
              dailyTotal={dailyTotal}
              monthlyTotal={monthlyTotal}
              calendarMonth={calendarMonth}
              selectedDate={selectedDate}
            />
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-4">
            <ExpenseList
              expenses={selectedDateExpenses}
              selectedDate={selectedDate}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              loading={loading}
            />
            <DailyBarChart data={chartData} calendarMonth={calendarMonth} />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <ExpenseModal
          expense={editingExpense}
          selectedDate={selectedDate}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative card p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-lg font-semibold text-white">Delete Expense?</h3>
              <p className="text-gray-400 text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
