import { useEffect, useState } from 'react'

export default function KitchenDisplay() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [orders, setOrders] = useState([])

  const load = async () => {
    const res = await fetch(`${baseUrl}/orders?status=pending`)
    const data = await res.json()
    setOrders(data)
  }

  useEffect(() => {
    load()
    const i = setInterval(load, 4000)
    return () => clearInterval(i)
  }, [])

  const mark = async (id, status) => {
    await fetch(`${baseUrl}/orders/${id}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) })
    await load()
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-green-400 text-3xl font-bold">Kitchen Display</h1>
          <div className="text-green-300/80">Auto-refreshing…</div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(o => (
            <div key={o._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold">Order #{o._id.slice(-6)}</div>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800">{o.status}</span>
              </div>
              <ul className="space-y-1 text-sm">
                {o.items?.map((it, idx) => (
                  <li key={idx} className="flex justify-between"><span>{it.name} × {it.quantity}</span><span>₹{Number(it.price).toFixed(0)}</span></li>
                ))}
              </ul>
              <div className="flex gap-2 mt-4">
                <button onClick={()=>mark(o._id,'preparing')} className="flex-1 bg-amber-600 hover:bg-amber-700 rounded px-3 py-2">Preparing</button>
                <button onClick={()=>mark(o._id,'ready')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded px-3 py-2">Ready</button>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="col-span-full text-center text-zinc-500 text-xl py-20">No pending orders</div>
          )}
        </div>
      </div>
    </div>
  )
}
