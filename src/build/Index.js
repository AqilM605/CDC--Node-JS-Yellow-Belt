"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const Routes_1 = require("./Routes");
//create server
try {
    http_1.default.createServer(Routes_1.routes).listen(8000);
    console.log("Server run on port 8000");
}
catch (e) {
    console.log(e);
}
