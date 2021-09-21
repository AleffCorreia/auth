import express from 'express';
import routes from './routes';
import './database/connection';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port 3001');
});
