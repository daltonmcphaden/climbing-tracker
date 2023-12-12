import { Text, View } from "react-native"

import { Link } from "expo-router"

export default function About() {
  return (
    <View>
      <Text>Welcome to the about page</Text>
      <Link href="/App">Home</Link>
    </View>
  )
}
