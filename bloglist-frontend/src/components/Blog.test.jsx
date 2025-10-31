import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React components is fun',
    author: 'Ada Lovelace',
    url: 'http://example.com',
    likes: 42,
    user: {
      name: 'Test User'
    }
  }

  test('renders title and author but not url or likes by default', () => {
    render(<Blog blog={blog} />)

    expect(screen.getByText('Testing React components is fun', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Ada Lovelace', { exact: false })).toBeInTheDocument()

    expect(screen.queryByText('http://example.com')).toBeNull()
    expect(screen.queryByText('likes')).toBeNull()
  })
})
