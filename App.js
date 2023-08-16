import React from "react";
import { View, StyleSheet, Text, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Metronome from "./src/Metronome";

export default ({}) => {

    return <GestureHandlerRootView style={{flex: 1, backgroundColor: "white"}}>
        <StatusBar hidden={false} backgroundColor={"transparent"}/>
        <View style={styles.container}>
            <Metronome/>
        </View>
    </GestureHandlerRootView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "black"
    },
    text: {
        fontSize: 50,
        color: "white"
    }
});
