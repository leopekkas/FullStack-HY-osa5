import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const currentLikes = Number.isFinite(blog.likes) ? blog.likes : 0
    const newLikes = currentLikes + 1

    await updateBlog(blog.id, { likes: newLikes })
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => updateBlog(blog.id, { likes: blog.likes + 1 })}>like</button>
          </div>
          <div>{blog.user?.name}</div>

          {user && blog.user && user.username === blog.user.username && (
            <button onClick={() => deleteBlog(blog.id)}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
