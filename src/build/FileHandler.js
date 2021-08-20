"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistChange = exports.fetch = void 0;

//dummy database class
const fs_1 = __importDefault(require("fs"));
const fetch = () => {
    const data = fs_1.default.readFileSync('./data.json');
    const todos = JSON.parse(data.toString());
    return todos;
};
exports.fetch = fetch;
const persistChange = (todos, onSuccess, onError) => {
    try {
        fs_1.default.writeFile('./data.json', JSON.stringify(todos), (err) => {
            if (err) {
                onError();
            }
            else {
                onSuccess();
            }
        });
    }
    catch (e) {
        console.log(e);
    }
};
exports.persistChange = persistChange;
