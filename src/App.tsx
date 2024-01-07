import { Button, Typography } from "@mui/material"
import { auth } from "./firebase"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"
import { styled } from "@mui/material/styles"

import { SessionsList } from "./sessions/SessionsList"
import LoginForm from "./LoginForm"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ClimbsList } from "./climbs/ClimbsList"

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <SessionsList />,
    },
    {
      path: "/session/:sessionId",
      element: <ClimbsList />,
    },
  ])

  return (
    <StyledDiv>
      {currentUser ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button variant="contained" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
          <Typography>{currentUser.displayName}</Typography>
          <RouterProvider router={router} />
        </div>
      ) : (
        <LoginForm />
      )}
    </StyledDiv>
  )
}

const StyledDiv = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(4),
  height: "100vh",
}))
