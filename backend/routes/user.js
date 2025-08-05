const express = require("express");
const zod = require("zod");
const { userData, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleWare = require("../middleware");

const userRouter = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

userRouter.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res
      .status(411)
      .json({ message: "Email already taken / Incorrect inputs" });
  }

  const existingUser = await userData.findOne({ username: req.body.username });

  if (existingUser) {
    return res.status(411).json({ message: "Email already taken" });
  }
  const user = await userData.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;
  const balance = 1 + Math.random() * 10000;

  await Account.create({
    userId,
    balance,
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );
  res
    .status(200)
    .json({ message: "user created successfully", token: token, user: user });
});

userRouter.post("/signin", async (req, res, next) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ message: "Invalid Credentials" });
  }
  const user = await userData.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!user) {
    return res.status(401).json("Invalid Credentials/User does not exist");
  } else {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    return res.status(200).json({ token: token, user: user });
  }
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

userRouter.put("/", authMiddleWare, async (req, res) => {
  // update password firstName , LastName
  const success = updateBody.safeParse(req.body);
  if (!success) {
    return res
      .status(411)
      .json({ message: "Error while updating information" });
  }
  await userData.updateOne({ _id: req.userId }, req.body);
  res.json({ message: "Updated successfully" });
});

userRouter.get("/bulk", authMiddleWare, async (req, res, next) => {
  const filter = req.query.filter || "";
  const safeFilter = filter.replace(/\\$/, ""); 
  const users = await userData.find({
    $or: [
      {
        firstName: {
          $regex: safeFilter,
        },
      },
      {
        lastName: {
          $regex: safeFilter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = userRouter;
