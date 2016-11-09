require('dotenv').config();
var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var request      = require('request');
var routes       = require('./routes/index');

var accessToken = process.env.YELPTOKEN;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public/img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// yelp variables to hold api call
var yelp_data; 
var temp_data;
var google_map_api_response = [];
var search_data = {};
var query_location = "";


var search_yelp = function(search_terms, location, radius, offset, res) {
  /*
   * Search Yelp API for the data provided.
   */
    var terms = {};
    if (typeof search_terms !== 'undefined') {
        terms.term = search_terms;
    }
    if (typeof location !== 'undefined') {
        terms.location = location;
    }
    if( typeof radius !== 'undefined') {
        terms.radius = radius;
    }
    terms.offset = parseInt(offset);
    terms.sort_by = "distance";
    terms.open_now = true;
    terms.limit = 20;
    request({
        url: 'https://api.yelp.com/v3/businesses/search',
        qs:  terms,
        auth: {
            'bearer': accessToken
        }
    }, function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            temp_data = JSON.parse(data.body).businesses;
            if (typeof(yelp_data) != 'undefined' && offset > 0) {
                // check for initial load vs see more
                var initial_length = yelp_data.length;
                // add see more data to yelp data
                for (var i = initial_length; i < (initial_length + temp_data.length); i++){
                    yelp_data[i] = temp_data[i - offset];
                }
            }
            else {
                // if initial load, temp_data is yelp_data
                yelp_data = temp_data;
            }
            if (search_data.offset == 0) {
                res.redirect("/food");
            }
            else {
                res.send({data             :((yelp_data)),
                          search_data      :((search_data))});
            }
            // get_location_data(yelp_data, res);
        }
    });
    
};

var get_location_data = function(yelp_data, res) {
    /*
     Go through restaurants one-by-one to:
     1. Prepare business location data for Google query
     2. Pull website and menu data from Yelp page directly
     */

    var dest_coordinates = [];
    for (var i = 0; i < yelp_data.length; i++) {
        dest_coordinates.push(
            yelp_data[i].coordinates.latitude
                + "," +
                yelp_data[i].coordinates.longitude);
    } // end for

    /* Query Google Maps with new business data */
    origin_coordinates = [JSON.parse(query_location).lat +
                          "," +
                          JSON.parse(query_location).lng];

    googleMapsClient.distanceMatrix({
        origins: dest_coordinates,
        destinations:origin_coordinates
    }, function(err, response) {
        if (!err) {
            var json_google_data = JSON.parse(JSON.stringify(response.json.rows));

            for (var i = 0; i < json_google_data.length; i++){
                google_map_api_response.push((json_google_data[i].elements[0].distance.value));
            }
            if (i >= (json_google_data.length - 1)) {
                if (search_data.offset == 0) {
                    res.redirect("/food");
                }
                else {
                    res.send({data             :((yelp_data)),
                              search_data      :((search_data)),
                              google_response  :((google_map_api_response))});
                }
            }
            // return google_map_api_response;
        } // end if
        else {
            console.log("ERROR: " + err);
        } // end else
    }); // end Google API call
};

app.get('/', function(req, res) {
  // homepage/form
    res.render('index');
}); // end get /

app.get('/about', function(req, res) {
  // about page
    res.render('about');
}); // end get /about

app.get('/restaurant', function(req, res) {
  // individual restaurant view
    res.render('food', {data             :JSON.stringify(yelp_data),
                        search_data      :JSON.stringify(search_data)});
}); // end get /restaurant

app.get('/food', function(req, res) {
  // main list of restaurants
    if (typeof(yelp_data) != 'undefined') {
        res.render('food', {data             :JSON.stringify(yelp_data),
                            search_data      :JSON.stringify(search_data)});
    }
    else {
        // if something goes wrong, redirect to the homepage
        res.redirect('/');
    }
}); // end get /food

app.get('/nope', function(req, res){
  // for invalid urls
    res.render('nope');
});

app.get('/where', function(req, res){
  // for location not found
    res.render('where');
});

app.get('/yelp', function(req, res){

    var terms      = req.query.terms;
    var location   = req.query.location.replace("%2C", ",").replace("+", " ");
    var offset     = req.query.offset;
    if (query_location == "") {
        query_location = JSON.parse(JSON.stringify(req.query.o_location));
    }

    if (typeof offset === 'undefined') {
        offset = 0;
    }
    radius = 20*1600; // 20 miles * 1600 m/mi

    if (query_location == '' ) {
        res.render("where", {wrong_loc: location});
    }

    search_data = {terms:     terms,
                   location: location,
                   offset:   offset,
                   radius:   radius};

    console.log("Terms: "    + terms    + "\n");
    console.log("Location: " + location + "\n");
    console.log("offset: "   + offset   + "\n");

    if (query_location   != ''  ){
        search_yelp(terms, location, radius, offset, res);
    } // end if

}); //end get /yelp

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("And just what do you think you're doing..?");
    err.status = 404;
    next(err);
});

// error handlers

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
