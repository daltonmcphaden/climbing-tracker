import { Button, Card, CircularProgress, Rating, Typography, styled } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { Climb, Session } from "../models"
import { NewClimbForm } from "./NewClimbForm"
import dayjs from "dayjs"
import PersonIcon from "@mui/icons-material/Person"

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
      <Button variant="outlined" onClick={handleBack}>
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
          <Card
            key={climb.id}
            variant="outlined"
            style={{
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <StyledLabelDiv>
                <Typography style={{ fontWeight: "bold" }}>Grade:</Typography> {climb.grade}
              </StyledLabelDiv>
              <StyledLabelDiv>
                <Typography style={{ fontWeight: "bold" }}>Hold color:</Typography>
                {climb.holdColor}
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: climb.holdColor,
                  }}
                ></span>
              </StyledLabelDiv>
              <StyledLabelDiv>
                <Typography style={{ fontWeight: "bold" }}>Type:</Typography> {climb.climbType}
              </StyledLabelDiv>
              <StyledLabelDiv>
                <Typography style={{ fontWeight: "bold" }}>Perceived Difficulty:</Typography> {climb.perceivedDifficulty}
              </StyledLabelDiv>
              <StyledLabelDiv>
                <Typography style={{ fontWeight: "bold" }}>Rating:</Typography> <Rating name="read-only" value={climb.rating} readOnly />
              </StyledLabelDiv>
              <StyledLabelDiv>
                <Typography style={{ fontWeight: "bold" }}>Climbers:</Typography>{" "}
                {climb.climberNames?.map(name => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <PersonIcon color={"action"} fontSize="inherit" />
                    <Typography variant="body1" key={name}>
                      {name}
                    </Typography>
                  </div>
                ))}
              </StyledLabelDiv>
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
    </div>
  )
}

const StyledLabelDiv = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
}))
