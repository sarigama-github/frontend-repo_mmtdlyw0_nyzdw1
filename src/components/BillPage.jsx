import { useEffect, useState, useRef } from 'react'

export default function BillPage(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [order, setOrder] = useState(null)
  const orderId = window.location.pathname.split('/').pop()
  const printRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${baseUrl}/orders/${orderId}/bill`)
      const data = await res.json()
      setOrder(data)
    }
    load()
  }, [orderId])

  const print = () => {
    window.print()
  }

  if (!order) return <div className="p-6 text-white">Loading…</div>

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
      <div ref={printRef} className="bg-white w-[360px] text-black p-4 rounded shadow">
        <div className="text-center mb-3">
          <div className="font-bold">Your Restaurant</div>
          <div className="text-xs">123 Street, City</div>
          <div className="text-xs">GSTIN: 12ABCDE3456F7Z8</div>
        </div>
        <div className="text-xs flex justify-between"><span>Bill #</span><span>{order._id.slice(-6)}</span></div>
        <div className="text-xs flex justify-between"><span>Date</span><span>{new Date(order.created_at).toLocaleString?.() || ''}</span></div>
        <div className="mt-2 border-t border-dashed border-gray-300" />
        <table className="w-full text-xs mt-2">
          <thead>
            <tr className="text-left">
              <th className="py-1">Item</th>
              <th className="py-1 text-right">Qty</th>
              <th className="py-1 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((it, idx) => (
              <tr key={idx}>
                <td className="py-0.5">{it.name}</td>
                <td className="py-0.5 text-right">{it.quantity}</td>
                <td className="py-0.5 text-right">₹{Number(it.price * it.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 border-t border-dashed border-gray-300" />
        <div className="text-xs mt-2 space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{Number(order.subtotal).toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{Number(order.tax_total).toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>₹{Number(order.grand_total).toFixed(2)}</span></div>
        </div>
        <div className="text-center text-xs mt-3">Thank you! Visit again.</div>
      </div>
      <button onClick={print} className="ml-6 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2">Print</button>
    </div>
  )
}
