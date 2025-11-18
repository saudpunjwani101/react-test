import { expect, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Products } from './products'
import { CartProvider } from './products'
import React from 'react'
import { vi } from 'vitest'
import articles from '../../products.json'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(articles),
  })
)

afterEach(() => {
  vi.clearAllMocks()
})

test('renders Products component, fetches and displays all products initially', async () => {
  render(
    <CartProvider>
      <Products />
    </CartProvider>
  )

  expect(screen.getByText('Product Catalog')).toBeInTheDocument()
  expect(screen.getByText('Cart items: 0')).toBeInTheDocument() // Initial cart count
  expect(screen.getByLabelText('Choose a category:')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText(articles[0].name)).toBeInTheDocument()
    expect(screen.getByText(articles[1].name)).toBeInTheDocument()
    expect(screen.getByText(articles[2].name)).toBeInTheDocument()
  })

  const select = screen.getByRole('combobox', { name: /Choose a category:/ })
  expect(select).toHaveValue('All') // Initial value
})

test('filters products by selected category and updates display', async () => {
  render(
    <CartProvider>
      <Products />
    </CartProvider>
  )

  await waitFor(() => {
    expect(screen.getByText(articles[0].name)).toBeInTheDocument()
  })

  const select = screen.getByRole('combobox', { name: /Choose a category:/ })
  fireEvent.change(select, { target: { value: 'Apparel' } })

  const apparelArticle = articles.find(
    (article) => article.category === 'Apparel'
  )
  const footwearArticle = articles.find(
    (article) => article.category === 'Footwear'
  )

  await waitFor(() => {
    expect(screen.getByText(apparelArticle.name)).toBeInTheDocument() // Apparel
    expect(screen.queryByText(footwearArticle.name)).not.toBeInTheDocument() // Footwear
  })
})
