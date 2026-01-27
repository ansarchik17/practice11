require("dotenv").config({ override: true })

const express = require("express")
const { MongoClient } = require("mongodb")

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

const client = new MongoClient(MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 5000
})

client.connect()
  .then(() => {
    console.log("MongoDB connected")

    const db = client.db("shop")
    const products = db.collection("products")

    // ROOT
    app.get("/", (req, res) => {
      res.json({ message: "API is running" })
    })

    // VERSION (Practice Task 12)
    app.get("/version", (req, res) => {
      res.json({
        version: "1.1",
        updatedAt: "2026-01-18"
      })
    })

    // ITEMS ROUTES
    app.use("/api/items", require("./routes/items")(products))

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error("MongoDB connection FAILED")
    console.error(err)
    process.exit(1)
})