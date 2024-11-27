const express = require("express");
require("dotenv").config();
const userroute = require('./routes/user.js')
const { ConnectionDB } = require('./connection');
const { validation } = require('./services/userServices.js')

const app = express();
const port = process.env.PORT;
ConnectionDB(process.env.MONGO_URL)


app.use(express.json());
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: 'Invalid JSON' });
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: false }));

app.use('/user', userroute);

app.listen(port, () => {
  console.log(`server started at port ${port}`)
})
