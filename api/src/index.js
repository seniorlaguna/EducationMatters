const express = require("express")
const nano = require('nano')('http://admin:password@couchdb:5984');
const { Client } = require("@opensearch-project/opensearch");


const app = express()
const port = 8080
const opensearch = new Client({
    node: "https://admin:admin@opensearch:9200",
    ssl: {
        rejectUnauthorized: false,
    }
})

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
    let query = req.query.query
    
    if (query === undefined) {
        res.send([])
        return
    }

    let result = await opensearch.search({
        index: "materials",
        body: {
            query: {
                match_phrase_prefix: {
                    name: {
                        query: query
                    }
                }
            }
        }
    })

    docIds = result.body.hits.hits.map((elem) => elem._id) || []
    docs = await materials.fetch({keys: docIds})
    res.send(docs.rows.map((elem) => elem.doc))
})

app.get("/complete", async (req, res) => {
    let text = req.query["text"]

    if (text === undefined) {
        res.send([])
        return
    }

    let result = await opensearch.search({
        index: "materials",
        body: {

            suggest: {
                autocomplete: {
                    prefix: text,
                    completion: {
                        field: "name_completion"
                    }
                }
            }

        }
    })

    try {
        result = result.body.suggest.autocomplete[0].options.map((elem) => elem.text)
    } catch {
        result = []
    }

    res.send(result)
})


app.listen(port, () => {
    console.log(`API runs on port ${port}`)
})