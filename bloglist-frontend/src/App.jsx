import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import loginService from './services/login'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(setBlogs)
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 4000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome ${user.name}`, 'success')
    } catch (exception) {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    showNotification('Logged out successfully', 'success')
  }

  const addBlog = async (blog) => {
    console.log('addBlog called with:', blog)
    try {
      const saved = await blogService.create(blog)
      setBlogs(blogs.concat(saved))
      showNotification(`a new blog "${saved.title}" by ${saved.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch {
      showNotification('Failed to create blog', 'error')
    }
  }

  const updateBlog = async (id, fields) => {
    try {
      const returned = await blogService.update(id, fields)
      setBlogs(prev => prev.map(b => b.id !== id ? b : returned))
      showNotification(`Liked '${returned.title}'`)
    } catch (e) {
      console.error(e)
      showNotification('Error liking blog', 'error')
    }
  }

  return (
    <div>
      <h2>Blog app</h2>
      <Notification message={notification.message} type={notification.type} />

      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <>
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          {blogs.map(b => (
            <Blog key={b.id} blog={b} updateBlog={updateBlog} />
          ))}
        </>
      )}
    </div>
  )
}

export default App
