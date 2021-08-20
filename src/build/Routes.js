"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const TodoController_1 = require("./TodoController");
function routes(req, res) {
    const url = require('url');
    const urlparse = url.parse(req.url, true);
    //fetch all todos enpoint
    if (urlparse.pathname == '/todos' && req.method == 'GET') {
        TodoController_1.getTodos(res);
    }
    //create new todo    
    if (urlparse.pathname == '/todos' && req.method == 'POST') {
        TodoController_1.createToDo(req, res);
    }
    //update todo    
    if (urlparse.pathname == '/todos' && req.method == 'PATCH') {
        TodoController_1.updateTodo(req, res);
    }
    //delete todo
    if (urlparse.pathname == '/todos' && req.method == 'DELETE') {
        TodoController_1.deleteTodo(req, res);
    }
}
exports.routes = routes;
