const express = require("express")
const { Client } = require("@opensearch-project/opensearch");


const app = express()
const port = 8080
const opensearch = new Client({
    node: "https://admin:admin@opensearch:9200",
    ssl: {
        rejectUnauthorized: false,
    }
})

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
    try {
        let results = await opensearch.search(
            {
                index: "subjects",
                body: {
                    query: {
                        match_all: {}
                    }
                }
            }
        )
    
        res.send(results.body.hits.hits.map((s) => {
            s._source.id = s._id
            return s._source
        }))
    } catch (error) {
        console.log(error)
        res.send([])
    }
})

app.get("/materials/:id", async (req, res) => {
    let result = await opensearch.get({
        index: "materials",
        id: req.params.id
    })

    let doc = result.body._source
    doc.id = result.body._id
    res.send(doc)
})

app.get("/search", async (req, res) => {
    try {
        let query = req.query.query
        let subjects = queryParamToArray(req.query.subjects)
        let grades = queryParamToArray(req.query.grades)
        let tags = queryParamToArray(req.query.tags)
        let persons = queryParamToArray(req.query.persons)

        // no search parameters
        if (query === undefined && subjects.length == 0 && grades.length == 0 && tags.length == 0 && persons.length == 0) {
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
        }))).concat(tags.map((t) => ({
            match: {
                tags: t
            }
        }))).concat(persons.map((p) => ({
            match: {
                persons: p
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

        docs = result.body.hits.hits.map((elem) => {

            let doc = elem._source
            doc.id = elem._id
            return doc

        }) || []

        
        
        res.send(docs)
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