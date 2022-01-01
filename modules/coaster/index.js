module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Coaster',
    publicApiProjection: {
      title: 1,
      slug: 1,
      _url: 1,
      _park: 1,
      _manufacturer: 1,
      images: 1,
      drop: 1,
      height: 1,
      speed: 1,
      inversions: 1
    },
    piecesFilters: [
      { name: 'park' }
    ]
  },
  fields: {
    add: {
      images: {
        label: 'Images',
        type: 'area',
        options: {
          widgets: {
            '@apostrophecms/image': {}
          }
        }
      },
      height: {
        type: 'float',
        label: 'Height'
      },
      drop: {
        type: 'float',
        label: 'Drop'
      },
      length: {
        type: 'float',
        label: 'Length'
      },
      speed: {
        type: 'float',
        label: 'Speed'
      },
      inversions: {
        type: 'integer',
        label: 'Inversions'
      },
      openedDate: {
        type: 'date',
        label: 'Opened'
      },
      _park: {
        type: 'relationship',
        label: 'Park',
        withType: 'park',
        max: 1
      },
      _manufacturer: {
        type: 'relationship',
        label: 'Manufacturer',
        withType: 'manufacturer',
        max: 1
      },
      _type: {
        type: 'relationship',
        label: 'Type',
        withType: 'coasterType',
        max: 1
      },
      _train: {
        type: 'relationship',
        label: 'Train',
        withType: 'coasterTrain'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [ 'title', 'openedDate', 'images', 'drop', 'height', 'length', 'speed', 'inversions' ]
      },
      relationships: {
        label: 'Relationships',
        fields: [ '_park', '_manufacturer', '_type', '_train' ]
      }
    }
  },
  routes(self) {
    return {
      get: {
        async newest(req, res) {
          try {
            const sorted = await self.find(req, { title: 'Twisted Timbers' }, { title: 1 }).sort({ openedDate: -1 }).toArray();
            console.log(sorted);
            return res.json(sorted);
          } catch (e) {
            console.log(e);
            return res.status(500).json({
              error: true,
              message: 'Something went wrong, and it was our fault!'
            });
          }
        },
        async image(req, res) {
          try {
            const id = req.query.id;
            const coaster = await self.find(req, { _id: id }).toObject();

            return res.status(200).json({
              error: false,
              data: {
                coasterId: id,
                url: self.apos.attachment.url(self.apos.image.first(coaster.images))
              }
            });
          } catch (e) {
            console.log(e);
            return res.status(404).json({
              error: true,
              message: 'The coaster could not be found'
            });
          }
        }
      }
    };
  }
};
