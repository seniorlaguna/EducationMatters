#!/bin/bash
# Analyzes a github repository and CouchDB and inserts or updates the OpenSearch materials index

COUCHDB="http://admin:password@localhost:5984"
OPENSEARCH="https://localhost:9200"

COUCHDB_DATA=couchdb_materials.json
OPENSEARCH_DATA=opensearch_materials.json

# Fetch all materials from couch db
curl -X GET "$COUCHDB/materials/_all_docs?include_docs=true" | jq '.rows | map(.doc)' > $COUCHDB_DATA

SIZE=$(jq 'length - 1' $COUCHDB_DATA)

for i in $(seq 0 $SIZE)
do
    ID=$(jq ".[$i]._id" $COUCHDB_DATA)
    NAME=$(jq ".[$i].name" $COUCHDB_DATA)
    DESCRIPTION=$(jq ".[$i].description" $COUCHDB_DATA)

    echo "{ \"index\": { \"_index\": \"materials\", \"_id\": $ID } }" >> $OPENSEARCH_DATA
    echo "{ \"name\": $NAME, \"description\": $DESCRIPTION}" >> $OPENSEARCH_DATA
done

# Send prepared materials file to OpenSearch
curl -H "Content-Type: application/x-ndjson" -X PUT $OPENSEARCH/materials/_bulk -ku admin:admin --data-binary "@$OPENSEARCH_DATA"

# Do some backup if we already have the couchdb data?

# Clean up
rm $COUCHDB_DATA $OPENSEARCH_DATA