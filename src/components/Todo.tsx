import TodoForm from "./TodoForm.tsx";
import {useReducer, useEffect} from "react";
import TodoList from "./TodoList.tsx";
import type { TodoProps, Action } from "../types.ts";


const getInitialTodos = () => {
    const stored = localStorage.getItem("todos");

    return stored ? JSON.parse(stored) : [];

}

const todoReducer = (state: TodoProps[], action: Action): TodoProps[] => {

    switch (action.type) {
        // case "ADD":
        //     const newTodo: TodoProps = {
        //         id: Date.now(),
        //         text: action.payload
        //     }
        //     return [...state, newTodo];
        case "ADD":
            return [
                ...state,
                {
                    id: Date.now(),
                    text: action.payload,
                    completed: false,
                }
            ];
        case "DELETE":
    return state.filter(todo => todo.id !== action.payload)

        case "EDIT":
            return state.map(
                todo => todo.id === action.payload.id
                    ? {...todo, text: action.payload.newText}
                    : todo
            )
        case "COMPLETE":
            return state.map( todo =>
                todo.id === action.payload
                    ? {...todo, completed: !todo.completed}
                    : todo
            );
        case "CLEAR_ALL":
            return [];
        default:
            return state;
    }
}


const Todo = () => {
    const [todos, dispatch] = useReducer(todoReducer, [], getInitialTodos);
    const totalTasks: number = todos.length;
    const completedTasks: number = todos.filter(todo => todo.completed).length;
    const activeTasks: number = totalTasks - completedTasks;



    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const handleClearAll = () => {
        dispatch({type: "CLEAR_ALL"});
    }

    return(
        <>
            <div className="mx-auto max-w-sm p-6 shadow-2xl mt-4">
                <h1 className="text-center text-2xl mb-4">To-Do List</h1>
                <TodoForm dispatch={dispatch}/>
                <TodoList todos={todos} dispatch={dispatch}/>

                {todos.length > 0 && (
                <>
                    <div className="flex justify-between mt-4 border-t pt-2 text-cf-gray">
                        <span>Total: {totalTasks}</span>
                        <span>Active: {activeTasks}</span>
                        <span>Completed: {completedTasks}</span>
                    </div>
                    <div className="text-end mt-4">
                        <button
                            onClick={handleClearAll}
                            className="bg-cf-dark-red text-white py-2 px-4 rounded"
                        >
                            Clear all
                        </button>
                    </div>
                </>
                )}
            </div>
        </>
    )
}

export default Todo;