module.exports = {
  routes(self) {
    return {
      get: {
        async suggestion(req, res) {
          return res.json({ message: 'okay!' });
        }
      }
    };
  }
};
