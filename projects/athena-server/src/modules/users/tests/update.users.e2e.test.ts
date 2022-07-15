import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testMalformedData} from "../../../../tests/e2e/common/test-malformed-data";
import {testInvalidDataTypes} from "../../../../tests/e2e/common/test-invalid-data-types";
import {testUsers} from "../../../../tests/test-data";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";
import {AthenaErrorIdentifiers} from "../../../error-identifiers";
import {expectUnauthorized} from "../../../../tests/e2e/common/expect-unauthorized";
import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";
import {expectForbidden} from "../../../../tests/e2e/common/expect-forbidden";


describe('Update User - /v1/users/:id [PATCH]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  describe('Success Cases', () => {

    it('When authorized as the user to update, the response should succeed and return the updated user', async () => {
      const dataToUpdate = {
        username: "updatedusername",
        email: "udpated@example.com",
        password: "updatedpassword",
        encryptionSecret: "updated"
      };

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(dataToUpdate);

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        id: testUsers[0].id,
        username: dataToUpdate.username,
        email: dataToUpdate.email,
        isVerified: testUsers[0].isVerified,
        encryptionSecret: dataToUpdate.encryptionSecret,
        createdAt: testUsers[0].createdAt,
        updatedAt: expect.any(String) // this will have been updated, so just check it's still present
      }))
    })

    it('When updating a user, the updatedAt timestamp should become more recent', async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send({email: "udpated@example.com"});

      expect(statusCode).toEqual(HTTPStatusCodes.OK);

      const previousTimestamp = new Date(testUsers[0].updatedAt);
      const updatedTimestamp = new Date(body.updatedAt);

      expect(updatedTimestamp.getTime()).toBeGreaterThan(previousTimestamp.getTime())
    })
  });

  describe('Invalid Authentication', () => {
    it('When unauthorized, the request should fail', async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .send({username: "updatedusername"});

      expectUnauthorized(body, statusCode);
    })

    it('When authorized as a different user to the one to update, the request should fail', async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[1].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send({username: "updatedusername"});

      expectForbidden(body, statusCode);
    })

    it("When updating a user that doesn't exist, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send({username: "updatedusername"});

      expectForbidden(body, statusCode);
    })

    it("When passing an invalid ID, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/invalid`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send({username: "updatedusername"});

      expectBadRequest(body, statusCode, ErrorIdentifiers.USER_REQUEST_INVALID);
    })
  });

  describe('None Unique Data', () => {
    it('When using an existing username, the request should fail', async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send({username: testUsers[1].username});

      expectBadRequest(body, statusCode, AthenaErrorIdentifiers.USER_USERNAME_EXISTS);
    })

    it('When using an existing email, the request should fail', async () => {
      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send({email: testUsers[1].email});

      expectBadRequest(body, statusCode, AthenaErrorIdentifiers.USER_EMAIL_EXISTS);
    })
  });

  describe('Data Validation', () => {
    it('When using an invalid email, the request should fail', async () => {
      const updatesUser = {
        email: "invalid-email"
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(updatesUser);

      expectBadRequest(body, statusCode)
    })

    it("When using a password that's too short, the request should fail", async () => {
      const updatedUser = {
        password: "hi"
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(updatedUser );

      expectBadRequest(body, statusCode)
    })

    it("When supplying an empty username, the request should fail", async () => {
      const updatedUser = {
        username: ""
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(updatedUser);

      expectBadRequest(body, statusCode)
    })

    it("When using a username that's too long, the request should fail", async () => {
      const updatedUser = {
        username: "this-is-a-username-which-is-over-the-maximum"
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(updatedUser);

      expectBadRequest(body, statusCode)
    })
  });

  describe('Forbidden Fields', () => {
    it('When passing an ID field, the request should fail', async () => {
      const dataToUpdate = {
        id: 'a78a9859-314e-44ec-8701-f0c869cfc07f'
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(dataToUpdate);

      expectBadRequest(body, statusCode);
    })

    it('When passing a createdAt field, the request should fail', async () => {
      const dataToUpdate = {
        createdAt: '2022-07-11T18:20:32.482Z'
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(dataToUpdate);

      expectBadRequest(body, statusCode);
    })

    it('When passing an updatedAt field, the request should fail', async () => {
      const dataToUpdate = {
        updatedAt: '2022-07-11T18:20:32.482Z'
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(dataToUpdate);

      expectBadRequest(body, statusCode);
    })

    it('When passing an isVerified field, the request should fail', async () => {
      const dataToUpdate = {
        isVerified: true
      }

      const {body, statusCode} = await testHelper.client
        .patch(`/v1/users/${testUsers[0].id}`)
        .set("Authorization", `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`)
        .send(dataToUpdate);

      expectBadRequest(body, statusCode);
    })
  })

  describe('Invalid Data', () => {
    it("When supplying invalid JSON data, the request should fail", async () => {
      await testMalformedData({
        clientFunction: testHelper.client.patch.bind(testHelper.client),
        endpoint: `/v1/users/${testUsers[0].id}`,
        accessToken: testHelper.getUserAccessToken(testUsers[0].id)
      })
    })

    describe("When not supplying username as a string, the request should fail",
      testInvalidDataTypes({
        requestFunction: testHelper.client.patch.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: `/v1/users/${testUsers[0].id}`,
        data: {},
        testFieldKey: "username",
        testCases: [1, 1.5, true, null, {test: 'yes'}, [1, 2]]
      })
    )

    describe("When not supplying email as a string, the request should fail",
      testInvalidDataTypes({
        requestFunction: testHelper.client.patch.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: `/v1/users/${testUsers[0].id}`,
        data: {},
        testFieldKey: "email",
        testCases: [1, 1.5, true, null, {test: 'yes'}, [1, 2]]
      })
    )

    describe("When not supplying password as a string, the request should fail",
      testInvalidDataTypes({
        requestFunction: testHelper.client.patch.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: `/v1/users/${testUsers[0].id}`,
        data: {},
        testFieldKey: "password",
        testCases: [1, 1.5, true, null, {test: 'yes'}, [1, 2]]
      })
    )

    describe("When not supplying encryptionSecret as a string, the request should fail",
      testInvalidDataTypes({
        requestFunction: testHelper.client.patch.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: `/v1/users/${testUsers[0].id}`,
        data: {},
        testFieldKey: "encryptionSecret",
        testCases: [1, 1.5, true, null, {test: 'yes'}, [1, 2]]
      })
    )
  })
})
