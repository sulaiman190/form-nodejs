/* app.js */

// require and instantiate express 
//const app = require('express')()
//
// fake data to simulate a database
var express = require("express");
var app = express();
const { Pool, Client } = require('pg')
app.use(express.static('public'));
var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({extended: true}));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// app.post('/form', urlencodedParser, function(req, res){
//   console.log(req.body);
//   res.render('users', {data: req.body});
//   var dataIn = req.body
//   // var str = "insert into messages (title, comment) values" + (dataIn.title,dataIn.comment) + ";"
//   pool.query(str);
//   pool.end();
// });
//app.use(express.static('files'))
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/static', express.static(path.join(__dirname, 'public')))

const pool = new Pool({
  user: 'postgres', //env var: PGUSER
  host: 'localhost',  // Server hosting the postgres database
  database: 'postgres', //env var: PGDATABASE
  password: 'n3tw0rk', //env var: PGPASSWORD
  port: 5432, //PGPORT
    //max: 10, // max number of clients in the pool
  //idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
});

// https://node-postgres.com/features/connecting
var usersdata;
pool.query('select * from users', (err, res) => {
  usersdata = res.rows;
  console.log(res.rows);
  
});

var myhats;
pool.query('select * from hats', (err, res) => {
  myhats = res.rows;
  console.log(res.rows);
  
});


const query = {
  text: 'SELECT * from  users where email = $1',
  values: ['mary@gmail.com'],

};

// callback
// pool.query(query, (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
    
//     console.log(res.rows[0]) 
//   }
// })

// // promise
// pool.query(query)
//   .then(res => {
    
//     console.log(res.rows[0]) 
//   })
//   .catch(e => console.error(e.stack))

/*
pool.query('SELECT * FROM userdata WHERE email = $email', ['mary@gmail.com'],(err, res) => {
    if(err) {
      return console.error('error running query', err);
    }
  usersdata = res.rows[0];
  console.log(res.rows[0]);
  
});
*/

// app.post('/submit',function{



// //here you can use this variable to save it to database

// });


/*
// adding data to the database table
pool.query("insert into users (name, email) values('Jonny','Johndoe@gmail.com')", function(err, result) {
//should print 'INSERT: 1'
console.log('${result.command}: ${result.rowCount}');
//call done and end, same as the read example    
pool.end();
});*/

console.log(usersdata);

// set the view engine to ejs
app.set('view engine', 'ejs')

app.get('/', function(req, res){    
  res.render('list', {        
    groceries:[        
      'bananas',        
      'milk',        
      'lettuce',
      'Eggs',
      'Juice',
      'Bathing Soap'   
    ]})
});

app.get('/users', function(req, res){    
  res.render('users', {data:usersdata})
});


app.get('/hats', function(req, res){    
  res.render('hats', {myhats:myhats})
});

app.get('/', function(req, res){ 
  var name = req.body.username;
  var email = req.body.useremail;
  console.log(name, email);   
  res.render('form',{})
});

app.get('/form', function(req, res){    
  res.render('form', {})
});

console.log("test");

app.post('/form', urlencodedParser, function(req, res) {
    console.log(req.body.username);
    console.log(req.body.useremail);
    res.render('test-page', {data: req.body});

// saving data to database

var insert = "insert into users (name, email) values('" + req.body.username + "', '"+req.body.useremail+"');";
pool.query(insert);
pool.end();
});

/*

// blog home page
app.get('/', (req, res) => {
  // render `home.ejs` with the list of posts
  res.render('home', { posts: posts })
});

// blog post
app.get('/post/:id', (req, res) => {
  // find the post in the `posts` array
  const post = posts.filter((post) => {
    return post.id == req.params.id
  })[0]

  // render the `post.ejs` template with the post content
  res.render('post', {
    author: post.author,
    title: post.title,
    body: post.body
  })
})*/

app.listen(8080)

console.log('listening on port 8080');