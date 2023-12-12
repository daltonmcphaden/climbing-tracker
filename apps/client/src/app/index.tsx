import * as React from "react"
import { AppRegistry } from "react-native"
import { expo } from "./../../app.json"
import App from "./App"
import { PaperProvider } from "react-native-paper"
import { theme } from "../hooks/theme"

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  )
}

AppRegistry.registerComponent(expo.name, () => Main)
