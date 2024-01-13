import { Button, Card, CircularProgress, Rating, Typography, styled } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { Climb, Session } from "../models"
import { NewClimbForm } from "./NewClimbForm"
import dayjs from "dayjs"
import { ClimbRowItem } from "./ClimbRowItem"

const getClimbs = async (sessionId: string) => {
  const climbsRef = collection(db, "climbs")
  const q = query(climbsRef, where("sessionId", "==", sessionId))
  try {
    const querySnapshot = await getDocs(q)
    const climbs: Climb[] = []
    querySnapshot.forEach(doc => {
      climbs.push({ id: doc.id, ...doc.data() } as Climb)
    })
    return climbs
  } catch (error) {
    console.error("Error getting documents: ", error)
    return []
  }
}

const fetchSession = async (sessionId: string) => {
  const sessionRef = doc(db, "sessions", sessionId)
  try {
    const docSnap = await getDoc(sessionRef)
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data())
    } else {
      console.log("No such document!")
    }
    return docSnap.data() as Session
  } catch (error) {
    console.error("Error getting documents: ", error)
    return null
  }
}

export const ClimbsList = () => {
  const navigate = useNavigate()
  const [climbs, setClimbs] = useState<Climb[]>([])
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  console.log(isLoading)
  const [isAddingClimb, setIsAddingClimb] = useState(false)
  const handleBack = () => {
    navigate("/")
  }

  const { sessionId } = useParams()

  const fetchData = async () => {
    if (!sessionId) {
      return
    }
    const session = await fetchSession(sessionId)
    setSession(session)
    const climbs = await getClimbs(sessionId)
    setClimbs(climbs)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const handleSuccessfulSave = () => {
    setIsAddingClimb(false)
    fetchData()
  }

  const handleCancel = () => {
    setIsAddingClimb(false)
  }

  if (isLoading) return <CircularProgress />

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleBack}>
        Back
      </Button>
      <Typography variant="h4" color="secondary" style={{ marginTop: "16px" }}>
        Climbs
      </Typography>
      <Typography sx={{ fontWeight: "bold", marginBottom: "16px" }}>{dayjs(session?.date).format("dddd, MMMM D, YYYY h:mm A")}</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {climbs.map(climb => (
          <ClimbRowItem key={climb.id} climb={climb} />
        ))}
        {isAddingClimb ? (
          <NewClimbForm sessionId={sessionId} onSave={handleSuccessfulSave} onCancel={handleCancel} />
        ) : (
          <Button variant="contained" onClick={() => setIsAddingClimb(true)}>
            Add Climb
          </Button>
        )}
      </div>
    </div>
  )
}
