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
    let query = "Grinschinator"

    // let result = await opensearch.search({
    //     index: "materials",
    //     body: {
    //         query: {
    //             match: {
    //                 name: {
    //                     query: query
    //                 }
    //             }
    //         }
    //     }
    // })

    // docIds = result.body.hits.hits.map((elem) => elem._id)
    // docs = await materials.fetch({keys: docIds})
    // console.log(docs.rows.map((elem) => elem.doc))
    
    let result = await opensearch.search({
        index: "materials",
        body: {
            query: {
                match_bool_prefix: {
                    name: {
                        query: query,
                        fuzziness: "AUTO",
                        max_expansions: 50,
                        fuzzy_transpositions: true,
                        prefix_length: 0,
                        operator:  "or",
                        minimum_should_match: 2,
                        analyzer: "standard"
                    }
                }
            }
        }
    })

    console.log(result.body.hits.hits)
}

main()

