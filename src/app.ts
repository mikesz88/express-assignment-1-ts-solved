import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";

const app = express();
app.use(express.json());
// All code should go below this line

// * Index
app.get("/dogs", async (req, res) => {
  const dogs = await prisma.dog.findMany();
  if (!dogs) {
    return res
      .status(400)
      .send({ error: "There was an error" });
  }

  return res.status(200).send(dogs);
});

// * Show Specific Dog
app.get("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const dog = await prisma.dog.findUnique({
    where: {
      id,
    },
  });

  if (!dog) {
    return res
      .status(400)
      .send({ error: "There was an error" });
  }

  return res.status(200).send(dog);
});

// * Create dog
app.post("/dogs", async (req, res) => {
  const body = req.body;

  if (!body) {
    return res
      .status(400)
      .send({ error: "There was an error" });
  }

  try {
    const dog = await prisma.dog.create({
      data: body,
    });
    return res.status(201).send(dog);
  } catch (error) {
    return res
      .status(400)
      .send({ errorMessage: "There was an error", error });
  }
});

// * Update Dog
app.patch("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const body = req.body;

  if (!body || !id) {
    return res
      .status(400)
      .send({ error: "There was an error" });
  }

  try {
    const dog = await prisma.dog.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    res.status(200).send(dog);
  } catch (error) {
    res
      .status(400)
      .send({ errorMessage: "There was an error", error });
  }
});

// * Delete Dog
app.delete("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const dog = await prisma.dog.delete({
    where: {
      id,
    },
  });

  if (!dog) {
    return res
      .status(400)
      .send({ error: "There was an error" });
  }

  return res
    .status(200)
    .send({ message: "The dog has been deleted" });
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
