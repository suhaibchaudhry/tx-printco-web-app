var host = 'root:xyz786@office.uitoux.com';
var port = '5988';
var dbname = 'txprintco_dev_stage17';

var ElasticSearchClient = require('elasticsearchclient');
var nano = require("nano")('http://'+host+':'+port);
var db = nano.db.use(dbname);

var elasticSearchClient = new ElasticSearchClient({
    host: 'office.uitoux.com',
    port: 9200,
    auth: {
      username: "digerpaji",
      password: "xyz786"
    }
});

var priceMarkupMap = {
  'business-cards': 30,
  'edge-cards': 50
};

module.exports.txprintco = {
    host: host,
    port: port,
    database: db,
    client: nano,
    elastic_client: elasticSearchClient,
    db: db,
    design_doc: 'txprintco',
    markup: priceMarkupMap
};
