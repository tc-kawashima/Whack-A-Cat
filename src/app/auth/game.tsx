import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'

import Background from '../../components/Background'
import holeImage from '../../../assets/holeBox.png'

const { width, height } = Dimensions.get('window')

const GRID_SIZE = 3
const GAME_WIDTH_RATIO = 0.95
const TILE_SIZE = (width * GAME_WIDTH_RATIO) / GRID_SIZE
const GAME_AREA_HEIGHT = width * GAME_WIDTH_RATIO

const game = () => {
  const moleHoles = Array(GRID_SIZE * GRID_SIZE).fill(0)
  return (
    <Background>
      <View style={styles.container}>
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
    </Background>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
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
