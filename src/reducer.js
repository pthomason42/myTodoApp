import { bindActionCreators, createStore, combineReducers } from "redux";

const INITIAL_STATE = {
    todos: [
        {
            id: 0,
            text: "add your first todo!",
            date: new Date(),
            completed: false,
            expanded: false,
        },
    ],
};

const rootReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_TODO":
            console.log("ADD_TODO: " + action.payload.nativeEvent.text);
            let newState = { ...state };
            let newTodo = {
                id: state.todos.length,
                text: action.payload.nativeEvent.text,
                date: new Date(),
                completed: false,
                expanded: false,
            };
            newState.todos = [...newState.todos, newTodo]; //.push doesn't work! spread does
            console.log("newState: " + JSON.stringify(newState));
            return newState;
        case "COMPLETE_TODO":
            newState = { ...state };
            let idx = action.payload;
            let ourTodo = newState.todos.splice(idx, 1)[0];
            console.log(ourTodo);
            ourTodo.completed = !ourTodo.completed;
            ourTodo.expanded = !ourTodo.expanded;
            newState = { ...newState, todos: [...newState.todos, ourTodo] };
            //console.log('COMPLETE_TODO' + JSON.stringify(newState))
            return newState;
        case "EXPAND_TODO":
            newState = { ...state };
            idx = action.payload;
            ourTodo = newState.todos.splice(idx, 1)[0];
            console.log(ourTodo);
            ourTodo.expanded = !ourTodo.expanded;
            //ourTodo = {...ourTodo, expanded: !ourTodo.expanded}
            newState = { ...newState, todos: [...newState.todos, ourTodo] };
            //newState.todos[idx] = {...newState.todos[idx], expanded: !newState.todos[idx].expanded}
            //newState.changed = true;
            console.log("EXPAND_TODO: " + JSON.stringify(newState));
            return newState;
        default:
            return state;
    }
};

const store = createStore(rootReducer);

export { store};
