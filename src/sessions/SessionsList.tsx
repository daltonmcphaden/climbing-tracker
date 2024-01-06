import { Typography, CircularProgress, Button } from "@mui/material"
import { useState, useEffect } from "react"
import { Session } from "../models"
import { getDocs, collection, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { SessionItem } from "./SessionItem"

const getSessions = async (userId: string) => {
  const sessionsRef = collection(db, "sessions")
  const q = query(sessionsRef, where("climberIds", "array-contains", userId))

  try {
    const querySnapshot = await getDocs(q)
    const sessions: Session[] = []
    querySnapshot.forEach(doc => {
      sessions.push({ id: doc.id, ...doc.data() } as Session)
    })
    return sessions
  } catch (error) {
    console.error("Error getting documents: ", error)
    return []
  }
}

export const SessionsList = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSessions = async () => {
    setLoading(true)
    const res = await getSessions("VWAdj6K5MdboViWJhD2X6VicIwl1")
    setSessions(res)
    console.log(res)
    setLoading(false)
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return (
    <div>
      <Typography variant="h4">Sessions</Typography>
      {loading ? <CircularProgress /> : sessions.map((session: Session) => <SessionItem key={session.id} session={session} />)}
      <Button variant="outlined">Add Session</Button>
    </div>
  )
}
