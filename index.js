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

    app.get("/", (req, res) => {
      res.json({ message: "API is running" })
    })

    app.get("/api/items", async (req, res) => {
      const items = await products.find().toArray()
      res.json(items)
    })

    app.post("/api/items", async (req, res) => {
      const result = await products.insertOne(req.body)
      res.json(result)
    })

    app.get("/version", (req, res) => {
        res.json({
          version: "1.1",
          updatedAt: "2026-01-18"
        })
    })
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error("MongoDB connection FAILED")
    console.error(err)
    process.exit(1)
  })