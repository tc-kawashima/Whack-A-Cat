import { View, Text, StyleSheet } from 'react-native'

const game = () => {
  return (
    <View style={styles.container}>
      <Text>ゲーム画面 - モグラ叩きをここに実装</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})

export default game
