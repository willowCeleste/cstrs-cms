module.exports = {
  routes(self) {
    return {
      get: {
        async suggestion(req, res) {
          console.log(req.query);
          let types = [
            { type: 'coaster' },
            { type: 'park' }
          ];

          if (req.query.type) {
            types = [
              { type: req.query.type }
            ];
          }

          if (req.query.s.length >= 3) {
            try {
              const docs = await self.apos.doc.find(req, {
                $or: types,
                title: { $regex: req.query.s, $options: 'i' }
              }).project({
                _id: 1,
                title: 1,
                type: 1,
                parkIds: 1,
                _park: 1
              }
              ).toArray();
              return res.json(docs);
            } catch (e) {
              console.log(e);
            }
          } else {
            return res.json([]);
          }
        }
      }
    };
  }
};
