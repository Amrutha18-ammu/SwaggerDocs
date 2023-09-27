const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routers/personRouter.js']

swaggerAutogen(outputFile, endpointsFiles)