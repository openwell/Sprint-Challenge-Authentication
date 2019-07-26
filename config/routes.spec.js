const server = require("../api/server");
const request = require("supertest");
const db = require("../database/dbConfig");

beforeAll(async () => {
  await db("users").truncate();
});

describe("user should login and return token", () => {
  it("[POST] /register", () => {
    return request(server)
      .post("/api/register")
      .send({ username: "TomBradly", password: "123456" })
      .expect(201)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body.data.id).toEqual(expect.any(Number));
        expect(res.body.data).toHaveProperty("username");
        expect(res.body.data).toHaveProperty("password");
      });
  });
  it("[POST] /login", done => {
    return request(server)
      .post("/api/login")
      .send({ username: "TomBradly", password: "123456" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).toHaveProperty("token");
        done();
      });
  });

  // it("responds with json", function(done) {
  //   request(server)
  //     .get("/api/jokes")
  //     .set('Authorization', token)
  //     .set("Accept", "application/json")
  //     .expect("Content-Type", /json/)
  //     .expect(200, done);
  // });
});
