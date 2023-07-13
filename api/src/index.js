const express = require("express")

const app = express()
const port = 8080

app.get("/", (req, res) => {
    res.send("Express API is coming")
})

app.listen(port, () => {
    console.log(`API runs on port ${port}`)
})