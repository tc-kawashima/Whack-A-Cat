import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import { Link, router } from 'expo-router'

import Background from '../../components/Background'
import CustomButton from '../../components/CustomButton'
import titleLogo from '../../../assets/titleLogo.png'


const { height } = Dimensions.get('window')

const home = () => {
  const handlePress = (screen: string) => {
    if (screen === 'スタート') {
      router.push('/auth/game')
    } else if (screen === 'ランキング') {
      router.push('/ranking')
    } else if (screen === 'ルール') {
      router.push('/rules')
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
    width: '90%',
    height: height * 0.15,
    marginTop: 120
  },
  buttonContainer: {
    width: '60%',
    alignItems: 'center',
    marginBottom: 120
  }
})

export default home
