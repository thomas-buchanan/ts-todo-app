import './styles.css';

import { Todo } from "./todo";
import Sortable from 'sortablejs';

let todos: Todo[] = loadTodos();

const form = document.querySelector('#todo-form') as HTMLFormElement;
const input = document.querySelector('#todo-input') as HTMLInputElement;
const list = document.querySelector('#todo-list') as HTMLUListElement;

type Filter = 'all' | 'active' | 'completed';
let currentFilter: Filter = 'all';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  // Create new Todo
  const newTodo = new Todo(Date.now(), text);
  todos.push(newTodo);

  input.value = '';
  saveTodos();
  renderTodos();
});

function renderTodos() {
  list.innerHTML = '';

  let filtered = todos;
  if (currentFilter === 'active') {
    filtered = todos.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filtered = todos.filter(t => t.completed);
  }

  filtered.forEach((todo) => {
    const li = document.createElement('li');
    li.dataset.id = String(todo.id);
    li.textContent = todo.text;
    li.style.textDecoration = todo.completed ? 'line-through' : 'none';

    // Toggle complete
    li.addEventListener('click', () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.style.marginLeft = '1rem';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering complete toggle
      const index = todos.findIndex((t) => t.id === todo.id);
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
};

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
};

function loadTodos(): Todo[] {
  const todosJson = localStorage.getItem('todos');
  if (!todosJson) return [];
  
  const parsed = JSON.parse(todosJson);
  // Convert plain objects into class instances
  return parsed.map((t: any) => new Todo(t.id, t.text, t.completed));
};

const filterButtons = document.querySelectorAll('#filters button');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-filter') as Filter;
    currentFilter = value;
    renderTodos();
  });
});

const sortable = new Sortable(list, {
  animation: 150,
  onEnd: () => {
    // Rebuild the todos array based on the new DOM order
    const newOrder: Todo[] = [];
    const items = list.querySelectorAll('li');

    items.forEach(li => {
      const id = parseInt(li.dataset.id!);
      const todo = todos.find(t => t.id === id);
      if (todo) newOrder.push(todo);
    });
    
    todos = newOrder;
    saveTodos();
  }
});