const  express = require('express');
const { Agent } = require('http');
const app = express();
const port = 3000;

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
app.use(express.json());
const options = {
  swaggerDefinition: {
   info: {
       title: 'Personal Budget API',
       version: '1.0.0',
       description: 'Personal Budget API autogenerated by Swagger'
   },
   host: 'localhost:3000',
   basePath: '/',
  },
  apis: ['./routes.js'],
};

app.use(cors());
const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
require('./routes')(app);
app.listen(port,  () => {
  console.log('app is listening at http://localhost:'+port)
});