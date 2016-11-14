var express = require('express');
var yahooclient = require('./lib/yahoo-api-client.js');
var app = express();
var creds = require('./credentials.js');
// set up handle bars
var handlebars = require('express-handlebars').create({ 
    defaultLayout : 'main',
    helpers : {
       // section : function(name, options) {
         ///   if(!this._sections) this._sections = {};
          ///  this._sections[name] = options.fn(this);
           /// return null;
        //}
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set port
app.set('port', process.env.PORT || 3000);

// static content
app.use(express.static(__dirname + '/public'));

// link body-parser
app.use(require('body-parser').urlencoded({ extended : true}));
var yClient = new yahooclient(creds.yahoo.key, creds.yahoo.secret);

// middle ware for partial views
app.use(function(req, res, next){
    if(!res.locals.partials) {
        res.locals.partials = {};
    }
    next();
});

// home page
app.get('/', function(req, res) {
    yClient.getToken(req, res);



});


//custom 404 page
app.use(function(err, res) {
    res.status(404);

    res.render('404');
});

//custom 500 page
app.use(function(err, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});