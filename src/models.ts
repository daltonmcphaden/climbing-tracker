export interface Climber {
  id: string
  name: string
}

export interface Session {
  id: string
  date: string
  climberNames: string[]
}

export interface Climb {
  id: string
  sessionId: string
  climberNames: string[]
  grade: string
  holdColor: string
  climbType: "Lead" | "Top Rope" | "Boulder" | "Auto Belay"
  perceivedDifficulty: "easy" | "medium" | "hard" | "very hard"
  rating: number
  pinLocation: PinCoordinate
}

export interface PinCoordinate {
  x: number
  y: number
}
