import React, { useState } from "react"
import { TextField, Button, styled } from "@mui/material"
import { login } from "../firebase"

export const LoginForm = () => {
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
    <StyledDiv>
      <Header>Climbing Buddy</Header>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "24px", justifyContent: "center", alignItems: "center" }}
      >
        <TextField
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          label="Email"
          variant="outlined"
          placeholder="Email"
          style={{ width: "300px" }}
        />
        <TextField
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          label="Password"
          variant="outlined"
          placeholder="Password"
          style={{ width: "300px" }}
        />
        <Button type="submit" variant="contained" color="secondary" style={{ width: "300px" }}>
          Login
        </Button>
      </form>
    </StyledDiv>
  )
}

const StyledDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(4),
  marginTop: "20%",
}))

const Header = styled("h1")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "48px",
}))
