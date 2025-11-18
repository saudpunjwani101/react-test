import { useState, useEffect, useContext, createContext } from 'react'

const CartContext = createContext(null)

export function Products() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const { cartCount, addToCart } = useContext(CartContext)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Note: path is relative to the public folder
        const response = await fetch('../../products.json')

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const jsonData = await response.json()
        setProducts(jsonData)
      } catch (err) {
        // setError(err.message)
      } finally {
        // setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">Product Catalog</div>
        </header>
        <div>Cart items: {cartCount}</div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addToCart}
        >
          Add to cart
        </button>

        <label htmlFor="category">Choose a category:</label>

        <select
          name="category"
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All">All</option>
          <option value="Apparel">Apparel</option>
          <option value="Footwear">Footwear</option>
          <option value="Electronics">Electronics</option>
        </select>

        <div className="max-w-[300px] w-full space-y-6 px-4">
          {filteredProducts.length > 0 &&
            filteredProducts.map(({ name, category, price }, key) => (
              <div key={key}>
                <div>{name}</div>
                <div>{price}</div>
                <div>{category}</div>
              </div>
            ))}
        </div>
      </div>
    </main>
  )
}

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)

  const addToCart = () => setCartCount(cartCount + 1)

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}{' '}
    </CartContext.Provider>
  )
}
