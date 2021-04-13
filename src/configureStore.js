import { createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
//import { rootReducer } from ;

const INITIAL_STATE = {
    todos: [
        {
            id: 0,
            text: "add your first todo!",
            date: new Date(),
            completed: false,
            expanded: false,
            notes: null, 
        },
    ],
};

const rootReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_NOTE": 
            newState = { ...state };
            console.log({...action});
            
            let idx = action.payload.index; 
            let ourTodo = newState.todos.splice(idx, 1)[0];
            //console.log('addNote: ' + idx + ' ' + JSON.stringify(ourTodo));
           // console.log(ourTodo);
            ourTodo.notes = action.payload.text.nativeEvent.text;
            newState = { ...newState, todos: [...newState.todos, ourTodo] };
            //console.log('COMPLETE_TODO' + JSON.stringify(newState))
            newState.todos.sort((a,b) => {
                return a.id - b.id; //try here
            });
            
            return newState;
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
            //console.log("newState: " + JSON.stringify(newState));
            newState.todos.sort((a,b) => {
                return a.id - b.id;
            });
            return newState;
        case "COMPLETE_TODO":
            newState = { ...state };
            console.log({...action});
            idx = action.payload;
            ourTodo = newState.todos.splice(idx, 1)[0];
            //console.log(ourTodo);
            ourTodo.completed = !ourTodo.completed;
            ourTodo.expanded = !ourTodo.expanded;
            newState = { ...newState, todos: [...newState.todos, ourTodo] };
            //console.log('COMPLETE_TODO' + JSON.stringify(newState))
            newState.todos.sort((a,b) => {
                return a.id - b.id;
            });
            return newState;
        case "DELETE_TODO":
            newState = { ...state };
            //console.log({...action});
            idx = action.payload;
            ourTodo = newState.todos.splice(idx, 1)[0];
            //console.log();
            console.log('Delete_TODO' + JSON.stringify(newState))
            newState = {...newState, todos: [...newState.todos]}
            newState.todos.sort((a,b) => {
                return a.id - b.id;
            });
            return newState;
        case "EXPAND_TODO":
            newState = { ...state };
            idx = action.payload;
            ourTodo = newState.todos.splice(idx, 1)[0];
            //console.log(ourTodo);
            ourTodo.expanded = !ourTodo.expanded;
            //ourTodo = {...ourTodo, expanded: !ourTodo.expanded}
            newState = { ...newState, todos: [...newState.todos, ourTodo] };
            //newState.todos[idx] = {...newState.todos[idx], expanded: !newState.todos[idx].expanded}
            //newState.changed = true;
            //console.log("EXPAND_TODO: " + JSON.stringify(newState));
            newState.todos.sort((a,b) => {
                return a.id - b.id;
            });
            return newState;
        default:
            return state;
    }
};

//make persist config
// stateRecon is bit complicated / comment for default?
const persistConfig = {
 key: 'root',
 storage: AsyncStorage,
 stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

//const store = createStore(rootReducer);

//export { store};

//wrap rootReducer and persistConfig in persistReducer
const pReducer = persistReducer(persistConfig, rootReducer);

//create store from persistReducer
export const store = createStore(pReducer);

// wrap store in persistStore
export const persistor = persistStore(store);

