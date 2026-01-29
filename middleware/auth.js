const API_KEY = "my-secret-key"

module.exports = (req, res, next) => {
  const apiKey = req.headers["x-api-key"]

  if (!apiKey) {
    return res.status(401).json({ error: "API key is missing" })
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" })
  }

  next()
}