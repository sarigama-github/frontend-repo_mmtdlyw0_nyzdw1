import { useEffect, useState } from 'react'

export default function MenuManager() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'Mains', price: '', description: '', gst_rate: 0.05 })

  const load = async () => {
    const res = await fetch(`${baseUrl}/menu`)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price || 0) })
      })
      if (!res.ok) throw new Error('Failed to add item')
      setForm({ name: '', category: 'Mains', price: '', description: '', gst_rate: 0.05 })
      await load()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-white text-2xl font-semibold mb-4">Menu Management</h2>
      <form onSubmit={onSubmit} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 mb-6 grid sm:grid-cols-5 gap-3">
        <input className="bg-slate-900 text-white rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="bg-slate-900 text-white rounded px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
        <input className="bg-slate-900 text-white rounded px-3 py-2" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
        <input className="bg-slate-900 text-white rounded px-3 py-2" placeholder="GST (0-0.28)" type="number" step="0.01" value={form.gst_rate} onChange={e=>setForm({...form, gst_rate: parseFloat(e.target.value || 0)})} />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded px-3 py-2">{loading? 'Adding...' : 'Add Item'}</button>
        <input className="bg-slate-900 text-white rounded px-3 py-2 sm:col-span-5" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(it => (
          <div key={it._id} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">{it.name}</h3>
                <p className="text-blue-200 text-sm">{it.category}</p>
              </div>
              <div className="text-white font-semibold">₹{Number(it.price).toFixed(2)}</div>
            </div>
            {it.description && <p className="text-blue-200/80 mt-2 text-sm">{it.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
