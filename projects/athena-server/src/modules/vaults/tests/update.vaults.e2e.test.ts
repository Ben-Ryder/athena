import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testMalformedData} from "../../../../tests/e2e/common/test-malformed-data";
import {testData, testUsers} from "../../../../tests/test-data";
import {testInvalidDataTypes} from "../../../../tests/e2e/common/test-invalid-data-types";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";
import {HTTPStatusCodes} from "@kangojs/core";
import {AthenaErrorIdentifiers} from "../../../common/error-identifiers";
import {expectUnauthorized} from "../../../../tests/e2e/common/expect-unauthorized";
import {expectForbidden} from "../../../../tests/e2e/common/expect-forbidden";


describe('Update Vault - /v1/vaults/:id [PATCH]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  describe('Success Cases', () => {
    test("When updating the vault as the owner, the updated vault should be returned", async () => {
      const vaultUpdate = {
        name: "Updated Test Vault"
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send(vaultUpdate)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        id: testData[testUsers[0].id].vaults[0].id,
        name: vaultUpdate.name,
        description: testData[testUsers[0].id].vaults[0].description,
        createdAt: testData[testUsers[0].id].vaults[0].createdAt,
        updatedAt: expect.any(String)
      }))
    })

    test('When updating a vault, the updatedAt timestamp should become more recent', async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: "Updated Test Vault"
        })

      expect(statusCode).toEqual(HTTPStatusCodes.OK);

      const previousTimestamp = new Date(testUsers[0].updatedAt);
      const updatedTimestamp = new Date(body.updatedAt);

      expect(updatedTimestamp.getTime()).toBeGreaterThan(previousTimestamp.getTime())
    })
  })

  describe('Invalid Authentication', () => {
    test("When unauthorized, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .send({
          name: "Updated Test Vault"
        })

      expectUnauthorized(body, statusCode);
    })

    test("When attempting to update the vault as a user that isn't the owner, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[1])}`)
        .send({
          name: "Updated Test Vault"
        })

      expectForbidden(body, statusCode);
    })
  })

  describe('None Unique Data', () => {
    test("When updating a vault with a duplicate name within the user's account, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: testData[testUsers[0].id].vaults[1].name
        })

      expectBadRequest(body, statusCode, AthenaErrorIdentifiers.VAULT_NAME_EXISTS);
    })

    test("When updating a vault with a duplicate name from a different user's account, the updated vault should be returned", async () => {
      const {statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: testData[testUsers[1].id].vaults[0].name
        })

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })
  })

  describe('Data Validation', () => {
    test("When supplying an empty vault name, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: ""
        })

      expectBadRequest(body, statusCode);
    })

    test("When supplying a vault name of exactly 1 character, the updated vault should be returned", async () => {
      const {statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: "a"
        })

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })

    test("When supplying a vault name that's too long, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: "this-vault-name-is-going-to-be-longer-than-100-characters-which-is-the-limit-of-a-vault-names-length-so-it-should-fail"
        })

      expectBadRequest(body, statusCode);
    })

    test("When supplying a vault name of exactly 100 characters, the updated vault should be returned", async () => {
      const {statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: "this-vault-name-is-going-to-be-exactly-100-characters-so-it-should-still-work-as-a-valid-name-aaaaaa"
        })

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })

    test("When supplying a description of exactly 255 characters, the updated vault should be returned", async () => {
      const {statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: "new test vault",
          description: "this description is exactly 255 chars... trust me on this one. rekjheh guig uzhr gz griur izgr ozh oehklzeg79zrlgtega tosheht eoat kshrgu fkjsb diugb rug jbkg oudhgea rbtg outhero uthjek hoerhr kjbr oerhg e eouhg te uerherutge;ugte;rugterutgerk;ugterugtug"
        })

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })

    test("When supplying a description that's too long, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          name: "new test vault",
          description: "this description is more than 255 chars... trust me on this one. rekjheh guig uzhr gz griur izgr ozh oehklzeg79zrlgtega tosheht eoat kshrgu fkjsb diugb rug jbkg oudhgea rbtg outhero uthjek hoerhr kjbr oerhg e eouhg te uerherutge;ugte;rugterutgerk;ugterugtug hrefvlkaevg rg"
        })

      expectBadRequest(body, statusCode);
    })
  })

  describe('Forbidden Fields', () => {
    test("When supplying an explicit ID field, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          id: "91c925e8-440d-4282-9c29-40020a284b32",
        })

      expectBadRequest(body, statusCode);
    })

    test("When supplying an explicit owner field, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)
        .send({
          owner: testUsers[1].id,
        })

      expectBadRequest(body, statusCode);
    })
  })

  describe('Invalid Data', () => {
    test("When supplying invalid JSON data, the request should fail", async () => {
      await testMalformedData({
        clientFunction: testHelper.client.patch.bind(testHelper.client),
        endpoint: `/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`,
        accessToken: testHelper.getUserAccessToken(testUsers[0]),
      })
    })

    describe("When not supplying name as a string, the request should fail", testInvalidDataTypes({
      clientFunction: testHelper.client.patch.bind(testHelper.client),
      endpoint: `/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`,
      accessToken: testHelper.getUserAccessToken(testUsers[0]),
      testFieldKey: "name",
      data: {},
      testCases: [1, 1.5, true, null, {test: 'yes'}, [1, 2]]
    }))

    describe("When not supplying description as a string, the request should fail", testInvalidDataTypes({
      clientFunction: testHelper.client.patch.bind(testHelper.client),
      endpoint: `/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`,
      accessToken: testHelper.getUserAccessToken(testUsers[0]),
      testFieldKey: "description",
      data: {
        name: "new test vault"
      },
      testCases: [1, 1.5, true, {test: 'yes'}, [1, 2]]
    }))
  })
})
