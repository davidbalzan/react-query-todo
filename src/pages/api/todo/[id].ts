import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const todo = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    method,
    body: { title, completed },
  } = req;

  if (typeof id === "string") {
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      res.status(400).json({
        message: "Invalid ID",
      });
      return;
    }

    switch (method) {
      case "GET":
        const foundTodo = await prisma.todo.findUnique({
          where: { id: numericId },
        });
        res.status(200).json(foundTodo);
        break;

      case "PUT":
        //Update in your database
        const updatedTodo = await prisma.todo.update({
          where: { id: parseInt(id) },
          data: { title, completed },
        });
        res.status(200).json(updatedTodo);
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } else {
    res.status(400).json({
      message: "Invalid ID",
    });
  }
};

export default todo;
