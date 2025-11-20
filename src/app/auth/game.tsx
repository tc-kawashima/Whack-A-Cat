import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native'
import { Link } from 'expo-router'

import Background from '../../components/Background'
import holeImage from '../../../assets/holeBox.png'
import { BlurView } from 'expo-blur'

const { width } = Dimensions.get('window')

const GRID_SIZE = 3
const GAME_WIDTH_RATIO = 0.95
const TILE_SIZE = (width * GAME_WIDTH_RATIO) / GRID_SIZE
const GAME_AREA_HEIGHT = width * GAME_WIDTH_RATIO

const REMAINING_TIME = 30

const TimerBar = ({ isPaused }: { isPaused: boolean }) => {
  const [timeLeft, setTimeLeft] = useState(REMAINING_TIME)
  const barWidth = width * 0.6
  const circleWidth = 48
  const maxGaugeWidth = barWidth - circleWidth / 1.5
  const progressAnim = useRef(new Animated.Value(maxGaugeWidth)).current
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTimeLeft(prev => Math.max(prev - 0.1, 0))
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isPaused])
  useEffect(() => {
    const newWidth = (timeLeft / REMAINING_TIME) * maxGaugeWidth
    Animated.timing(progressAnim, {
      toValue: newWidth,
      duration: 100,
      useNativeDriver: false
    }).start()
  }, [timeLeft])
  return (
    <View style={[timerStyles.gaugeWrapper, { width: barWidth }]}>
      <View style={timerStyles.gaugeBody}>
        <View style={timerStyles.timerBarWrapper}>
          <Animated.View
            style={[
              timerStyles.timerBarProgress,
              { width: progressAnim }
            ]}
          />
        </View>
      </View>
      <View style={timerStyles.timeCircle}>
        <Text style={timerStyles.timeText}>{Math.ceil(timeLeft)}</Text>
      </View>
    </View>
  )
}

{/* ----- ポーズ画面 ----- */ }
interface PauseScreenProps {
  onResume: () => void
  onGoToTitle: () => void
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onGoToTitle }) => {
  return (
    <BlurView
      style={pauseStyles.overlay}
      intensity={10}
      tint='light'
    >
      <View style={pauseStyles.overlay}>
        <View style={pauseStyles.popup}>
          <Text style={pauseStyles.pauseText}>一時停止中...</Text>
          <TouchableOpacity style={pauseStyles.button} onPress={onResume}>
            <Text style={pauseStyles.buttonText}>つづける</Text>
          </TouchableOpacity>
          <Link style={[pauseStyles.button, pauseStyles.titleButton]} href='/auth/Home' asChild onPress={onGoToTitle}>
            <TouchableOpacity>
              <Text style={pauseStyles.buttonText}>タイトルへ</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </BlurView>
  )
}

const Game = () => {
  const moleHoles = Array(GRID_SIZE * GRID_SIZE).fill(0)
  const [isPaused, setIsPaused] = useState(false)
  const togglePause = () => {
    setIsPaused(prev => !prev)
  }
  const handleResume = () => {
    setIsPaused(false)
  }
  const handleGoToTitle = () => {
    setIsPaused(false)
  }
  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.infoLayer}>
          <View style={styles.topArea}>
            {/* ----- コンボ ----- */}
            <View style={styles.comboArea}>
              <Text style={styles.comboLabel}>コンボ</Text>
              <Text style={styles.comboNumber}>555</Text>
            </View>
            {/* ----- ポーズボタン ----- */}
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={togglePause}
              disabled={isPaused}
            >
              <Text style={styles.pauseButtonText}>II</Text>
            </TouchableOpacity>
          </View>

          {/* ----- タイマー ----- */}
          <View style={styles.timerArea}>
            <TimerBar isPaused={isPaused}/>
          </View>


          {/* ----- スコア ----- */}
          <View style={styles.scoreAreaWrapper}>
            <View style={styles.scoreArea}>
              <Text style={styles.scoreLabel}>スコア</Text>
              <Text style={styles.scoreNumber}>9999</Text>
            </View>
          </View>
        </View>


        {/* ----- ゲームエリア ----- */}
        <View style={[styles.gameArea, { height: GAME_AREA_HEIGHT }]}>
          {moleHoles.map((_, index) => (
            <View key={index} style={styles.holeContainer}>
              <Image
                source={holeImage}
                style={[styles.holeImage, { width: TILE_SIZE, height: TILE_SIZE }]}
                resizeMode="contain"
              />
              {/* 💡 後でモグラ画像がここに重ねて表示される */}
            </View>
          ))}
        </View>

        {isPaused && (
          <PauseScreen
            onResume={handleResume}
            onGoToTitle={handleGoToTitle}
          />
        )}
      </View>
    </Background >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  infoLayer: {
    width: '100%',
    marginTop: 80,
    marginBottom: 80
  },
  topArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  timerArea: {
    width: '100%',
    alignItems: 'center'
  },
  comboArea: {
    backgroundColor: '#D9534F',
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56
  },
  comboLabel: {
    color: '#FFF',
    fontSize: 12
  },
  comboNumber: {
    color: '#FFA500',
    fontSize: 24,
    fontWeight: 'bold'
  },
  pauseButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  pauseButtonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold'

  },
  scoreAreaWrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative'
  },
  scoreArea: {
    width: '60%',
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 120,
    flexDirection: 'row',
    alignItems: 'center'
  },
  scoreLabel: {
    position: 'absolute',
    left: 12,
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'normal'
  },
  scoreNumber: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -16,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold'
  },
  gameArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  holeContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  holeImage: {

  }
})

const timerStyles = StyleSheet.create({
  gaugeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 32
  },
  gaugeBody: {
    flex: 1
  },
  timerBarWrapper: {
    height: 24,
    backgroundColor: '#8A8A8A',
    borderRadius: 12,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#7A7A7A'
  },
  timerBarProgress: {
    height: '100%',
    backgroundColor: '#2E97D8',
    borderRadius: 0
  },
  timeCircle: {
    position: 'absolute',
    right: -12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8A8A8A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#7A7A7A'
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  }
})

const pauseStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  popup: {
    width: width * 0.8,
    padding: 26,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    alignItems: 'center'
  },
  pauseText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 24
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    backgroundColor: '#2E97D8',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center'
  },
  titleButton: {
    backgroundColor: '#D9534F'
  },
  // ボタンテキスト
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  }
})

export default Game
