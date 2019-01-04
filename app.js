require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
// const hbs          = require('hbs')
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport     = require('passport')
const cors         = require('cors')

const users = require("./routes/api/users");


mongoose
  .connect(process.env.DB, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });



const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//Prueba correccion en heroku cors - No funciono
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", '*');
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//   next();
// });

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());


// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cors({
  origin:["http://localhost:3002"]
}));


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';




// const index = require('./routes');
// app.use('/', index);




// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

// Para que cualquier ruta que no sea back la va a manejar React.
app.all("/*", (req,res)=>{
  res.sendFile(`${__dirname}/public/index.html`)
})

module.exports = app;
