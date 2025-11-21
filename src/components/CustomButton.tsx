import React from 'react'
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native'

interface ButtonProps {
  title: string
  color: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

const CustomButton = ({ title, color, onPress, style }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%', // 親Viewの幅全体を使う
    padding: 15,
    borderRadius: 30, // 角を丸くする
    marginVertical: 10, // 上下のマージン
    alignItems: 'center',
    // 💡 影のスタイル (iOS/Android共通で設定)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default CustomButton
