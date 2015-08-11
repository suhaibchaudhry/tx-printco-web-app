var host = 'root:xyz786@office.uitoux.com';
var port = '5988';
var dbname = 'txprintco_dev_stage15';

var nano = require("nano")('http://'+host+':'+port);
var db = nano.db.use(dbname);

module.exports.txprintco = {
    host: host,
    port: port,
    database: db,
    client: nano,
    db: db,
    design_doc: 'txprintco'
};
