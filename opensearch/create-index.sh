OPENSEARCH="https://localhost:9200"

curl -s -H "Content-Type: application/x-ndjson" \
     -X PUT $OPENSEARCH/$1 -ku admin:admin --data-binary "@$2"