import { Card, CardActionArea, useTheme } from "@mui/material"
import { Session } from "../models"

interface Props {
  session: Session
}

export const SessionItem = (props: Props) => {
  const theme = useTheme()
  const handleClick = () => {
    console.log(props.session.id)
  }

  return (
    <Card variant="outlined">
      <CardActionArea onClick={handleClick} style={{ padding: theme.spacing(2) }}>
        {props.session.date.toString()}
        {props.session.climberIds.map(climberId => (
          <div key={climberId}>{climberId}</div>
        ))}
      </CardActionArea>
    </Card>
  )
}
