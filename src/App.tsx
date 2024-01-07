import { auth } from "./firebase"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"

import { SessionsList } from "./sessions/SessionsList"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ClimbsList } from "./climbs/ClimbsList"
import { LoginForm } from "./components/LoginForm"
import { AppMenuBar } from "./components/AppMenuBar"
import { CircularProgress } from "@mui/material"
import { theme } from "./theme"

export const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, update the state with the user's information
        setCurrentUser(user)
      } else {
        // No user is signed in, set the user in state to null
        setCurrentUser(null)
      }
      setIsLoading(false)
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

  if (isLoading) return <CircularProgress />

  return (
    <>
      {currentUser ? (
        <>
          <AppMenuBar />
          <div style={{ padding: theme.spacing(3) }}>
            <RouterProvider router={router} />
          </div>
        </>
      ) : (
        <LoginForm />
      )}
    </>
  )
}
