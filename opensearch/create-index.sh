HOST=localhost:9200
curl -H "Content-Type: application/x-ndjson" \
     -X PUT https://$HOST/materials -ku admin:admin --data-binary "@field_mappings.json"