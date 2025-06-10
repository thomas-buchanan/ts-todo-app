export class Todo {
    id: number;
    text: string;
    completed: boolean;

    constructor(id:  number, text: string, completed: boolean = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
}
