import React, { useEffect, useMemo, useState } from 'react'

const currency = (n) => (Number(n).toFixed ? Number(n).toFixed(2) : n)

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [userId, setUserId] = useState('demo_user')

  // headers used by API for demo user scoping
  const hdrs = useMemo(() => ({ 'Content-Type': 'application/json', 'X-User-Id': userId }), [userId])

  // initial load
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setMsg('Failed to load products'))
    refreshCart()
    // eslint-disable-next-line
  }, [userId])

  function refreshCart() {
    fetch(`/api/cart?userId=${encodeURIComponent(userId)}`, { headers: hdrs })
      .then(r => r.json())
      .then(setCart)
      .catch(() => setMsg('Failed to load cart'))
  }

  async function addToCart(productId, qty = 1) {
    setLoading(true); setMsg('')
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ productId, qty })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Add failed')
      setCart(data)
    } catch (e) {
      setMsg(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function removeFromCart(productId) {
    setLoading(true); setMsg('')
    try {
      const res = await fetch(`/api/cart/items/${productId}`, { method: 'DELETE', headers: hdrs })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Remove failed')
      setCart(data)
    } catch (e) {
      setMsg(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function checkout() {
    setLoading(true); setMsg('')
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: hdrs })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      setMsg(`Order ${data.orderId} placed! Total $${currency(data.total)}`)
      refreshCart()
    } catch (e) {
      setMsg(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header>
        <div>
          <h1>ShopSquare</h1>
          <p className="muted">Vite dev <code>:5174</code> → Gateway <code>:5090</code> → Logic <code>:5091</code></p>
        </div>
        <div>
          <label className="muted">User: </label>
          <input
            className="input"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            title="Simple user id to separate carts"
          />
        </div>
      </header>

      <div className="row">
        <section className="card">
          <h2>Products</h2>
          <ul className="list">
            {products.map(p => (
              <li key={p.id}>
                <div>
                  <strong>{p.name}</strong>
                  <div className="muted">{p.tags}</div>
                </div>
                <div className="right">
                  <div>${currency(p.price)}</div>
                  <button className="btn" disabled={loading} onClick={() => addToCart(p.id, 1)}>Add</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Cart</h2>
          <ul className="list">
            {cart.items?.map(i => (
              <li key={i.productId}>
                <div>
                  <code>{i.productId}</code>
                  <div className="muted">Qty: {i.qty}</div>
                </div>
                <div className="right">
                  <button className="btn" disabled={loading} onClick={() => removeFromCart(i.productId)}>Remove</button>
                </div>
              </li>
            ))}
            {!cart.items?.length && <li className="muted">Your cart is empty.</li>}
          </ul>
          <hr />
          <p><strong>Total:</strong> ${currency(cart.total)}</p>
          <button className="btn" disabled={loading || !cart.items?.length} onClick={checkout}>Checkout</button>
          {msg && <p style={{ marginTop: 12 }}><strong>{msg}</strong></p>}
        </section>
        {/* <div>
          <iframe 
            width="1355" 
            height="762" 
            src="https://www.youtube.com/embed/GMGH0aIH1uQ?list=RDGMGH0aIH1uQ" 
            title="我的吉他哭泣了！《Cry For Me》高能点弦版！2.05秒《反方向的钟》注入灵魂！" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
          </iframe>
        </div> */}
      </div>
    </div>
  )
}
