const { User } = require("../model/users");
const bcrypt = require("bcrypt");
const { Card } = require("../model/cards");

const users = [
  {
    name: {
      first: "Sorbe",
      middle: "Shush",
      last: "Tut",
    },
    phone: "05455590112",
    email: "sorbe@tut.com",
    password: "Tutiland1234!",
    image: {
      url: "",
      alt: "",
    },
    address: {
      country: "israel",
      city: "tel-aviv",
      street: "maurois",
      houseNumber: 20,
    },
    isBusiness: false,
    isAdmin: false,
  },
  {
    name: {
      first: "Eden",
      middle: "",
      last: "Kalderon",
    },
    phone: "0545513221",
    email: "eden@kalderon.com",
    password: "Kalderon123456!",
    image: {
      url: "",
      alt: "",
    },
    address: {
      country: "israel",
      city: "rishon-le-zion",
      street: "maurois",
      houseNumber: 4,
    },
    isBusiness: true,
    isAdmin: false,
    blockDate: new Date(),
    loginHits: 0,
  },
  {
    name: {
      first: "Lady",
      middle: "",
      last: "Schneider",
    },
    phone: "05455590111",
    email: "lady@lady.com",
    password: "Lady123456!",
    image: {
      url: "",
      alt: "",
    },
    address: {
      country: "israel",
      city: "tel-aviv",
      street: "maurois",
      houseNumber: 4,
    },
    isBusiness: false,
    isAdmin: true,
  },
];

const cards = [
  {
    title: "dubi shamen",
    subtitle: "a test ",
    description: "a test value for new card test value for new card",
    phone: "012-3211234",
    email: "qwe@gmail.com",
    web: "www://bing.com",
    image: {
      url: "",
      alt: "image of something",
    },
    address: {
      state: "IL",
      country: "Israel",
      city: "Arad",
      street: "Shoham",
      houseNumber: 5,
      zip: 23,
    },
    bizNumber: 100,
    user_id: "682b15812022cc6547607398",
  },
  {
    title: "A whole new world",
    subtitle: "fasntastik ",
    description: "a test value for new card test value for new card",
    phone: "012-3211234",
    email: "qwe@gmail.com",
    web: "www://bing.com",
    image: {
      url: "",
      alt: "image of something",
    },
    address: {
      state: "IL",
      country: "Israel",
      city: "Arad",
      street: "Shoham",
      houseNumber: 5,
      zip: 23,
    },
    bizNumber: 101,
    user_id: "682b15812022cc6547607398",
  },
  {
    title: "Aladdin",
    subtitle: "DISNEY ",
    description: "a test value for new card test value for new card",
    phone: "012-3211234",
    email: "qwe@gmail.com",
    web: "www://bing.com",
    image: {
      url: "",
      alt: "imagine the beautiful life",
    },
    address: {
      state: "IL",
      country: "Israel",
      city: "Arad",
      street: "Shoham",
      houseNumber: 5,
      zip: 23,
    },
    bizNumber: 102,
    user_id: "682b15812022cc6547607398",
  },
];

async function initialUsers() {
  await User.deleteMany();

  users.forEach(async (user) => {
    await new User({
      ...user,
      password: await bcrypt.hash(user.password, 14),
    }).save();
  });
}

async function initialCards() {
  await Card.deleteMany();
  cards.forEach(async (card) => {
    await new Card(card).save();
  });
}

module.exports = {
  initialUsers,
  initialCards,
};
