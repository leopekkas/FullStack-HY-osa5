import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import loginService from './services/login'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

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

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, 'success')
    } catch (error) {
      console.error('Error creating blog:', error)
      showNotification('Failed to create blog', 'error')
    }
  }

  return (
    <div>
      <h2>Blog app</h2>
      <Notification message={notification.message} type={notification.type} />

      {user === null ? (
        <>
          <LoginForm handleLogin={handleLogin} />
        </>
      ) : (
        <>
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <BlogForm createBlog={addBlog} />
          {blogs.map(b => (
            <div key={b.id}>{b.title} {b.author}</div>
          ))}
        </>
      )}
    </div>
  )
}

export default App
