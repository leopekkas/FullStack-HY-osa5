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
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
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
    } catch {
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
      const newBlog = { ...returnedBlog, user: user }
      setBlogs(blogs.concat(newBlog))
      showNotification(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch {
      showNotification('error creating blog', 'error')
    }
  }

  const updateBlog = async (id, fields) => {
    try {
      const blogToUpdate = blogs.find(b => b.id === id)
      const returned = await blogService.update(id, fields)
      const updatedWithUser = {
        ...returned,
        user: blogToUpdate.user
      }

      setBlogs(blogs.map(b => b.id !== id ? b : updatedWithUser))
      showNotification(`Liked '${returned.title}'`)
    } catch (e) {
      console.error(e)
      showNotification('Error liking blog', 'error')
    }
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (!window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) return

    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      showNotification(`Deleted blog "${blog.title}"`)
    } catch (error) {
      console.error(error)
      showNotification('Error deleting blog', 'error')
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
            <Blog
              key={b.id}
              blog={b}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App
