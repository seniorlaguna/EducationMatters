const { Client } = require("@opensearch-project/opensearch");
const opensearch = new Client({
    node: "https://admin:admin@localhost:9200",
    ssl: {
        rejectUnauthorized: false,
    }
})

const nano = require('nano')('http://admin:password@localhost:5984');
const materials = nano.use("materials")

async function suggestion() {
    let result = await opensearch.search({
        index: "materials",
        body: {

            suggest: {
                autocomplete: {
                    prefix: "N",
                    completion: {
                        field: "name"
                    }
                }
            }

        }
    })

    console.log(result.body.suggest.autocomplete[0].options.map((elem) => elem.text))
}


async function main() {
    //await suggestion()
    //search()
    // getSubjects()
    //getDocumentById()
    personSearch()
}

async function personSearch() {
    let result = await opensearch.search({
        index: "materials",
        body: {
            query: {
                bool: {
                    filter: {
                        match: {
                            persons: "Grinsch"
                        }
                    }
                }
            },

        }
    })

    console.log(result.body.hits.hits)
}

async function getDocumentById() {
    let result = await opensearch.get({
        index: "materials",
        id: "0"
    })

    let doc = result.body._source
    doc.id = result.body._id
    console.log(doc)
}

async function getSubjects() {
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
    
        console.log(results.body.hits.hits.map((s) => {
            s._source.id = s._id
            return s._source
        }))
    } catch (error) {
        console.log(error)
    }
}

async function search() {
    let query = undefined
    let grades = []
    let subjects = ["Deutsch"]

        

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

    console.log(result.body.hits.hits)
}

main()

