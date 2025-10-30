import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
    } catch (exception) {
      alert('wrong username or password')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>

      {blogs.map(blog =>
        <div key={blog.id}>
          {blog.title} {blog.author}
        </div>
      )}
    </div>
  )
}

export default App
