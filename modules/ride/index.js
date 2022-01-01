module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Ride',
    publicApiProjection: {
      date: 1,
      _coaster: {
        _park: 1
      },
      _user: 1
    }
  },
  fields: {
    add: {
      date: {
        type: 'date',
        label: 'Date'
      },
      _coaster: {
        type: 'relationship',
        label: 'Coaster',
        withType: 'coaster',
        max: 1
      },
      _user: {
        type: 'relationship',
        label: 'User',
        withType: '@apostrophecms/user',
        max: 1
      }
    },
    group: {}
  },
  routes(self) {
    return {
      get: {
        async byuser(req, res) {
          console.log(req.query);
          const rides = await self.find(req, { userIds: req.query.id }).toArray();
          return res.json(rides);
        }
      },
      post: {
        async newride(req, res) {
          return res.send('new ride');
        }
      }
    };
  }
};

// user id - ckxc4h4xz000ja07dfvv9tioo
// dark knight id - ckxc5tnvv000inq7dlukjtal6
