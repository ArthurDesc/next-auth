// Setup spécifique pour les tests d'API
// Mock des globals Web API qui ne sont pas disponibles dans Node.js
global.Request = require('node-fetch').Request
global.Response = require('node-fetch').Response
global.Headers = require('node-fetch').Headers 