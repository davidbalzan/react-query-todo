import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const todos = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    body: { title, completed },
  } = req;

  switch (method) {
    case "GET":
      const allTodos = await prisma.todo.findMany();
      res.status(200).json(allTodos);
      break;
    case "POST":
      //Create new todo
      const newTodo = await prisma.todo.create({
        data: {
          title,
          completed,
        },
      });
      res.status(200).json(newTodo);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default todos;
