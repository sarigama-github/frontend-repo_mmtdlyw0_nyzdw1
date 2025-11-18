import { useEffect, useState } from 'react'

export default function Reports(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [stats, setStats] = useState({ revenue: 0, orders: 0 })

  const load = async () => {
    const res = await fetch(`${baseUrl}/reports/sales`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({}) })
    const data = await res.json()
    setStats(data)
  }
  useEffect(()=>{ load() }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-white text-2xl font-semibold mb-4">Reports & Analytics</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6">
          <div className="text-blue-300">Total Revenue</div>
          <div className="text-white text-3xl font-bold mt-2">₹{Number(stats.revenue).toFixed(2)}</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6">
          <div className="text-blue-300">Total Orders</div>
          <div className="text-white text-3xl font-bold mt-2">{stats.orders}</div>
        </div>
      </div>
    </div>
  )
}
