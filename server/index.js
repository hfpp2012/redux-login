import express from 'express';
import bodyParser from 'body-parser';

import users from './routes/users';
import auth from './routes/auth';
import events from './routes/events';
import article from './routes/article';
import currentUser from './routes/currentUser';
import auth_routes from './routes/auth_routes';

import cookieParser from 'cookie-parser'

import cors from 'cors';

let app = express();

app.use(cookieParser())
app.use(cors());

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/article', article);
app.use('/api/currentUser', currentUser)
app.use('/api/auth_routes', auth_routes)

app.get('/', (req, res) => {
  res.send('hello world');
})

app.listen(6060, () => console.log('Running on localhost:6060'));
