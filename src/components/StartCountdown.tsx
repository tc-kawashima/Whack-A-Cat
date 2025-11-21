import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Image, Animated, Dimensions, ImageSourcePropType } from 'react-native'
import { BlurView } from 'expo-blur'

import startLogoImage from '../../assets/startLogo.png'
import oneImage from '../../assets/one.png'
import twoImage from '../../assets/two.png'
import threeImage from '../../assets/three.png'

const { width } = Dimensions.get('window')

interface StartCountdownProps {
    onComplete: () => void
    isPaused: boolean
}

const StartCountdown = ({ onComplete, isPaused }: StartCountdownProps) => {
    const [count, setCount] = useState<number | 'START'>(3)
    const scaleAnim = useRef(new Animated.Value(0)).current
    const opacityAnim = useRef(new Animated.Value(1)).current
    const getCurrentImage = (): ImageSourcePropType => {
        switch (count) {
            case 3: return threeImage
            case 2: return twoImage
            case 1: return oneImage
            case 'START': return startLogoImage
            default: return threeImage
        }
    }

    useEffect(() => {
        scaleAnim.setValue(0)
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 80,
            useNativeDriver: true
        }).start()
    }, [count])

    useEffect(() => {
        if (isPaused) return

        if (count === 'START') {
            const timer = setTimeout(() => {
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                }).start(onComplete)
            }, 800)
            return () => clearTimeout(timer)
        }
        const interval = setInterval(() => {
            setCount(prev => {
                if (prev === 3) return 2
                if (prev === 2) return 1
                if (prev === 1) return 'START'
                return prev
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isPaused, count, onComplete])

    return (
        <BlurView intensity={10} tint="dark" style={styles.container}>
            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <Image
                    source={getCurrentImage()}
                    style={[
                        styles.countdownImage,
                        count === 'START' && styles.startImage
                    ]}
                    resizeMode='contain'
                />
            </Animated.View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 98
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: width
    },
    countdownImage: {
        width: '30%',
        height: '30%'
    },
    startImage: {
        width: '80%',
        height: '80%',
        transform: [{ rotate: '-8deg' }]
    }
})

export default StartCountdown
