import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
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

  test('shows url, likes and user after clicking the view button', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('http://example.com')).toBeInTheDocument()
    expect(screen.getByText('likes 42')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  test('calls event handler twice if like button is clicked twice', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})
})
