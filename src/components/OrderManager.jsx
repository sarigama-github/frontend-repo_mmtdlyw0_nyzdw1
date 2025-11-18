import { useEffect, useMemo, useState } from 'react'

export default function OrderManager() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)
  const [orders, setOrders] = useState([])

  const load = async () => {
    const [mres, ores] = await Promise.all([
      fetch(`${baseUrl}/menu`),
      fetch(`${baseUrl}/orders`),
    ])
    setMenu(await mres.json())
    setOrders(await ores.json())
  }
  useEffect(()=>{ load() }, [])

  const addToCart = (item) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.menu_item_id === item._id)
      if (idx >= 0) {
        const cp = [...prev]; cp[idx] = { ...cp[idx], quantity: cp[idx].quantity + 1 }; return cp
      }
      return [...prev, { menu_item_id: item._id, quantity: 1 }]
    })
  }

  const totals = useMemo(() => {
    let subtotal = 0
    let tax = 0
    cart.forEach(ci => {
      const m = menu.find(x => x._id === ci.menu_item_id)
      if (!m) return
      const line = Number(m.price) * ci.quantity
      subtotal += line
      tax += line * Number(m.gst_rate || 0)
    })
    subtotal = Math.max(0, subtotal - Number(discount || 0))
    const grand = subtotal + tax
    return { subtotal, tax, grand }
  }, [cart, menu, discount])

  const placeOrder = async () => {
    if (cart.length === 0) return
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, discount: Number(discount || 0) })
    })
    const data = await res.json()
    if (res.ok) {
      setCart([]); setDiscount(0); await load()
      window.alert(`Order placed! Total: ₹${data.totals.grand_total}`)
    } else {
      window.alert(data.detail || 'Failed')
    }
  }

  const updateStatus = async (id, status) => {
    await fetch(`${baseUrl}/orders/${id}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) })
    await load()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-white text-2xl font-semibold mb-4">Order Management</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {menu.map(m => (
            <button key={m._id} onClick={()=>addToCart(m)} className="bg-slate-800/60 border border-slate-700 hover:border-blue-600 hover:shadow-blue-500/10 hover:shadow rounded-lg p-4 text-left transition">
              <div className="text-white font-semibold">{m.name}</div>
              <div className="text-blue-200 text-sm">{m.category}</div>
              <div className="text-white font-bold mt-2">₹{Number(m.price).toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white text-xl font-semibold mb-3">Cart</h3>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-blue-200">Add items to cart</div>
          ) : cart.map(ci => {
            const m = menu.find(x => x._id === ci.menu_item_id)
            if (!m) return null
            return (
              <div key={ci.menu_item_id} className="flex items-center justify-between text-white">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-blue-300">x {ci.quantity}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-slate-700 rounded" onClick={()=>setCart(prev=>prev.map(p=>p.menu_item_id===ci.menu_item_id?{...p, quantity: Math.max(1,p.quantity-1)}:p))}>-</button>
                  <button className="px-2 py-1 bg-slate-700 rounded" onClick={()=>setCart(prev=>prev.map(p=>p.menu_item_id===ci.menu_item_id?{...p, quantity: p.quantity+1}:p))}>+</button>
                </div>
              </div>
            )
          })}

          <div className="h-px bg-slate-700" />
          <div className="text-white space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{totals.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>₹{totals.grand.toFixed(2)}</span></div>
          </div>
          <input className="w-full bg-slate-900 text-white rounded px-3 py-2" placeholder="Discount" type="number" value={discount} onChange={e=>setDiscount(e.target.value)} />
          <button onClick={placeOrder} className="w-full bg-green-600 hover:bg-green-700 text-white rounded px-3 py-2">Place Order</button>
        </div>

        <h3 className="text-white text-xl font-semibold mt-6 mb-3">Recent Orders</h3>
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o._id} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="font-semibold">#{o._id.slice(-6)} • {o.status}</div>
                <div className="font-bold">₹{Number(o.grand_total).toFixed(2)}</div>
              </div>
              <div className="text-sm text-blue-300">{o.items?.length || 0} items</div>
              <div className="mt-2 flex gap-2">
                {['pending','preparing','ready','served','cancelled'].map(s => (
                  <button key={s} onClick={()=>updateStatus(o._id, s)} className={`px-2 py-1 rounded text-xs border ${o.status===s? 'bg-blue-600 border-blue-600':'border-slate-600'}`}>{s}</button>
                ))}
                <a className="ml-auto underline text-blue-300" href={`/bill/${o._id}`} target="_blank" rel="noreferrer">Bill</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
