import {TestHelper} from "../../../../tests/e2e/test-helper";


describe('Add Vault - /v1/vaults [POST]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  describe('Success Cases', () => {
    test("When adding a valid vault, the new vault should be returned", async () => {})

    test("When adding a valid vault with a description, the new vault should be returned", async () => {})
  })

  describe('Invalid Authentication', () => {
    test("When unauthorized, the request should fail", async () => {})
  })

  describe('None Unique Data', () => {
    test("When adding a vault with a duplicate name within the user's account, the request should fail", async () => {})

    test("When adding a vault with a duplicate name from a different user's account, the new vault should be returned", async () => {})
  })

  describe('Data Validation', () => {
    test("When supplying an empty vault name, the request should fail", async () => {})

    test("When supplying a vault name of exactly 1 character, the new vault should be returned", async () => {})

    test("When supplying a vault name that's too long, the request should fail", async () => {})

    test("When supplying a vault name of exactly 100 characters, the new vault should be returned", async () => {})

    test("When supplying a description of exactly 255 characters, the new vault should be returned", async () => {})

    test("When supplying a description that's too long, the request should fail", async () => {})
  })

  describe('Required Fields', () => {
    test("When not supplying a vault name, the request should fail", async () => {})
  })

  describe('Forbidden Fields', () => {
    test("When supplying an explicit ID field, the request should fail", async () => {})

    test("When supplying an explicit owner field, the request should fail", async () => {})
  })

  describe('Invalid Data', () => {
    test("When not supplying name as a string, the request should fail", async () => {})

    test("When not supplying description as a string, the request should fail",async () => {})
  })
})
