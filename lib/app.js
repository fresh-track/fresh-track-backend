const express = require('express');
const app = express();

app.use(require('cors')({ origin:true, credentials:true }));
app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/dropbox', require('./services/dropbox'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/drive', require('./routes/drive'));
app.use('/api/v1/playlist', require('./routes/playlist'));
app.use('/api/v1/user', require('./routes/user'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
