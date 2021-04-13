import "react-native-gesture-handler";
import React from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { connect, Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./src/configureStore.js";

class App extends React.Component {
    addToDo = ({ nativeEvent: { text, eventCount, target } }) => {
        this.textInputRef.clear();
        this.props.addToDo({ nativeEvent: { text, eventCount, target } });
    };

    addNote = (index, text) => {
        //console.log('addNote - app: ' + text.nativeEvent.text)
        this.props.addNote(index, text);
        //this.noteInputRef.focus();
    };
    /*  removed from flat list because it won't play nice with keyboard avoiding view
            <TextInput 
                ref={(ref) => {this.noteInputRef = ref} }
                style={styles.notes}
                multiline={true}
                placeholder={"notes:"}
                defaultValue={item?.notes}
                onSubmitEditing={ (nativeEvent) => {this.addNote(index, nativeEvent)}}
            />
            */
    /*
    expandTodo = (index) => {
        let toDo = [...this.state.todos];
        (toDo[index].expanded = !toDo[index].expanded),
            this.setState({ todos: [...toDo] });
    };
    */
    renderItem = ({ item, index }) => {
        let date = new Date(item.date);
        if (item.expanded) {
            //console.log('renderItem: ' + JSON.stringify(item));
            return (
                <View>
                    <TouchableOpacity
                        style={styles.todoCard}
                        onPress={() => this.props.expandToDo(index)}
                    >
                        <Text
                            style={[
                                styles.todo,
                                item.completed ? styles.completed : null,
                            ]}
                        >
                            {" "}
                            {item.text}{" "}
                        </Text>
                        <Text style={styles.white}>
                            {" "}
                            {date.toDateString()}{" "}
                        </Text>
                        {!item.completed ? (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.props.completeToDo(index)}
                            >
                                <Text>finish</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.props.deleteToDo(index)}
                            >
                                <Text>remove</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.flexOne}>
                    <TouchableOpacity
                        style={styles.todoCard}
                        onPress={() => this.props.expandToDo(index)}
                    >
                        <Text
                            style={[
                                styles.todo,
                                item.completed ? styles.completed : null,
                            ]}
                        >
                            {" "}
                            {item.text}{" "}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    empty = () => {
        return (
            <View style={styles.todoCard}>
                <Text> nothing yet! </Text>
            </View>
        );
    };
    textInput = () => {
        return (
            <TextInput
                ref={(ref) => {
                    this.textInputRef = ref;
                }}
                style={[styles.textInput]}
                placeholder="add a todo"
                placeholderTextColor={white}
                onSubmitEditing={this.addToDo}
            />
        );
    };

    render() {
        return (
            <View style={styles.flexOne}>
                <View style={styles.row}>
                    <Text style={styles.header}>My Todos</Text>
                </View>

                <View style={styles.flexOne}>
                    <FlatList
                        style={[styles.flexOne]}
                        ListEmptyComponent={this.empty}
                        ListHeaderComponent={this.textInput}
                        data={this.props.todos}
                        keyExtractor={() => Math.random().toString()}
                        renderItem={this.renderItem}
                    />
                </View>
                </View>
        );
    }
}

class Root extends React.Component {
    // needs a root component so store loads before components that will access store
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {
                        //i believe the problem is text input nested in flat list, let's try build our own list in scroll view?
                    }
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={"padding"}
                        keyboardVerticalOffset={50}
                        enabled
                    >
                        <StatusBar style="auto" barStyle="light-content" />

                        <SafeAreaView style={styles.flexOne}>
                            <ConnectedApp style={styles.flexOne} />
                        </SafeAreaView>
                    </KeyboardAvoidingView>
                </PersistGate>
            </Provider>
        );
    }
}

const bgColor = "black";
const grey = "grey";
const lightgrey = "lightgrey";
const white = "white";
const purple = "purple";

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: white,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 10,
        width: 75,
    },
    completed: {
        textDecorationLine: "line-through",
    },
    container: {
        alignItems: "center",
        backgroundColor: bgColor,
        flex: 1,
        //justifyContent: "center",
    },
    flexOne: {
        flex: 1,
    },
    header: {
        backgroundColor: purple,
        color: white,
        flex: 1,
        fontSize: 22,
        padding: 10,
        textAlign: "center",
    },
    notes: {
        borderWidth: 1,
        marginTop: 5,
        padding: 10,
    },
    row: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        //flex: 1,
    },
    textInput: {
        alignSelf: "center",
        borderColor: lightgrey,
        borderWidth: 2,
        margin: 10,
        padding: 10,
        width: "80%",
    },
    todo: {
        color: white,
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        paddingBottom: 5,
    },
    todoCard: {
        backgroundColor: grey,
        borderRadius: 5,
        borderWidth: 1,
        flex: 1,
        margin: 10,
        padding: 10,
        //width: '85%'
    },
    white: {
        color: white,
    },
});
const mapStateToProps = (state) => {
    const { changed, todos } = state;
    //console.log("mapState:" + JSON.stringify(todos));
    return { changed, todos };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addToDo: (event) => dispatch({ type: "ADD_TODO", payload: event }),
        addNote: (index, text) =>
            //dispatch({ type: "ADD_NOTE", payload: {event, index} }),
            dispatch({ type: "ADD_NOTE", payload: { index, text } }),
        completeToDo: (index) =>
            dispatch({ type: "COMPLETE_TODO", payload: index }),
        deleteToDo: (index) =>
            dispatch({ type: "DELETE_TODO", payload: index }),
        expandToDo: (index) =>
            dispatch({ type: "EXPAND_TODO", payload: index }),
    };
};
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App); // returns a compnent!

export default Root;
