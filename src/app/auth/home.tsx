import React from 'react'
import { StyleSheet, View, Image, Dimensions } from 'react-native'
import { router } from 'expo-router'

import Background from '../../components/Background'
import CustomButton from '../../components/CustomButton'
import titleLogo from '../../../assets/titleLogo.png'


const { width, height } = Dimensions.get('window')

const Home = () => {
  const handlePress = (screen: string) => {
    if (screen === 'スタート') {
      router.push('/auth/Game')
    } else if (screen === 'ランキング') {
      router.push('/Ranking')
    } else if (screen === 'ルール') {
      router.push('/Rules')
    }
  }

  return (
    <Background>
      <View style={styles.container}>
        <Image
          source={titleLogo}
          style={styles.titleLogo}
          resizeMode="contain"
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title="スタート"
            color="#D9534F"
            onPress={() => handlePress('スタート')}
          />
          <CustomButton
            title="ランキング"
            color="#2E97D8"
            onPress={() => handlePress('ランキング')}
          />
          <CustomButton
            title="ルール"
            color="#7A7A7A"
            onPress={() => handlePress('ルール')}
          />
        </View>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleLogo: {
    width: width * 0.9,
    height: height * 0.5
  },
  buttonContainer: {
    width: '60%',
    alignItems: 'center',
    marginBottom: 120
  }
})

export default Home
