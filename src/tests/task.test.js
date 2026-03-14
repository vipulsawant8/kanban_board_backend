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
    email: "tasks@test.com",
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
    throw new Error("Login failed during task test setup");
  }
});

afterEach(async () => {
  await Task.deleteMany();
  await List.deleteMany();
});

describe("Tasks API", () => {

  test("should fetch tasks", async () => {

    const user = await User.findOne({ email: userData.email });

    const list = await List.create({
      title: "List",
      authorID: user._id,
      position: 0
    });

    await Task.create([
      { title: "Task A", listID: list._id, authorID: user._id, position: 0 },
      { title: "Task B", listID: list._id, authorID: user._id, position: 1 }
    ]);

    const res = await agent.get("/api/v1/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  test("should create task", async () => {

    const user = await User.findOne({ email: userData.email });

    const list = await List.create({
      title: "Task List",
      authorID: user._id,
      position: 0
    });

    const res = await agent
      .post("/api/v1/tasks")
      .send({
        title: "New Task",
        description: "Test description",
        listID: list._id
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("New Task");
  });

  test("should update task", async () => {

    const user = await User.findOne({ email: userData.email });

    const list = await List.create({
      title: "Update List",
      authorID: user._id,
      position: 0
    });

    const task = await Task.create({
      title: "Old Task",
      description: "Old",
      listID: list._id,
      authorID: user._id,
      position: 0
    });

    const res = await agent
      .patch(`/api/v1/tasks/${task._id}`)
      .send({
        title: "Updated Task",
        description: "Updated description"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated Task");
  });

  test("should delete task", async () => {

    const user = await User.findOne({ email: userData.email });

    const list = await List.create({
      title: "Delete List",
      authorID: user._id,
      position: 0
    });

    const task = await Task.create({
      title: "Delete Task",
      listID: list._id,
      authorID: user._id,
      position: 0
    });

    const res = await agent.delete(`/api/v1/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);

    const deleted = await Task.findById(task._id);
    expect(deleted).toBeNull();
  });

  test("should reorder tasks", async () => {

    const user = await User.findOne({ email: userData.email });

    const list = await List.create({
      title: "Reorder List",
      authorID: user._id,
      position: 0
    });

    const task1 = await Task.create({
      title: "Task 1",
      listID: list._id,
      authorID: user._id,
      position: 0
    });

    const task2 = await Task.create({
      title: "Task 2",
      listID: list._id,
      authorID: user._id,
      position: 1
    });

    const res = await agent
      .patch("/api/v1/tasks/reorder")
      .send({
        tasksOrder: [
          { _id: task1._id, listID: list._id, position: 1 },
          { _id: task2._id, listID: list._id, position: 0 }
        ]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

});