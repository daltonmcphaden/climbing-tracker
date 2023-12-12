import React from "react"
import { View, Text } from "react-native"
import { Link } from "expo-router"

export const App = () => {
  return (
    <>
      <View>
        <Text>Hello world</Text>
        <Link href="/about">About</Link>
      </View>
    </>
  )
}

export default App
