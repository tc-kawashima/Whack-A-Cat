import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'

import Background from '../../components/Background'
import holeImage from '../../../assets/holeBox.png'

const { width, height } = Dimensions.get('window')

const GRID_SIZE = 3
const GAME_WIDTH_RATIO = 0.95
const TILE_SIZE = (width * GAME_WIDTH_RATIO) / GRID_SIZE
const GAME_AREA_HEIGHT = width * GAME_WIDTH_RATIO

const DUMMY_PROGRESS = 0.7
const REMAINING_TIME = 30
const TimerBar = () => {
  const barWidth = width * 0.6
  return (
    <View style={[timerStyles.gaugeWrapper, { width: barWidth }]}>
      <View style={timerStyles.gaugeBody}>
        <View style={timerStyles.timerBarWrapper}>
          <View style={[timerStyles.timerBarProgress, { width: `${DUMMY_PROGRESS * 100}%` }]} />
        </View>
      </View>
      <View style={timerStyles.timeCircle}>
        <Text style={timerStyles.timeText}>{REMAINING_TIME}</Text>
      </View>
    </View>
  )
}

const game = () => {
  const moleHoles = Array(GRID_SIZE * GRID_SIZE).fill(0)
  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.infoLayer}>
          <View style={styles.topArea}>
            {/*----- コンボ -----*/}
            <View style={styles.comboArea}>
              <Text style={styles.comboLabel}>コンボ</Text>
              <Text style={styles.comboNumber}>555</Text>
            </View>
            {/*----- ポーズボタン -----*/}
            <TouchableOpacity style={styles.pauseButton}>
              <Text style={styles.pauseButtonText}>II</Text>
            </TouchableOpacity>
          </View>

          {/*----- タイマー -----*/}
          <View style={styles.timerArea}>
            <TimerBar />
          </View>


          {/*----- スコア -----*/}
          <View style={styles.scoreAreaWrapper}>
            <View style={styles.scoreArea}>
              <Text style={styles.scoreLabel}>スコア</Text>
              <Text style={styles.scoreNumber}>9999</Text>
            </View>
          </View>
        </View>


        {/*----- ゲームエリア -----*/}
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
      </View>
    </Background >
  )
}

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
  },
})

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
    alignItems: 'center',
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
    fontSize: 12,
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
    fontWeight: 'bold',

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
    fontWeight: 'normal',
  },
  scoreNumber: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -16,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
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

export default game
