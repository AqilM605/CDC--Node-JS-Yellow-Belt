import e from "express";
import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { fetch, persistChange } from "./FileHandler";
import Todo from "./Todo";

//for id auto increment
let lastIndex: number =
  fetch().length === 0 ? 0 : fetch()[fetch().length - 1].id;

//fetch all todo
export const getTodos = (res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(fetch(), null, 2));
};

//create todo
export const createToDo = (req: IncomingMessage, res: ServerResponse) => {
  validate(req, res, (data: Todo) => {
    const newToDo = {
      id: ++lastIndex,
      description: data.description,
      deadline: data.deadline,
      done: false,
    };
    let todos: Array<Todo> = fetch();
    todos.push(newToDo);

    //persisting changes to file
    persistChange(
      todos,
      () => {
        res.end(JSON.stringify(newToDo, null, 2));
      },
      () => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify("Could Persist Change", null, 2));
      }
    );
  });
};

//Patch todo
export const updateTodo = (req: IncomingMessage, res: ServerResponse) => {
  let todos: Array<Todo> = fetch();
  const urlparse = url.parse(req.url!!, true);
  const queryString = require("querystring");

  //check if url contain query
  if (urlparse.search) {
    const [, query] = urlparse.search.split("?");
    const id: number = queryString.parse(query).id;
    let selectedTodo: Todo = todos.find((todo: Todo) => todo.id == id)!!;

    //check if data present on file
    if (selectedTodo) {
      //validate request data
      validate(req, res, (data: Todo) => {
        todos = todos.filter((todo: Todo) => todo !== selectedTodo);
        selectedTodo.done = data.done;
        selectedTodo.deadline = data.deadline;
        selectedTodo.description = data.description;
        todos.push(selectedTodo);
        persistChange(
          todos,
          () => {
            res.end(JSON.stringify(selectedTodo, null, 2));
          },
          () => {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify("Could not Persist Change", null, 2));
          }
        );
      });
    }

    //send messege if data not present in file
    else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify("Data not found", null, 2));
    }

    //send error if url request invalid
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify("Invalid Request", null, 2));
  }
};

//Delete todo
export const deleteTodo = (req: IncomingMessage, res: ServerResponse) => {
  let todos = fetch();
  const urlparse = url.parse(req.url!!, true);
  const queryString = require("querystring");

  //check if url contain query
  if (urlparse.search) {
    const [, query] = urlparse.search.split("?");
    const id: number = queryString.parse(query).id;

    //check if data present on file
    let selectedTodo: any = todos.find((todo: Todo) => todo.id == id)!!;
    if (selectedTodo) {
      todos = todos.filter((todo: Todo) => todo !== selectedTodo);

      //save change to file
      persistChange(
        todos,
        () => {
          res.end(JSON.stringify(todos, null, 2));
        },
        () => {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify("Could  not Persist Change", null, 2));
        }
      );
    }

    //send messege if data not present in file
    else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify("Data Not found", null, 2));
    }
  }

  //send error if url request invalid
  else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify("Invalid Request", null, 2));
  }
};

const validate = (
  req: IncomingMessage,
  res: ServerResponse,
  callback: (data: any) => void
) => {
  req.on("data", (data) => {
    const newTodo: Todo = JSON.parse(data);
    const description: string = newTodo.description;
    const deadline: Date = new Date(newTodo.deadline);

    if (description && deadline) {
      //maximum lengh of descrition
      if (description.length < 25) {
        //check curent date against the deadline
        if (deadline > new Date(Date.now())) {
          callback(newTodo);

          //send error if deadline less than today
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify("Deadline must not less than today", null, 2));
        }
      }

      //send error if description legth not match criteria
      else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify(
            "Description length must be less than or equal 25",
            null,
            2
          )
        );
      }
    }

    //send error if description or date are empety
    else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify("Description and Deadline must not be empty", null, 2)
      );
    }
  });
};
