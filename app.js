/*
*
* This is the Kattegat application server
*
* Start it from the terminal with: 'npm start'
*
*/
var livereload = require('express-livereload'),
   express = require('express'),
   bodyParser = require('body-parser'),
   http = require('http'),
   ngrok = require('ngrok'),
   path = require('path');

// Configure the server
//    For help customising the app server,
//    see the Express docs: http://expressjs.com/
var app = express();
var startTunnel = false;

if (process.argv.length > 2) {
  if (process.argv[2] == "tunnel")
    startTunnel = true;
}

// Set up server
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(require('morgan')('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: 'kattegatsecret'
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/lib', express.static(path.join(__dirname, 'bower_components')));
app.use(require('errorhandler')());

// Init Kattegat and create a server
var kattegat = require('kattegat').create(app, { debug: true });
var server = kattegat.create();

// Activate storage
kattegat.store.start();

// Add realtime
kattegat.realtime.start();

// Reload when we change the sources
livereload(app);

// Start the server
server.listen(app.get('port'), function() {
  console.log('');
  console.log('    \\    /\\');
  console.log('     )  ( \')    module3 has started;');
  console.log('     (  /  )    access it from one of these addresses');
  console.log('      \\(__)|');
  kattegat.util.hintUrls(app.get('port'));
  if (startTunnel) {
    ngrok.connect(app.get('port'), function (err, url) {
      if (err) console.log("Error starting tunnel: " + err);
      else console.log("\t\t" + url);
      console.log("\n Press CTRL+C to stop your server.")
    });
  } else {
    console.log('\n To access your server from another device, make sure it\'s on the same network.')
    console.log("\n Start instead with 'npm start tunnel' to access your server from remotely via HTTPS")
    console.log("\n Press CTRL+C to stop your server.")
  }
  
});
