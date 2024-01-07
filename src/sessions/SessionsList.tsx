import { Typography, CircularProgress, Button } from "@mui/material"
import { useState, useEffect } from "react"
import { Session } from "../models"
import { getDocs, collection } from "firebase/firestore"
import { db } from "../firebase"
import { SessionItem } from "./SessionItem"
import { NewSessionForm } from "./NewSessionForm"

const getSessions = async () => {
  const sessionsRef = collection(db, "sessions")

  try {
    const querySnapshot = await getDocs(sessionsRef)
    const sessions: Session[] = []
    querySnapshot.forEach(doc => {
      sessions.push({ id: doc.id, ...doc.data() } as Session)
    })
    sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return sessions
  } catch (error) {
    console.error("Error getting documents: ", error)
    return []
  }
}

export const SessionsList = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)
  const [isAddingSession, setIsAddingSession] = useState(false)

  const fetchSessions = async () => {
    setLoading(true)
    const res = await getSessions()
    setSessions(res)
    console.log(res)
    setLoading(false)
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleSuccessfulSave = () => {
    setIsAddingSession(false)
    fetchSessions()
  }

  const handleCancel = () => {
    setIsAddingSession(false)
  }

  const handleDelete = () => {
    fetchSessions()
  }

  if (loading) return <CircularProgress />

  return (
    <div
      style={{
        display: "grid",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" color="secondary" style={{ marginBottom: "12px" }}>
        Your Sessions
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {sessions.map((session: Session) => (
          <SessionItem key={session.id} session={session} onDelete={handleDelete} />
        ))}
        {isAddingSession ? (
          <NewSessionForm onSave={handleSuccessfulSave} onCancel={handleCancel} />
        ) : (
          <Button variant="outlined" onClick={() => setIsAddingSession(true)}>
            Add Session
          </Button>
        )}
      </div>
    </div>
  )
}
