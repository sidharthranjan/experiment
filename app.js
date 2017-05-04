// --- LOADING MODULES
var express = require('express'),
    body_parser = require('body-parser'),
    mongoose = require('mongoose');

var cool = require('cool-ascii-faces');

// --- INSTANTIATE THE APP
var app = express();


// --- MONGOOSE SETUP
mongoose.connect(process.env.CONNECTION || 'mongodb://localhost/jspsych'); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

var server = app.listen(3000, function(){
    console.log("Listening on port %d", server.address().port);
});


// --- STATIC MIDDLEWARE 
//app.use(express.static(__dirname + '/public'));
app.use('/jspsych-5.0.3', express.static(__dirname + "/jspsych-5.0.3"));
app.use('/css', express.static(__dirname + "/css"));
app.use('/img', express.static(__dirname + "/img"));
app.use('/sound', express.static(__dirname + "/sound"));

// --- BODY PARSING MIDDLEWARE
//app.use(body_parser.json()); // to support JSON-encoded bodies
app.use(body_parser.urlencoded({ extended: false }))

// parse application/json
app.use(body_parser.json());

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// --- ROUTING
app.get('/', function(request, response) {
    response.render('index.html');
});

app.get('/experiment', function(request, response) {
    response.render('exp_orig.html');
});

app.get('/finish', function(request, response) {
    response.render('finish.html');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < times; i++)
      result += i + ' ';
  response.send(result);
});

app.post('/experiment-data', function(request, response){
    console.log(request.body);
    var test1 = Entry.create({
        "data":  request.body
    });
    console.log(test1);
    response.end();
});
