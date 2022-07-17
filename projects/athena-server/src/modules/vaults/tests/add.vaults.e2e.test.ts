import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testData, testUsers} from "../../../../tests/test-data";
import {HTTPStatusCodes} from "@kangojs/core";
import {expectUnauthorized} from "../../../../tests/e2e/common/expect-unauthorized";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";
import {AthenaErrorIdentifiers} from "../../../common/error-identifiers";
import {testMissingField} from "../../../../tests/e2e/common/test-missing-field";
import {testInvalidDataTypes} from "../../../../tests/e2e/common/test-invalid-data-types";
import {testMalformedData} from "../../../../tests/e2e/common/test-malformed-data";


describe('Add Vault - /v1/vaults [POST]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});9
  afterAll(async () => {await testHelper.afterAll()});

  describe('Success Cases', () => {
    test("When adding a valid vault, the new vault should be returned", async () => {
      const newTestVault = {
        name: "New Test Vault"
      }
      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: newTestVault.name,
        description: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }))
    })

    test("When adding a valid vault with a description, the new vault should be returned", async () => {
      const newTestVault = {
        name: "New Test Vault",
        description: "this is a test"
      }
      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: newTestVault.name,
        description: newTestVault.description,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }))
    })
  })

  describe('Invalid Authentication', () => {
    test("When unauthorized, the request should fail", async () => {
      const newTestVault = {
        name: "New Test Vault"
      }
      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .send(newTestVault)

      expectUnauthorized(body, statusCode);
    })
  })

  describe('None Unique Data', () => {
    test("When adding a vault with a duplicate name within the user's account, the request should fail", async () => {
      const newTestVault = {
        name: testData[testUsers[0].id].vaults[0].name
      }

      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expectBadRequest(body, statusCode, AthenaErrorIdentifiers.VAULT_NAME_EXISTS);
    })

    test("When adding a vault with a duplicate name from a different user's account, the new vault should be returned", async () => {
      const newTestVault = {
        name: testData[testUsers[1].id].vaults[1].name
      }

      const {statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })
  })

  describe('Data Validation', () => {
    test("When supplying an empty vault name, the request should fail", async () => {
      const newTestVault = {
        name: ""
      }

      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expectBadRequest(body, statusCode);
    })

    test("When supplying a vault name of exactly 1 character, the new vault should be returned", async () => {
      const newTestVault = {
        name: "a"
      }

      const {statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })

    test("When supplying a vault name that's too long, the request should fail", async () => {
      const newTestVault = {
        name: "this-vault-name-is-going-to-be-longer-than-100-characters-which-is-the-limit-of-a-vault-names-length-so-it-should-fail"
      }

      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expectBadRequest(body, statusCode);
    })

    test("When supplying a vault name of exactly 100 characters, the new vault should be returned", async () => {
      const newTestVault = {
        name: "this-vault-name-is-going-to-be-exactly-100-characters-so-it-should-still-work-as-a-valid-name-aaaaaa"
      }

      const {statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })

    test("When supplying a description of exactly 255 characters, the new vault should be returned", async () => {
      const newTestVault = {
        name: "new test vault",
        description: "this description is exactly 255 chars... trust me on this one. rekjheh guig uzhr gz griur izgr ozh oehklzeg79zrlgtega tosheht eoat kshrgu fkjsb diugb rug jbkg oudhgea rbtg outhero uthjek hoerhr kjbr oerhg e eouhg te uerherutge;ugte;rugterutgerk;ugterugtug"
      }

      const {statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })

    test("When supplying a description that's too long, the request should fail", async () => {
      const newTestVault = {
        name: "new test vault",
        description: "this description is more than 255 chars... trust me on this one. rekjheh guig uzhr gz griur izgr ozh oehklzeg79zrlgtega tosheht eoat kshrgu fkjsb diugb rug jbkg oudhgea rbtg outhero uthjek hoerhr kjbr oerhg e eouhg te uerherutge;ugte;rugterutgerk;ugterugtug hrefvlkaevg rg"
      }

      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expectBadRequest(body, statusCode);
    })
  })

  describe('Required Fields', () => {
    test("When not supplying a vault name, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        endpoint: "/v1/vaults",
        accessToken: testHelper.getUserAccessToken(testUsers[0]),
        testFieldKey: "name",
        data: {}
      })
    })
  })

  describe('Forbidden Fields', () => {
    test("When supplying an explicit ID field, the request should fail", async () => {
      const newTestVault = {
        id: "91c925e8-440d-4282-9c29-40020a284b32",
        name: "new test vault",
      }

      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expectBadRequest(body, statusCode);
    })

    test("When supplying an explicit owner field, the request should fail", async () => {
      const newTestVault = {
        owner: testUsers[0].id,
        name: "new test vault",
      }

      const {body, statusCode} = await testHelper.client
        .post('/v1/vaults')
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(newTestVault)

      expectBadRequest(body, statusCode);
    })
  })

  describe('Invalid Data', () => {
    test("When supplying invalid JSON data, the request should fail", async () => {
      await testMalformedData({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        endpoint: "/v1/vaults",
        accessToken: testHelper.getUserAccessToken(testUsers[0]),
      })
    })

    describe("When not supplying name as a string, the request should fail", testInvalidDataTypes({
      clientFunction: testHelper.client.post.bind(testHelper.client),
      endpoint: "/v1/vaults",
      accessToken: testHelper.getUserAccessToken(testUsers[0]),
      testFieldKey: "name",
      data: {},
      testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
    }))

    describe("When not supplying description as a string, the request should fail", testInvalidDataTypes({
      clientFunction: testHelper.client.post.bind(testHelper.client),
      endpoint: "/v1/vaults",
      accessToken: testHelper.getUserAccessToken(testUsers[0]),
      testFieldKey: "description",
      data: {
        name: "new test vault"
      },
      testCases: [1, 1.5, true, {test: 'yes'}, [1, 2]]
    }))
  })
})
