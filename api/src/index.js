const express = require("express")
const nano = require('nano')('http://admin:password@couchdb:5984');

const app = express()
const port = 8080

app.get("/", async (req, res) => {
    let result = await nano.db.list()
    res.send(result)
})

app.get("/subjects", (req, res) => {
    res.send("Subjects")
})

app.listen(port, () => {
    console.log(`API runs on port ${port}`)
})