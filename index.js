require('dotenv').config();
const basicDebug = require('debug')('app:startup');
const dbDebug = require('debug')('app:db');
const morgan = require('morgan');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const top10 = require('./routes/top10');
const books = require('./routes/books');
const auth = require('./routes/auth');

const app = express();

const connectionString = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.address')}/${config.get('db.name')}?retryWrites=true&w=majority`;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => dbDebug('Connected to MongoDB...'))
  .catch((err) => {
    dbDebug('Could not connect to MongoDB.', err.message);
  });

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  basicDebug('Morgan enabled...')
}
app.use(express.static('public'));
app.use('/api/auth', auth);
app.use('/api/books', books);
app.use('/api/users', users);

app.use('/', top10);

const port = process.env.PORT || 3000;
app.listen(port, () => basicDebug(`Listening on port ${port}...`));