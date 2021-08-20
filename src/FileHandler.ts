//dummy database class
import fs from "fs";
import Todo from "./Todo";

//Fetch Data Json From File
export const fetch = (): Array<Todo> => {
  const data: Buffer = fs.readFileSync("./data.json");
  const todos: Array<Todo> = JSON.parse(data.toString());
  return todos;
};

//Persist change to file
export const persistChange = (
  todos: Array<Todo>,
  onSuccess: () => void,
  onError: () => void
) => {
  try {
    fs.writeFile("./data.json", JSON.stringify(todos), (err) => {
      if (err) {
        onError();
      } else {
        onSuccess();
      }
    });
  } catch (e) {
    console.log(e);
  }
};
