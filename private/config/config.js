module.exports = {
  value: {
    BLACK_JOKER: 0, // 小王
    RED_JOKER: 1, // 大王
  },

  // map
  typeMap: {
    0: 'Joker',
    1: 'Spade',
    2: 'Diamond',
    3: 'Heart',
    4: 'Club',
  },

  valueMap: {
    0: 'Black',
    1: 'Red',
  },

  winRates: {
    '5K': 750,
    RS: 250,
    SF: 150,
    '4K': 60,
    FH: 10,
    FL: 7,
    ST: 5,
    '3K': 3,
    '2P': 2,
    '1P': 1,
  },

  // type
  type: {
    JOKER: 0, // 王
    SPADE: 1, // 黑桃
    DIAMOND: 2, // 方片
    HEART: 3, // 红xin
    CLUB: 4, // 梅花
  },

  pokersRate: [
    750, 250, 150, 60, 10, 7, 5, 3, 2, 1,
  ],
}
