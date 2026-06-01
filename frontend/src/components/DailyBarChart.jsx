import { format } from 'date-fns'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && payload[0].value > 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-gray-400 mb-0.5">Day {label}</p>
        <p className="text-sm font-bold text-white">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

export default function DailyBarChart({ data, calendarMonth }) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1)

  // Only show every 5th tick on x-axis for readability
  const xTicks = data
    .filter((d) => Number(d.day) % 5 === 0 || Number(d.day) === 1)
    .map((d) => d.day)

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Daily Spending</h3>
          <p className="text-xs text-gray-500 mt-0.5">{format(calendarMonth, 'MMMM yyyy')}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-sm bg-brand-500 inline-block" />
          Per day
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="day"
            ticks={xTicks}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            hide
            domain={[0, maxAmount * 1.2]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 4 }} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={32}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.amount > 0 ? '#4f63f5' : '#1f2937'}
                opacity={entry.amount > 0 ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
