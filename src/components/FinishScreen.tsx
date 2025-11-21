import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, Animated, Dimensions } from 'react-native'
import { BlurView } from 'expo-blur'

import finishLogoImage from '../../assets/finishLogo.png'

const { width } = Dimensions.get('window')

const FinishScreen = () => {
    const scaleAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true
        }).start()
    }, [])

    return (
        <BlurView
            intensity={10}
            tint="dark"
            style={styles.absoluteContainer}
        >
            <View style={styles.contentContainer}>
                <Animated.Image
                    source={finishLogoImage}
                    style={[
                        styles.logoImage,
                        {
                            transform: [
                                { scale: scaleAnim },
                                { rotate: '-8deg' }
                            ]
                        }
                    ]}
                    resizeMode='contain'
                />
            </View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    absoluteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    contentContainer: {
        width: width * 0.8
    },
    logoImage: {
        width: '100%',
        height: '100%'
    }
})

export default FinishScreen
