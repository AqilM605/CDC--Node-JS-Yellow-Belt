import http from "http";
import { routes } from "./Routes";

//create server
try {
  http.createServer(routes).listen(8000);
  console.log("Server run on port 8000");
} catch (e) {
  console.log(e);
}
