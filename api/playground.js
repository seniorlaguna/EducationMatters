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
    search()
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

