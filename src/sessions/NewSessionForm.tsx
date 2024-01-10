import { Button, Card, Checkbox, FormControlLabel, FormGroup, Typography, useTheme } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { useEffect, useState } from "react"
import { Session } from "../models"
import { addDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

const getClimberNames = async () => {
  const climbersRef = collection(db, "climbers")
  try {
    const querySnapshot = await getDocs(climbersRef)
    const names: string[] = []
    querySnapshot.forEach(doc => {
      console.log(doc)
      names.push(doc.data()?.name)
    })
    return names
  } catch (error) {
    console.error("Error getting documents: ", error)
    return []
  }
}

const saveSession = async (session: Omit<Session, "id">) => {
  const sessionsRef = collection(db, "sessions")
  const docRef = await addDoc(sessionsRef, session)
  return docRef
}

interface Props {
  onSave: () => void
  onCancel: () => void
}

export const NewSessionForm = (props: Props) => {
  const theme = useTheme()
  const [dateValue, setDateValue] = useState<Date | null>(null)
  const [climberNames, setClimberNames] = useState<string[]>([])
  const [selectedClimbers, setSelectedClimbers] = useState<string[]>([])
  console.log(selectedClimbers)

  const fetchClimberNames = async () => {
    const climbers = await getClimberNames()
    setClimberNames(climbers)
    setSelectedClimbers(climbers)
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
    if (!dateValue) {
      console.log("No date set")
      return
    }
    if (selectedClimbers.length === 0) {
      console.log("No climbers selected")
      return
    }
    const newSession: Omit<Session, "id"> = {
      date: dateValue?.toString(),
      climberNames: selectedClimbers,
    }
    try {
      const docRef = await saveSession(newSession)
      console.log("Document written with ID: ", docRef.id)
      props.onSave()
    } catch (error) {
      console.error("Error adding document: ", error)
    }
  }

  const handleCancel = () => {
    props.onCancel()
  }

  return (
    <Card variant="outlined" style={{ display: "flex", flexDirection: "column", gap: "8px", padding: theme.spacing(2) }}>
      <Typography variant="h5">New Session</Typography>
      <DateTimePicker value={dateValue} onChange={newValue => setDateValue(newValue)} />
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
