//. app.js

var express = require( 'express' ),
    cfenv = require( 'cfenv' ),
    multer = require( 'multer' ),
    bodyParser = require( 'body-parser' ),
    ejs = require( 'ejs' ),
    fs = require( 'fs' ),
    mysql = require( 'mysql' ),
    request = require( 'request' ),
    app = express();
var settings = require( './settings' );
var appEnv = cfenv.getAppEnv();

app.use( bodyParser.urlencoded( { extended: true, limit: '10mb' } ) );
app.use( bodyParser.json( { limit: '10mb' } ) );
app.use( express.static( __dirname + '/public' ) );

var port = appEnv.port || 3000;

var connection = mysql.createConnection({
  host: settings.mysql_hostname,
  user: settings.mysql_username,
  password: settings.mysql_password,
  database: settings.mysql_dbname
});
connection.connect();

app.get( '/floors', function( req, res ){
  connection.query( 'SELECT distinct(floor) as floor from places where deleted = 0 order by floor', function( error, results, fields ){
    if( error ){
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: error }, 2, null ) );
      res.end();
    }else{
      res.write( JSON.stringify( { status: true, results: results, fields: fields }, 2, null ) );
      res.end();
    }
  });
});

app.get( '/placesByFloor', function( req, res ){
  var floor = req.query.floor;
  if( floor ){
    connection.query( 'SELECT id, name from places where floor = ? and deleted = 0 order by id', [floor], function( error, results, fields ){
      if( error ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, error: error }, 2, null ) );
        res.end();
      }else{
        res.write( JSON.stringify( { status: true, results: results, fields: fields }, 2, null ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'parameter floor needed.' }, 2, null ) );
    res.end();
  }
});

app.get( '/itemsByPlaceId', function( req, res ){
  var place_id = req.query.place_id;
  if( place_id ){
    connection.query( 'SELECT prices.item_id as item_id, items.name as name, prices.price as price from prices, items where prices.item_id = items.id and prices.place_id = ? and prices.deleted = 0 order by prices.price', [place_id], function( error, results, fields ){
      if( error ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, error: error }, 2, null ) );
        res.end();
      }else{
        res.write( JSON.stringify( { status: true, results: results, fields: fields }, 2, null ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'parameter place_id needed.' }, 2, null ) );
    res.end();
  }
});

app.get( '/pricesByItemId', function( req, res ){
  var item_id = req.query.item_id;
  if( item_id ){
    connection.query( 'SELECT prices.place_id as place_id, places.name as name, places.floor as floor, prices.price as price from prices, places where prices.place_id = places.id and prices.item_id = ? and prices.deleted = 0 order by places.floor, prices.price', [item_id], function( error, results, fields ){
      if( error ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, error: error }, 2, null ) );
        res.end();
      }else{
        res.write( JSON.stringify( { status: true, results: results, fields: fields }, 2, null ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'parameter item_id needed.' }, 2, null ) );
    res.end();
  }
});


app.listen( port );
console.log( "server starting on " + port + " ..." );
