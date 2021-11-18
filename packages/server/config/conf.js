module.exports =  function conf() {
  const port = process.env.PORT || 5000;
  const login = "****";
  const password = "*****";
  const urlCluster = "****.**.***.**";
  const nameDataBase = "***";
  const mongoDBUrl = `mongodb+srv://${login}:${password}@${urlCluster}/${nameDataBase}?retryWrites=true&w=majority`;

  return {
    getPort: function () {
      return port;
    },
    getUrlDB: function () {
      return mongoDBUrl;
    },
  };
}
