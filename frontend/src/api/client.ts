import axios, { type InternalAxiosRequestConfig } from 'axios'

const BASE_ROOT = import.meta.env.VITE_API_ROOT ?? 'http://localhost:8000'
const BASE_API = `${BASE_ROOT}/api`

let onUnauthorizedCallback: (() => void) | null = null

export function registerUnauthorizedHandler(fn: () => void) {
  onUnauthorizedCallback = fn
}

let csrfPromise: Promise<void> | null = null
let csrfReady = false

async function ensureCsrf() {
  if (csrfReady) return
  if (!csrfPromise) {
    csrfPromise = axios
      .get(`${BASE_ROOT}/sanctum/csrf-cookie`, { withCredentials: true })
      .then(() => { csrfReady = true })
      .finally(() => { csrfPromise = null })
  }
  return csrfPromise
}

export function resetCsrf() {
  csrfReady = false
  csrfPromise = null
}

const MUTATING_METHODS = ['post', 'put', 'patch', 'delete']

const client = axios.create({
  baseURL: BASE_API,
  withCredentials: true,
  withXSRFToken: true
})

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (MUTATING_METHODS.includes(config.method ?? '')) {
    await ensureCsrf()
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const config = error.config as InternalAxiosRequestConfig & { _retried?: boolean }
      if (error.response?.status === 419 && config && !config._retried) {
        resetCsrf()
        config._retried = true
        await ensureCsrf()
        return client.request(config)
      }
      if (error.response?.status === 401) {
        onUnauthorizedCallback?.()
      }
    }
    return Promise.reject(error)
  }
)

export default client
