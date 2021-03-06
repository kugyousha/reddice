import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';

import users from './routes/users';
import auth from './routes/auth';

const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true,
// }));

app.use('/api/users', users);
app.use('/api/auth', auth)

const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
}));
app.use(webpackHotMiddleware(compiler));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(3000, () => console.log(`Red Dice running on localhost:3000`));