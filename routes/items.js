const express = require("express")
const { ObjectId } = require("mongodb")

module.exports = (products) => {
  const router = express.Router()

  // GET all items
  router.get("/", async (req, res) => {
    try {
      const items = await products.find().toArray()
      res.json(items)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  // GET item by ID
  router.get("/:id", async (req, res) => {
    try {
      const item = await products.findOne({
        _id: new ObjectId(req.params.id)
      })

      if (!item) {
        return res.status(404).json({ message: "Item not found" })
      }

      res.json(item)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  })

  // POST create item
  router.post("/", async (req, res) => {
    try {
      const result = await products.insertOne(req.body)
      res.status(201).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  })

  // PUT update item
  router.put("/:id", async (req, res) => {
    try {
      await products.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      )

      res.json({ message: "Item updated" })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  })

  // DELETE item
  router.delete("/:id", async (req, res) => {
    try {
      await products.deleteOne({
        _id: new ObjectId(req.params.id)
      })

      res.json({ message: "Item deleted" })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  })

  return router
}