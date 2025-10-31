import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const update = async (id, fields) => {
  const response = await axios.put(`${baseUrl}/${id}`, fields)
  return response.data
}

export const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

const create = async newBlog => {
  const config = { headers: { Authorization: token } }
  return (await axios.post(baseUrl, newBlog, config)).data
}

export default { getAll, create, update, remove, setToken }