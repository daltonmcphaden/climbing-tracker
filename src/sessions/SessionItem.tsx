import { Card, CardActionArea, IconButton, useTheme } from "@mui/material"
import { Session } from "../models"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import DeleteIcon from "@mui/icons-material/Delete"
import ConfirmationDialog from "../components/ConfirmationDialog"
import { useState } from "react"
import { db } from "../firebase"
import { deleteDoc, doc, collection, query, where, getDocs, deleteField } from "firebase/firestore"

const deleteSession = async (sessionId: string) => {
  console.log("Deleting session", sessionId)

  // Delete climbs with the same sessionId
  const climbsRef = collection(db, "climbs")
  const climbsQuery = query(climbsRef, where("sessionId", "==", sessionId))
  const climbsSnapshot = await getDocs(climbsQuery)
  climbsSnapshot.forEach(climbDoc => {
    deleteDoc(climbDoc.ref)
  })

  // Delete the session
  const sessionRef = doc(db, "sessions", sessionId)
  await deleteDoc(sessionRef)
}

interface Props {
  session: Session
  onDelete: () => void
}

export const SessionItem = (props: Props) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const formattedDate = dayjs(props.session.date).format("dddd, MMMM D, YYYY h:mm A")
  const handleClick = () => {
    navigate(`/session/${props.session.id}`)
  }

  const handleDelete = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    await deleteSession(props.session.id)
    props.onDelete()
    handleClose()
  }

  return (
    <Card variant="outlined">
      <CardActionArea onClick={handleClick} style={{ padding: theme.spacing(2) }}>
        <div>
          {formattedDate}
          {props.session.climberNames?.map(name => <div key={name}>{name}</div>)}
        </div>
      </CardActionArea>
      <IconButton
        onClick={e => {
          e.stopPropagation()
          handleDelete()
        }}
      >
        <DeleteIcon />
      </IconButton>
      <ConfirmationDialog open={open} handleClose={handleClose} dialogTitle={"Delete Session"} handleConfirm={handleConfirm} />
    </Card>
  )
}
