export const testEnvironmentVars = {
  ACCESS_TOKEN_SECRET: "ivfbaklhfvuaiebgkjearbgoebrgkjebgiskbgnbgihsbdkgbodjbgbkgjfddfd",
  REFRESH_TOKEN_SECRET: "jvbfhru9h9iuebukhreuirbghkebrgouaerkbjgbfousfashkbgrieaobferge",
  ACCESS_TOKEN_EXPIRY: "7h",
  REFRESH_TOKEN_EXPIRY: "7 days"
}

/**
 * Test users.
 * These can be used to for authentication, access control testing etc.
 */
export const testUsers = Object.freeze([
  {
    id: "90938b63-3b14-4b18-8185-b3cfa5de2d6a",
    username: "test1",
    email: "test1@example.com",
    password: "testpassword1234",
    passwordHash: "$2a$12$0Xg2rVxqQp/Ct6Y4caN8..7O47WsQGiDZA/ZxsAN8dJUGEQISd8DG",
    isVerified: true,
    encryptionKey: "todo",
    encryptionSecret: "todo",
    createdAt: "2022-07-11T18:17:43.784Z",
    updatedAt: "2022-07-11T18:20:32.482Z"
  },
  {
    id: "73852037-a8fc-42ec-bf8f-9e7314e1eabc",
    username: "test2",
    email: "test2@example.com",
    password: "amazingpassword42",
    passwordHash: "$2a$12$KrqpaXe52bMrb8jomWxg2ObOjU5s3NIYWsn37JiW4gQN6cuGtpSre",
    isVerified: true,
    encryptionKey: "todo",
    encryptionSecret: "todo",
    createdAt: "2022-07-11T18:17:43.784Z",
    updatedAt: "2022-07-11T18:17:43.784Z"
  },
  {
    id: "98f4cb22-7815-4785-b659-3285fb06dacf",
    username: "test3",
    email: "test3@example.com",
    password: "amazingpassword42",
    passwordHash: "$2a$12$KrqpaXe52bMrb8jomWxg2ObOjU5s3NIYWsn37JiW4gQN6cuGtpSre",
    isVerified: false,
    encryptionKey: "todo",
    encryptionSecret: "todo",
    createdAt: "2022-07-11 20:15:20.301649",
    updatedAt: "2022-07-11 20:34:12.274037"
  }
]);

export const testData = {
  // [testUsers[0].id]: {
  //   vaults: [],
  //   notes: [],
  //   tags: [],
  //   queries: [],
  //   noteTags: [],
  //   queryTags: []
  // },
  [testUsers[0].id]: {
    vaults: [
      {
        id: "0ae6ecb4-fea6-4689-ba08-eff2afdf67d2",
        name: "user1 Vault 1",
        description: "This is a test vault",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      },
      {
        id: "01b31e76-aac8-4c41-9a75-d9cfc6fad860",
        name: "user1 Vault 2",
        description: "This is a test vault",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      },
    ],
    notes: [],
    tags: [],
    queries: [],
    noteTags: [],
    queryTags: []
  },
  [testUsers[1].id]: {
    vaults: [
      {
        id: "def2be1e-e5e5-43ec-9537-c48d03628670",
        name: "user2 Vault 1",
        description: "This is a test vault",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[1].id
      },
      {
        id: "6afc2ee9-c5c8-4018-9d03-67fbf4a7b172",
        name: "user2 Vault 2",
        description: "This is a test vault",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[1].id
      },
    ],
    notes: [],
    tags: [],
    queries: [],
    noteTags: [],
    queryTags: []
  },
  [testUsers[2].id]: {
    vaults: [
      {
        id: "eace9d71-ce66-4254-9cf5-1799c2ea2890",
        name: "user3 Vault 1",
        description: "This is a test vault",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[2].id
      }
    ],
    notes: [],
    tags: [],
    queries: [],
    noteTags: [],
    queryTags: []
  }
};
