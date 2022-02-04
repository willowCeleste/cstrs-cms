module.exports = {
  routes(self) {
    return {
      get: {
        async suggestion(req, res) {
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
              let docs = await self.apos.doc.find(req, {
                $or: types,
                title: { $regex: req.query.s, $options: 'i' }
              }).project({
                _id: 1,
                title: 1,
                type: 1,
                parkIds: 1,
                _park: 1,
                images: 1
              }
              ).toArray();
              docs = docs.map(doc => {
                if (doc.images && doc.images.items.length) {
                  doc.thumbnail = self.apos.attachment.url(self.apos.image.first(doc.images));
                }
                console.log(doc);
                return doc;
              });
              return res.json(docs);
            } catch (e) {
              console.log(e);
            }
          } else {
            return res.json([]);
          }
        },
        async advanced(req, res) {
          const query = req.query;
          const search = {
            type: 'coaster',
            manufacturerIds: query.manufacturer,
            parkIds: query.park,
            height: { $gte: 180 }
          };
          try {
            const docs = await self.apos.doc.find(req, search).project({ images: 0 }).toArray();
            return res.json({
              results: docs
            });
          } catch (e) {
            return res.status(500).json({
              error: true,
              message: 'Something went wrong!'
            });
          }
        }
      }
    };
  }
};
