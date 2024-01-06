import { Button, Typography } from "@mui/material"
import { auth, login } from "./firebase"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"
import { styled } from "@mui/material/styles"

import { SessionsList } from "./sessions/SessionsList"

export const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, update the state with the user's information
        setCurrentUser(user)
      } else {
        // No user is signed in, set the user in state to null
        setCurrentUser(null)
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    const res = await login()
    setCurrentUser(res.user)
  }

  return (
    <StyledDiv>
      {currentUser ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button variant="contained" onClick={() => auth.signOut()}>Sign Out</Button>
          <Typography>{currentUser.displayName}</Typography>
          <SessionsList />
        </div>
      ) : (
        <Button variant="contained" onClick={handleSignIn}>
          Sign In
        </Button>
      )}
    </StyledDiv>
  )
}

const StyledDiv = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "100vh",
}))
