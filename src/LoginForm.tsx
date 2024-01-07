import React, { useState } from "react"
import { TextField, Button } from "@mui/material"
import { login } from "./firebase"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: any) => {
    e.preventDefault()
    try {
      await login(email, password)
      console.log("User logged in")
      // Redirect or update UI
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <TextField type="email" value={email} onChange={e => setEmail(e.target.value)} label="Email" variant="outlined" placeholder="Email" />
      <TextField
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        label="Password"
        variant="outlined"
        placeholder="Password"
      />
      <Button type="submit" variant="contained" color="primary">
        Login
      </Button>
    </form>
  )
}

export default LoginForm
