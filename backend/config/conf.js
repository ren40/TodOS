require('dotenv').config()

module.exports = function conf() {
  const port = process.env.PORT;
  const mongoDBUrl = process.env.DB_URL

  return {
    getPort: function () {
      return port;
    },
    getUrlDB: function () {
      return mongoDBUrl;
    },
  };
  
};
