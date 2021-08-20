"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createToDo = exports.getTodos = void 0;
const url_1 = __importDefault(require("url"));
const FileHandler_1 = require("./FileHandler");

//for id auto increment
let lastIndex = FileHandler_1.fetch().length === 0 ? 0 : FileHandler_1.fetch().length-1;

//fetch all todo
const getTodos = (res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(FileHandler_1.fetch(), null, 2));
};
exports.getTodos = getTodos;
//create todo
const createToDo = (req, res) => {
    let todos = FileHandler_1.fetch();
    req.on('data', data => {
        const jsonData = JSON.parse(data);
        if (jsonData.description && jsonData.deadline) {
            const newToDo = {
                "id": ++lastIndex,
                "description": jsonData.description,
                "deadline": jsonData.deadline,
                "done": false
            };
            todos.push(newToDo);
            FileHandler_1.persistChange(todos, () => { res.end(JSON.stringify(newToDo, null, 2)); }, () => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify('Could Persist Change', null, 2));
            });
        }
        else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify("Description and Deadline must not be empty", null, 2));
        }
    });
};
exports.createToDo = createToDo;
//Patch todo
const updateTodo = (req, res) => {
    let todos = FileHandler_1.fetch();
    const urlparse = url_1.default.parse(req.url, true);
    const queryString = require('querystring');
    if (urlparse.search) {
        const [, query] = urlparse.search.split('?');
        const id = queryString.parse(query).id;
        let selectedTodo = todos.find((todo) => todo.id === id);
        if (selectedTodo) {
            todos = todos.filter((todo) => todo !== selectedTodo);
            selectedTodo.done = !selectedTodo.done;
            todos.push(selectedTodo);
            FileHandler_1.persistChange(todos, () => { res.end(JSON.stringify(selectedTodo, null, 2)); }, () => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify('Could not Persist Change', null, 2));
            });
        }
        else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify("Data not found", null, 2));
        }
    }
    else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify("Invalid Request", null, 2));
    }
};
exports.updateTodo = updateTodo;
//Delete todo
const deleteTodo = (req, res) => {
    let todos = FileHandler_1.fetch();
    const urlparse = url_1.default.parse(req.url, true);
    const queryString = require('querystring');
    if (urlparse.search) {
        const [, query] = urlparse.search.split('?');
        const id = queryString.parse(query).id;
        let selectedTodo = todos.filter((todo) => todo.id === id)[0];
        if (selectedTodo) {
            todos = todos.filter((todo) => todo !== selectedTodo);
            FileHandler_1.persistChange(todos, () => { res.end(JSON.stringify(todos, null, 2)); }, () => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify('Could  not Persist Change', null, 2));
            });
        }
        else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify("Data not found", null, 2));
        }
    }
    else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify("Invalid Request", null, 2));
    }
};
exports.deleteTodo = deleteTodo;
