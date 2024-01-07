import { Button, Card } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { Climb } from "../models"
import { NewClimbForm } from "./NewClimbForm"

const getClimbs = async (sessionId: string) => {
  const climbsRef = collection(db, "climbs")
  const q = query(climbsRef, where("sessionId", "==", sessionId))
  try {
    const querySnapshot = await getDocs(q)
    const climbs: Climb[] = []
    querySnapshot.forEach(doc => {
      climbs.push(doc.data() as Climb)
    })
    return climbs
  } catch (error) {
    console.error("Error getting documents: ", error)
    return []
  }
}

export const ClimbsList = () => {
  const navigate = useNavigate()
  const [climbs, setClimbs] = useState<Climb[]>([])
  const [isAddingClimb, setIsAddingClimb] = useState(false)
  const handleBack = () => {
    navigate("/")
  }

  const { sessionId } = useParams()

  const fetchClimbs = async () => {
    if (!sessionId) {
      return
    }
    const climbs = await getClimbs(sessionId)
    setClimbs(climbs)
  }

  useEffect(() => {
    fetchClimbs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const handleSuccessfulSave = () => {
    setIsAddingClimb(false)
    fetchClimbs()
  }

  const handleCancel = () => {
    setIsAddingClimb(false)
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleBack}>
        Back
      </Button>
      <h1>Session: {sessionId}</h1>
      {climbs.map(climb => (
        <Card key={climb.id} variant="outlined" style={{ padding: "8px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>Grade: {climb.grade}</div>
            <div>Hold color: {climb.holdColor}</div>
            <div>Type: {climb.climbType}</div>
            {climb.climberNames?.map(name => <div key={name}>{name}</div>)}
          </div>
        </Card>
      ))}
      {isAddingClimb ? (
        <NewClimbForm sessionId={sessionId} onSave={handleSuccessfulSave} onCancel={handleCancel} />
      ) : (
        <Button variant="outlined" onClick={() => setIsAddingClimb(true)}>
          Add Climb
        </Button>
      )}
    </div>
  )
}
