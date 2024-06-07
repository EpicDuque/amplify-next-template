"use client";

import { useState, useEffect } from "react";

import {Authenticator} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import '../app/styles/amplify.css'

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main className="flex justify-center min-h-screen p-3">
        <Authenticator>
          <div className="flex flex-col w-1/4 items-center justify-center">
            <h1 className="font-bold">My todos</h1>
            <button
              className="btn btn-sm btn-outline btn-primary w-40 mx-auto"
              onClick={createTodo}
            >
              + new{" "}
            </button>

            <ul className="my-2 w-2/3">
              {todos.map((todo) => (
                <li
                  className="border rounded-md p-1 my-2 items-center flex"
                  key={todo.id}
                >
                  <span className="grow">{todo.content}</span>
                  <button
                    className="btn btn-sm btn-error ml-2"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Authenticator>
    </main>
  );
}
