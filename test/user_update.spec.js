const expect = require("chai").expect,
  { random, name } = require("faker"),
  { mockPostRequest, mockPatchRequest } = require("./test_api_requests.spec");

describe("When updating a user in the database", () => {
  let newUser, userName, userAge, userHeight;
  before(async () => {
    userName = name.firstName();
    userAge = random.number();
    userHeight = `${random.number()}ft`;
    newUser = await mockPostRequest({ userHeight, userAge, userName });
    newUser = newUser.body;
  });

  context("when updating a user's name", () => {
    it("should validate that the user's name has been updated", async () => {
      const {
        body: { username: updatedUserName },
      } = await mockPatchRequest(newUser.id, { username: name.firstName() });
      expect(updatedUserName).to.not.be.equal(newUser.username);
    });
  });

  context("when updating a user's age and height", () => {
    it("should validate that the user's age and height have been updated", async () => {
      const {
        body: { age: updatedAge, height: updatedHeight }
      } = await mockPatchRequest(newUser.id, { height: `${random.number()}ft`, age: random.number() });
      expect(updatedHeight).to.not.be.equal(newUser.height);
      expect(updatedAge).to.not.be.equal(newUser.age);
    });
  });
});

let falseMockPatchRequest;

before(async () => {
  falseMockPatchRequest = await mockPatchRequest(0, { username: "mike" });
});

describe("When trying to update a user that is not in the database", () => {
  it("a status code of 404 should be received", () => {
    expect(falseMockPatchRequest.error.status).to.equal(404);
  });

  it("an error message of 'This user does not exist.' should be received", () => {
    expect(falseMockPatchRequest.error.text).to.equal("This user does not exist.")
  });
});
