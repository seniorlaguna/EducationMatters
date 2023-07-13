const express = require("express")
const nano = require('nano')('http://admin:password@couchdb:5984');

const app = express()
const port = 8080

const subjects = nano.use("subjects")
const materials = nano.use("materials")

app.get("/", async (req, res) => {
    let result = await nano.db.list()
    res.send(result)
})

app.get("/subjects", async (req, res) => {
    let result = await subjects.list({include_docs: true})
    res.send(result.rows.map((row) => row.doc))
})

app.get("/materials/:id", async (req, res) => {
    let result = await materials.get(req.params.id)
    res.send(result)
})

app.get("/search", async (req, res) => {
    let result = await materials.list({include_docs: true})
    res.send(result.rows.map((row) => row.doc))
})

app.listen(port, () => {
    console.log(`API runs on port ${port}`)
})