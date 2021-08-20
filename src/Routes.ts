import { IncomingMessage, ServerResponse } from "http";

import { getTodos, createToDo, updateTodo, deleteTodo } from "./TodoController";

export function routes(req: IncomingMessage, res: ServerResponse) {
  const url = require("url");
  const urlparse = url.parse(req.url, true);

  //fetch all todos enpoint
  if (urlparse.pathname == "/todos" && req.method == "GET") {
    getTodos(res);
  }

  //create new todo
  if (urlparse.pathname == "/todos" && req.method == "POST") {
    createToDo(req, res);
  }

  //update todo
  if (urlparse.pathname == "/todos" && req.method == "PATCH") {
    updateTodo(req, res);
  }

  //delete todo
  if (urlparse.pathname == "/todos" && req.method == "DELETE") {
    deleteTodo(req, res);
  }
}
