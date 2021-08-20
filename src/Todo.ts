export default class Todo {
  id: number;
  description: string;
  deadline: Date;
  done: boolean;

  constructor(id: number, description: string, deadline: Date, done: boolean) {
    (this.id = id),
      (this.description = description),
      (this.deadline = deadline),
      (this.done = done);
  }
}
