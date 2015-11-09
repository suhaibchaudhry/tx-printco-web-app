var host = 'root:xyz786@office.uitoux.com';
var port = '5988';
var dbname = 'txprintco_dev_stage16';

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
  'business-cards': {
    base_markup: 30, //Use json number and not string.
    quantity_map: {
      "500": {
          "40": "24.99",
          "41": "25.99",
          "44": "26.99"
      },
      "1000": "49.98",
      "2500": "66.98",
      "5000": "99.99"
    }
  },
  'edge-cards': 50 //Use json number and not string.
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
