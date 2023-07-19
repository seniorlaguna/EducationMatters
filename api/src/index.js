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

function queryParamToArray(value) {
    if (value === undefined) return []
    if (value === "") return []
    return value.split(",")
}

app.get("/", async (req, res) => {
    let result = await nano.db.list()
    res.send(result)
})

app.get("/subjects", async (req, res) => {
    let result = await subjects.list({ include_docs: true })
    res.send(result.rows.map((row) => row.doc))
})

app.get("/materials/:id", async (req, res) => {
    let result = await materials.get(req.params.id)
    res.send(result)
})

app.get("/search", async (req, res) => {
    try {
        let query = req.query.query
        let subjects = queryParamToArray(req.query.subjects)
        let grades = queryParamToArray(req.query.grades)
        let tags = queryParamToArray(req.query.tags)

        // no search parameters
        if (query === undefined && subjects.length == 0 && grades.length == 0 && tags.length == 0) {
            res.send([])
            return
        }

        let musts = []
        if (query !== undefined) {
            musts.push({
                multi_match: {
                    query: query,
                    fields: ["name", "description"],

                }
            })
        }

        let myfilter = subjects.map((s) => ({
            match: {
                subjects: s
            }
        })).concat(grades.map((g) => ({
            match: {
                grades: g
            }
        })))

        let result = await opensearch.search({
            index: "materials",
            body: {
                query: {
                    bool: {
                        must: musts,
                        filter: myfilter
                    }
                },

            }
        })

        docIds = result.body.hits.hits.map((elem) => elem._id) || []

        if (docIds.length == 0) {
            throw Error("No Results found")
        }
        docs = await materials.fetch({ keys: docIds })
        res.send(docs.rows.map((elem) => elem.doc))
    } catch (error) {
        console.log("Error in search")

        console.log(error)
        res.send([])
    }
})

app.get("/complete", async (req, res) => {
    try {
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

        result = result.body.suggest.autocomplete[0].options.map((elem) => elem.text)
        res.send(result)
    } catch (error) {
        console.log("Error in complete")
        console.log(error)
        res.send([])
    }


})


app.listen(port, () => {
    console.log(`API runs on port ${port}`)
})