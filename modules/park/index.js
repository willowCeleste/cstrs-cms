const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Island',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
];

module.exports = {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Park',
    publicApiProjection: {
      title: 1,
      slug: 1,
      _url: 1
    }
  },
  fields: {
    add: {
      city: {
        label: 'City',
        type: 'string'
      },
      state: {
        label: 'State',
        type: 'select',
        choices: states.map(state => {
          return {
            label: state,
            value: state
          };
        })
      },
      _coasters: {
        type: 'relationshipReverse',
        withType: 'coaster',
        reverseOf: '_park'
      }
    },
    group: {}
  },
  routes(self) {
    return {
      get: {
        async park(req, res) {
          try {
            const result = await self.find(req, { _id: req.query.id }).project({ title: 1, _coasters: 1 }).toArray();
            const park = result[0];
            park._coasters = park._coasters.map(coaster => {
              const imageUrl = self.apos.attachment.url(self.apos.image.first(coaster.images));
              return {
                _id: coaster._id,
                title: coaster.title,
                image: !imageUrl.endsWith('missing-icon.svg') ? imageUrl : null
              };
            });
            return res.status(200).json({
              success: true,
              park
            });
          } catch (e) {
            console.log(e);
            return res.status(500).json({
              success: false,
              message: 'Internal server error'
            });
          }
        }
      }
    };
  }
};
