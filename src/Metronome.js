import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Pressable, Text, Platform, Appearance } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    withSequence,
    withRepeat, runOnJS,
} from "react-native-reanimated";
import Sound from "react-native-sound";
import { centred } from "./constants/styles";
import Slider from "@react-native-community/slider";

Sound.setCategory("Playback");

const { width, height } = Dimensions.get("window");

const lineHeight = 350;
const del = 60000 / 2;
const overPosition = 50

export default ({}) => {

    const rotationValue = useSharedValue(0);
    const [started, setStarted] = useState(false);

    const [bpm, setBpm] = useState(60);
    const [beats, setBeats] = useState(0);
    const duration = useRef(del / bpm);

    const sound = useRef(null);

    useEffect(() => {
        // slider.current.
    }, []);

    useEffect(() => {
        duration.current = del / Math.round(bpm);
        if (started) {
            setBeats(0);
            sound.current = new Sound("metronome.mp3", Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log("failed to load the sound", error);

                }
            })
        }
    }, [bpm, started]);

    useEffect(() => {
        if (started) {
            startRotation();
        } else {
            rotationValue.value = withTiming(0, { duration: 150, easing: Easing.linear });
        }
    }, [started]);

    const startRotation = () => {
        rotationValue.value = withRepeat(
            withSequence(
                withTiming(25, { duration: duration.current, easing: Easing.out(Easing.ease) }),
                withTiming(0, { duration: duration.current, easing: Easing.in(Easing.ease) }, () => runOnJS(playSound)()),
                withTiming(-25, { duration: duration.current, easing: Easing.out(Easing.ease) }),
                withTiming(0, { duration: duration.current, easing: Easing.in(Easing.ease) }, () => runOnJS(playSound)()),
            ),
            -1,
            true,
        );
    };

    const playSound = () => {
        sound.current.play();
        setBeats(v => v+1)
    };

    const toggleAnimation = () => {
        setStarted(value => !value);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${rotationValue.value}deg` },
                { translateY: -lineHeight / 2 - overPosition },
            ],
        };
    });

    return <View style={styles.container}>
        <Pressable style={[styles.content]} onPress={toggleAnimation}>
            <Animated.View style={[styles.line, animatedStyle]} />
        </Pressable>
        <Text style={styles.bpmText}>{`Beats: ${beats}`}</Text>
        <Text style={styles.bpmText}>{`bpm: ${Math.round(bpm)}`}</Text>
        <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={310}
            value={Platform.OS === "android" ? undefined : bpm}
            onValueChange={(value) => setBpm(value)}
            minimumTrackTintColor={"#0158df"}
            maximumTrackTintColor={"#00b2f3"}
            thumbTintColor={"#00b2f3"}
        />
    </View>;
}

const theme = Appearance.getColorScheme()

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // width, height,
        // backgroundColor: "rgba(7,5,26,0.87)",
        backgroundColor: theme === "dark" ? "black" : "white",
        ...centred,
        paddingTop: 50,
        paddingBottom: 50,
    },
    content: {
        // flex: 1,
        width,
        height: lineHeight,
        // backgroundColor: "red",
        ...centred,
    },
    line: {
        width: 4,
        height: lineHeight,
        marginBottom: -lineHeight - overPosition,
        backgroundColor: theme === "light" ? "black" : "white",
    },
    bpmText: {
        color: "black",
        fontSize: 50,
    },
    slider: {
        width,
        height: 50,
        backgroundColor: "transparent",
    },
});
