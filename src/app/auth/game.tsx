import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native'
import { Link } from 'expo-router'
import { BlurView } from 'expo-blur'

import Background from '../../components/Background'
import FinishScreen from '../../components/FinishScreen'
import StartCountdown from '../../components/StartCountdown'

import holeImage from '../../../assets/holeBox.png'
import catNormal from '../../../assets/catNormalIdle.png'
import catDevil from '../../../assets/catDevilIdle.png'
import catAngel from '../../../assets/catAngelIdle.png'
import catNormalHit from '../../../assets/catNormalHit.png'
import catDevilHit from '../../../assets/catDevilHit.png'
import catAngelHit from '../../../assets/catAngelHit.png'
import catNormalEffect from '../../../assets/catNormalEffect.png'
import catDevilEffect from '../../../assets/catDevilEffect.png'
import catAngelEffect from '../../../assets/catAngelEffect.png'

const { width } = Dimensions.get('window')

const GRID_SIZE = 3
const GAME_WIDTH_RATIO = 0.95
const TILE_SIZE = (width * GAME_WIDTH_RATIO) / GRID_SIZE
const GAME_AREA_HEIGHT = width * GAME_WIDTH_RATIO
const REMAINING_TIME = 30
const CAT_LIFESPAN = 1200

// --------------------
// タイマーゲージ処理
// --------------------
interface TimerBarProps {
  timeLeft: number
  maxTime: number
}

const TimerBar = ({ timeLeft, maxTime }: TimerBarProps) => {
  const barWidth = width * 0.6
  const maxGaugeWidth = barWidth - 48 / 1.5
  const progressAnim = useRef(new Animated.Value(maxGaugeWidth)).current

  useEffect(() => {
    const newWidth = (timeLeft / maxTime) * maxGaugeWidth
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

// --------------------
// ポーズ画面
// --------------------
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

// --------------------
// ゲーム画面
// --------------------
type CatType = 'normal' | 'devil' | 'angel'
type AnimationPhase = 'hidden' | 'idle' | 'effect' | 'hit'

interface Cat {
  type: CatType
  visible: boolean
  isAnimating: boolean
  phase: AnimationPhase
  lifeTimer: number
}

const Game = () => {
  const moleHoles = Array(GRID_SIZE * GRID_SIZE).fill(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [cats, setCats] = useState<Cat[]>(
    moleHoles.map(() => ({ type: 'normal', visible: false, isAnimating: false, phase: 'hidden', lifeTimer: 0 }))
  )
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(REMAINING_TIME)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  // 制限時間
  useEffect(() => {
    if (!isGameStarted || isPaused || isGameOver) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const nextTime = prev - 0.1
        if (nextTime <= 0) {
          clearInterval(interval)
          setIsGameOver(true)
          return 0
        }
        return nextTime
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isGameStarted, isPaused, isGameOver])

  // ねこ出現
  useEffect(() => {
    if (!isGameStarted || isPaused || isGameOver) return
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * moleHoles.length)
      const rand = Math.random()
      let randomType: CatType = 'normal'
      if (rand > 0.85) randomType = 'angel'
      else if (rand > 0.7) randomType = 'devil'

      setCats(prev => {
        if (prev[index].visible || prev[index].isAnimating) return prev
        const newCats = [...prev]
        newCats[index] = { type: randomType, visible: true, isAnimating: false, phase: 'idle', lifeTimer: CAT_LIFESPAN }
        return newCats
      })
    }, 1300)

    return () => clearInterval(interval)
  }, [isGameStarted, isPaused, isGameOver])

  // ねこ出現時間
  useEffect(() => {
    if (!isGameStarted || isPaused || isGameOver) return

    const loopInterval = setInterval(() => {
      setCats(prev => prev.map(cat => {
        if (!cat.visible || cat.phase !== 'idle') return cat
        const newTimer = cat.lifeTimer - 100
        if (newTimer <= 0) {
          return { ...cat, visible: false, phase: 'hidden', lifeTimer: 0 }
        }
        return { ...cat, lifeTimer: newTimer }
      }))
    }, 100)
    return () => clearInterval(loopInterval)
  }, [isGameStarted, isPaused, isGameOver])

  // タップ時
  const handleTapCat = (index: number) => {
    const targetCat = cats[index]
    if (!isGameStarted || isPaused || isGameOver || !cats[index].visible || cats[index].isAnimating) return

    // スコア計算
    let scoreAdd = 0
    switch (targetCat.type) {
      case 'normal':
        scoreAdd = 100
        setCombo(prev => prev + 1)
        break
      case 'angel':
        scoreAdd = 500
        setCombo(prev => prev + 1)
        break
      case 'devil':
        scoreAdd = -200
        setCombo(0)
        break
    }
    setScore(prev => Math.max(0, prev + scoreAdd))

    // アニメーション エフェクト
    setCats(prev => {
      const newCats = [...prev]
      newCats[index] = { ...newCats[index], isAnimating: true, phase: 'effect' }
      return newCats
    })

    // アニメーション ヒット
    setTimeout(() => {
      setCats(prev => {
        const newCats = [...prev]
        if (newCats[index].isAnimating) {
          newCats[index] = { ...newCats[index], phase: 'hit' }
        }
        return newCats
      })

      // アニメーション 非表示
      setTimeout(() => {
        setCats(prev => {
          const newCats = [...prev]
          if (newCats[index].isAnimating) {
            newCats[index] = { ...newCats[index], visible: false, isAnimating: false, phase: 'hidden' }
          }
          return newCats
        })
      }, 300)

    }, 100)
  }

  const renderCatImage = (cat: Cat) => {
    if (!cat.visible && cat.phase === 'hidden') return null

    let imageSource
    if (cat.phase === 'effect') {
      switch (cat.type) {
        case 'normal': imageSource = catNormalEffect; break
        case 'devil': imageSource = catDevilEffect; break
        case 'angel': imageSource = catAngelEffect; break
      }
    } else if (cat.phase === 'hit') {
      switch (cat.type) {
        case 'normal': imageSource = catNormalHit; break
        case 'devil': imageSource = catDevilHit; break
        case 'angel': imageSource = catAngelHit; break
      }
    } else {
      switch (cat.type) {
        case 'normal': imageSource = catNormal; break
        case 'devil': imageSource = catDevil; break
        case 'angel': imageSource = catAngel; break
      }
    }

    if (!imageSource) return null
    const isEffect = cat.phase === 'effect'
    return (
      <Image
        source={imageSource}
        style={{
          width: isEffect ? TILE_SIZE : TILE_SIZE * 0.6,
          height: isEffect ? TILE_SIZE : TILE_SIZE * 0.6
        }}
        resizeMode="contain"
      />
    )
  }

  const togglePause = () => {
    if (isGameOver) return
    setIsPaused(p => !p)
  }
  const handleResume = () => setIsPaused(false)
  const handleGoToTitle = () => setIsPaused(false)
  const handleGameStart = () => setIsGameStarted(true)

  return (
    <Background>
      <View style={styles.container}>
        {!isGameStarted && (
          <StartCountdown onComplete={handleGameStart} isPaused={isPaused}/>
        )}
        <View style={styles.infoLayer}>
          <View style={styles.topArea}>
            {/* ----- コンボ ----- */}
            <View style={styles.comboArea}>
              <Text style={styles.comboLabel}>コンボ</Text>
              <Text style={styles.comboNumber}>{combo}</Text>
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
            <TimerBar timeLeft={timeLeft} maxTime={REMAINING_TIME} />
          </View>


          {/* ----- スコア ----- */}
          <View style={styles.scoreAreaWrapper}>
            <View style={styles.scoreArea}>
              <Text style={styles.scoreLabel}>スコア</Text>
              <Text style={styles.scoreNumber}>{score}</Text>
            </View>
          </View>
        </View>

        {/* ----- ゲームエリア ----- */}
        <View style={[styles.gameArea, { height: GAME_AREA_HEIGHT }]}>
          {cats.map((cat, index) => (
            <View key={index} style={styles.holeContainer}>
              <Image
                source={holeImage}
                style={[styles.holeImage, { width: TILE_SIZE, height: TILE_SIZE }]}
                resizeMode="contain"
              />
              {(cat.visible || cat.isAnimating) && (
                <TouchableOpacity
                  style={[styles.catTapArea, { width: TILE_SIZE * 0.6, height: TILE_SIZE * 0.6 }]}
                  onPress={() => handleTapCat(index)}
                  activeOpacity={1}
                  disabled={cat.isAnimating || isGameOver}
                >
                  {renderCatImage(cat)}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* ----- ポーズ画面 ----- */}
        {isPaused && (
          <PauseScreen
            onResume={handleResume}
            onGoToTitle={handleGoToTitle}
          />
        )}

        {/* ----- フィニッシュ画面 ----- */}
        {isGameOver && (
          <FinishScreen />
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
    marginBottom: 80,
    zIndex: 99
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
  },
  catImage: {
    position: 'absolute'
  },
  catTapArea: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
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
