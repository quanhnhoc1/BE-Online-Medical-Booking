const request = require("supertest");
const app = require("../app"); // Adjust this path based on your app's location

describe("Error Handling Tests", () => {
  test("should return 404 for non-existent resource", async () => {
    const response = await request(app)
      .get("/non-existent-endpoint")
      .expect(404);

    expect(response.body).toHaveProperty("message", "Resource not found");
  });
});
