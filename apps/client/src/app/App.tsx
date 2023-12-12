import React from "react"
import { View, Text } from "react-native"
import { Link } from "expo-router"
import { Button, useTheme } from "react-native-paper"

export const App = () => {
  const theme = useTheme()

  return (
    <>
      <View style={{ backgroundColor: theme.colors.primaryContainer }}>
        <Text>This is the App page</Text>
        <Link href="/about">About</Link>
        <Button icon="camera" mode="contained" onPress={() => console.log("Pressed")}>
          Press me
        </Button>
      </View>
    </>
  )
}

export default App
