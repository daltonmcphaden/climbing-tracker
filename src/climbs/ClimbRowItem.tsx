import { Card, Typography, Rating, Button, styled } from "@mui/material"
import { Climb, PinCoordinate } from "../models"
import PersonIcon from "@mui/icons-material/Person"
import { GymMap } from "../components/GymMap"
import { useState } from "react"

interface Props {
  climb: Climb
}

export const ClimbRowItem = (props: Props) => {
  const [isShowingLocation, setIsShowingLocation] = useState(false)
  const toggleIsShowingLocation = () => {
    setIsShowingLocation(!isShowingLocation)
  }

  return (
    <Card
      key={props.climb.id}
      variant="outlined"
      style={{
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <StyledLabelDiv>
          <Typography style={{ fontWeight: "bold" }}>Grade:</Typography> {props.climb.grade}
        </StyledLabelDiv>
        <StyledLabelDiv>
          <Typography style={{ fontWeight: "bold" }}>Hold color:</Typography>
          {props.climb.holdColor}
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: props.climb.holdColor,
            }}
          ></span>
        </StyledLabelDiv>
        <StyledLabelDiv>
          <Typography style={{ fontWeight: "bold" }}>Type:</Typography> {props.climb.climbType}
        </StyledLabelDiv>
        <StyledLabelDiv>
          <Typography style={{ fontWeight: "bold" }}>Perceived Difficulty:</Typography> {props.climb.perceivedDifficulty}
        </StyledLabelDiv>
        <StyledLabelDiv>
          <Typography style={{ fontWeight: "bold" }}>Rating:</Typography> <Rating name="read-only" value={props.climb.rating} readOnly />
        </StyledLabelDiv>
        <StyledLabelDiv>
          <Typography style={{ fontWeight: "bold" }}>Climbers:</Typography>{" "}
          {props.climb.climberNames?.map(name => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <PersonIcon color={"action"} fontSize="inherit" />
              <Typography variant="body1" key={name}>
                {name}
              </Typography>
            </div>
          ))}
        </StyledLabelDiv>
        {props.climb.pinLocation && (
          <StyledLabelDiv style={{ margin: "4px 0px" }}>
            <Button variant="outlined" onClick={toggleIsShowingLocation}>
              {isShowingLocation ? "Hide" : "Show"} Location
            </Button>
          </StyledLabelDiv>
        )}
        {isShowingLocation && (
          <GymMap
            pinLocation={props.climb.pinLocation}
            handleSetPinLocation={(location: PinCoordinate) => {
              console.log("clicking does nothing, this is view only")
            }}
          />
        )}
      </div>
    </Card>
  )
}

const StyledLabelDiv = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
}))
