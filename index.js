require("dotenv").config()

const express = require("express")
const { MongoClient } = require("mongodb")

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

let products

MongoClient.connect(MONGO_URI)
  .then(client => {
    console.log("MongoDB connected")

    const db = client.db("shop")
    products = db.collection("products")

    app.use("/api/items", require("./routes/items")(products))

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => console.error("MongoDB error:", err))

// ROOT
app.get("/", (req, res) => {
  res.json({ message: "API is running" })
})