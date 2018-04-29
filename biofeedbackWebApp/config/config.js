var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    baseUrl: "/",
    ip: "localhost",
    root: rootPath,
    app: {
      name: 'st0263-proyecto2'
    },
    port: process.env.PORT || 3003,
    db: 'mongodb://localhost/st0263-proyecto2-development'
  },

  test: {
    baseUrl: "/vquinte3/",
    ip: "10.131.137.188",
    root: rootPath,
    app: {
      name: 'st0263-proyecto2'
    },
    port: process.env.PORT || 3003,
    db: 'mongodb://localhost/st0263-proyecto2-test'
  },

  production: {
    baseUrl: "/",
    ip: "10.131.137.188",
    root: rootPath,
    app: {
      name: 'st0263-proyecto2'
    },
    port: process.env.PORT || 5000,
    db: 'mongodb://vquinte3:lenovo12@ds133670.mlab.com:33670/yt2'
  }
};

module.exports = config[env];
