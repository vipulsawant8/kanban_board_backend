import request from "supertest";
import app from "../app.js";

import User from "../models/user.model.js";
import List from "../models/list.model.js";
import Task from "../models/task.model.js";

let agent;
let userData;
let deviceId = "da429af5-9bb7-4d18-9265-6d9442ac6cc8";

beforeAll(async () => {

  agent = request.agent(app);

  userData = {
    email: "lists@test.com",
    name: "Test User",
    password: "Password123!"
  };

  const user = new User({
    ...userData,
    isVerified: true
  });

  await user.save();

  const loginRes = await agent
    .post("/api/v1/auth/login")
    .send({
      identity: userData.email,
      password: userData.password,
      deviceId
    });

  if (loginRes.statusCode !== 200) {
    throw new Error("Login failed during list test setup");
  }
});

afterEach(async () => {
  await List.deleteMany();
  await Task.deleteMany();
});

describe("Lists API", () => {

  test("should fetch lists", async () => {

    const user = await User.findOne({ email: userData.email });

    await List.create([
      { title: "List A", authorID: user._id, position: 0 },
      { title: "List B", authorID: user._id, position: 1 }
    ]);

    const res = await agent.get("/api/v1/lists");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  test("should create list", async () => {

    const res = await agent
      .post("/api/v1/lists")
      .send({ title: "New List" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("New List");
  });

  test("should update list", async () => {

    const user = await User.findOne({ email: userData.email });

    const list = await List.create({
      title: "Old",
      authorID: user._id,
      position: 0
    });

    const res = await agent
      .patch(`/api/v1/lists/${list._id}`)
      .send({ title: "Updated" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated");
  });

  test("should delete list", async () => {

    const user = await User.findOne({ email: userData.email });

    const list = await List.create({
      title: "Delete",
      authorID: user._id,
      position: 0
    });

    const res = await agent.delete(`/api/v1/lists/${list._id}`);

    expect(res.statusCode).toBe(200);
  });

});