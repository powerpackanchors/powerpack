const cache = {}

export const getCached = (key) => cache[key] || null

export const setCached = (key, data) => {
  cache[key] = data
}
