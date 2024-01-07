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

  const handleSuccessfulSave = () => {
    setIsAddingSession(false)
    fetchSessions()
  }

  const handleCancel = () => {
    setIsAddingSession(false)
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return (
    <div>
      <Typography variant="h4">Sessions</Typography>
      {loading ? <CircularProgress /> : sessions.map((session: Session) => <SessionItem key={session.id} session={session} />)}
      {isAddingSession ? (
        <NewSessionForm onSave={handleSuccessfulSave} onCancel={handleCancel} />
      ) : (
        <Button variant="outlined" onClick={() => setIsAddingSession(true)}>
          Add Session
        </Button>
      )}
    </div>
  )
}
