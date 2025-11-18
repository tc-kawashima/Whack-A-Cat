import React from 'react'
import { StyleSheet, View, ImageBackground } from 'react-native'
import { BlurView } from 'expo-blur'

import backgroundImage from '../../assets/background.png'

interface BackgroundProps {
    children: React.ReactNode
}

const Background = ({ children }: BackgroundProps) => {
    return (
        <View style={styles.absoluteContainer}>
        <ImageBackground
            source={backgroundImage}
            style={styles.background}
            resizeMode='cover'
        >
            <BlurView
                intensity={10}
                tint="dark"
                style={StyleSheet.absoluteFill}
            >
                {children}
            </BlurView>
        </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    absoluteContainer: {
        flex: 1
    }
})

export default Background
