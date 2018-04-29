var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'production';

var config = {
  development: {
    baseUrl: "/",
    ip: "localhost",
    root: rootPath,
    app: {
      name: 'biofeedback'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/st0263-proyecto2-development'
  },

  test: {
    baseUrl: "/vquinte3/",
    root: rootPath,
    app: {
      name: 'biofeedback'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/st0263-proyecto2-test'
  },

  production: {
    baseUrl: "/",
    root: rootPath,
    app: {
      name: 'biofeedback'
    },
    port: process.env.PORT || 5000,
    db: 'mongodb://localhost/biofeedback'
  }
};

module.exports = config[env];
