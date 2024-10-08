import axios from 'axios'

const $host = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
})

export {
  $host
}
