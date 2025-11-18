import Navbar from './components/Navbar'
import MenuManager from './components/MenuManager'
import OrderManager from './components/OrderManager'
import KitchenDisplay from './components/KitchenDisplay'
import Reports from './components/Reports'
import { Routes, Route } from 'react-router-dom'
import BillPage from './components/BillPage'

function HomeHero() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="relative max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Bill Printing App</h1>
        <p className="text-blue-200 mt-4 max-w-2xl">Fast order taking, kitchen display mode, tax-compliant billing, and simple sales reports — built for restaurants, cafes, and cloud kitchens.</p>
        <div className="mt-6 flex gap-3">
          <a href="/orders" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">New Order</a>
          <a href="/kitchen" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Kitchen Display</a>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeHero />} />
        <Route path="/menu" element={<MenuManager />} />
        <Route path="/orders" element={<OrderManager />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/bill/:id" element={<BillPage />} />
      </Routes>
    </div>
  )
}

export default App
