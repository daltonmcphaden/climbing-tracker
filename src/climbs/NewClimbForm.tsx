import {
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material"
import { useEffect, useState } from "react"
import { Climb, PinCoordinate, Session } from "../models"
import { addDoc, collection, doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { GymMap } from "../components/GymMap"

const getSession = async (sessionId: string) => {
  const sessionRef = doc(db, "sessions", sessionId)

  try {
    const docSnapshot = await getDoc(sessionRef)
    if (docSnapshot.exists()) {
      const sessionData = docSnapshot.data() as Session
      console.log(sessionData)
      return sessionData
    } else {
      console.log("Session not found")
      return null
    }
  } catch (error) {
    console.error("Error getting session: ", error)
    return null
  }
}

const saveClimb = async (climb: Omit<Climb, "id">) => {
  const climbsRef = collection(db, "climbs")
  const docRef = await addDoc(climbsRef, climb)
  return docRef
}

interface Props {
  sessionId?: string
  onSave: () => void
  onCancel: () => void
}

export const NewClimbForm = (props: Props) => {
  const theme = useTheme()
  const [grade, setGrade] = useState<string>("")
  const [holdColor, setHoldColor] = useState<string>("")
  const [climbType, setClimbType] = useState<Climb["climbType"] | "">("")
  const [climberNames, setClimberNames] = useState<string[]>([])
  const [selectedClimbers, setSelectedClimbers] = useState<string[]>([])
  const [perceivedDifficulty, setPerceivedDifficulty] = useState<Climb["perceivedDifficulty"] | "">("")
  const [pinLocation, setPinLocation] = useState<PinCoordinate>()
  const [rating, setRating] = useState<number | null>()

  const fetchClimberNames = async () => {
    if (!props.sessionId) {
      return
    }
    const session = await getSession(props.sessionId)
    console.log(session)
    setClimberNames(session?.climberNames || [])
    setSelectedClimbers(session?.climberNames || [])
  }

  useEffect(() => {
    fetchClimberNames()
  }, [])

  const handleCheckboxChange = (e: any, name: string) => {
    console.log(name)
    console.log(e.target.checked)
    if (e.target.checked) {
      setSelectedClimbers([...selectedClimbers, name])
    } else {
      setSelectedClimbers(selectedClimbers.filter(climber => climber !== name))
    }
  }

  const handleSave = async () => {
    if (selectedClimbers.length === 0) {
      console.log("No climbers selected")
      return
    }
    if (!props.sessionId) {
      console.log("No session ID")
      return
    }
    if (!grade) {
      console.log("No grade selected")
      return
    }
    if (!holdColor) {
      console.log("No hold color selected")
      return
    }
    if (!climbType) {
      console.log("No climb type selected")
      return
    }
    if (!perceivedDifficulty) {
      console.log("No perceived difficulty selected")
      return
    }
    if (!rating) {
      console.log("No rating selected")
      return
    }
    if (!pinLocation) {
      console.log("No pin location selected")
      return
    }
    const newClimb: Omit<Climb, "id"> = {
      sessionId: props.sessionId,
      climberNames: selectedClimbers,
      grade,
      climbType,
      holdColor,
      perceivedDifficulty,
      rating,
      pinLocation,
    }
    try {
      const docRef = await saveClimb(newClimb)
      console.log("Document written with ID: ", docRef.id)
      props.onSave()
    } catch (error) {
      console.error("Error adding document: ", error)
    }
  }

  const handleCancel = () => {
    props.onCancel()
  }

  const handleGradeChange = (event: SelectChangeEvent<string>) => {
    setGrade(event.target.value as string)
  }

  const handleHoldColorChange = (event: SelectChangeEvent<string>) => {
    setHoldColor(event.target.value as string)
  }

  const handleClimbTypeChange = (event: SelectChangeEvent<string>) => {
    setClimbType(event.target.value as Climb["climbType"])
  }

  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    setPerceivedDifficulty(event.target.value as Climb["perceivedDifficulty"])
  }

  return (
    <Card variant="outlined" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: theme.spacing(2) }}>
      <Typography variant="h5">New Climb</Typography>
      <FormControl>
        <InputLabel>Grade</InputLabel>
        <Select value={grade} onChange={handleGradeChange} label="Grade">
          <MenuItem value={"5.7"}>5.7</MenuItem>
          <MenuItem value={"5.8"}>5.8</MenuItem>
          <MenuItem value={"5.9"}>5.9</MenuItem>
          <MenuItem value={"5.10a"}>5.10a</MenuItem>
          <MenuItem value={"5.10b"}>5.10b</MenuItem>
          <MenuItem value={"5.10c"}>5.10c</MenuItem>
          <MenuItem value={"5.10d"}>5.10d</MenuItem>
          <MenuItem value={"5.11a"}>5.11a</MenuItem>
          <MenuItem value={"5.11b"}>5.11b</MenuItem>
          <MenuItem value={"5.11c"}>5.11c</MenuItem>
          <MenuItem value={"5.11d"}>5.11d</MenuItem>
          <MenuItem value={"5.12a"}>5.12a</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Hold Colour</InputLabel>
        <Select value={holdColor} onChange={handleHoldColorChange} label="Hold Colour">
          <MenuItem value={"Yellow"}>Yellow</MenuItem>
          <MenuItem value={"Orange"}>Orange</MenuItem>
          <MenuItem value={"Green"}>Green</MenuItem>
          <MenuItem value={"Blue"}>Blue</MenuItem>
          <MenuItem value={"Purple"}>Purple</MenuItem>
          <MenuItem value={"Red"}>Red</MenuItem>
          <MenuItem value={"Black"}>Black</MenuItem>
          <MenuItem value={"White"}>White</MenuItem>
          <MenuItem value={"Pink"}>Pink</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Climb Type</InputLabel>
        <Select value={climbType} onChange={handleClimbTypeChange} label="Climb Type">
          <MenuItem value={"Lead"}>Lead</MenuItem>
          <MenuItem value={"Top Rope"}>Top Rope</MenuItem>
          <MenuItem value={"Auto Belay"}>Auto Belay</MenuItem>
          <MenuItem value={"Boulder"}>Boulder</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Perceived Difficulty</InputLabel>
        <Select value={perceivedDifficulty} onChange={handleDifficultyChange} label="Perceived Difficulty">
          <MenuItem value={"Easy"}>Easy</MenuItem>
          <MenuItem value={"Medium"}>Medium</MenuItem>
          <MenuItem value={"Hard"}>Hard</MenuItem>
          <MenuItem value={"Very Hard"}>Very Hard</MenuItem>
        </Select>
      </FormControl>
      <Typography component="legend">Location</Typography>
      <GymMap pinLocation={pinLocation} handleSetPinLocation={(location: PinCoordinate) => setPinLocation(location)} />
      <div>
        <Typography component="legend">Rating</Typography>
        <Rating
          value={rating || 0}
          onChange={(event, newValue) => {
            setRating(newValue)
          }}
        />
      </div>
      <FormGroup>
        {climberNames.map(name => (
          <FormControlLabel
            key={name}
            checked={selectedClimbers.includes(name)}
            onChange={e => handleCheckboxChange(e, name)}
            control={<Checkbox />}
            label={name}
          />
        ))}
      </FormGroup>
      <Button variant="outlined" color="success" onClick={handleSave}>
        Save
      </Button>
      <Button variant="outlined" color="error" onClick={handleCancel}>
        Cancel
      </Button>
    </Card>
  )
}
