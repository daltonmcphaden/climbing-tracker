import { Card, CardActionArea, useTheme } from "@mui/material"
import { Session } from "../models"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

interface Props {
  session: Session
}

export const SessionItem = (props: Props) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const formattedDate = dayjs(props.session.date).format("MMMM D, YYYY h:mm A")
  const handleClick = () => {
    navigate(`/session/${props.session.id}`)
  }

  return (
    <Card variant="outlined">
      <CardActionArea onClick={handleClick} style={{ padding: theme.spacing(2) }}>
        {formattedDate}
        {props.session.climberNames?.map(name => <div key={name}>{name}</div>)}
      </CardActionArea>
    </Card>
  )
}
