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
  climbType: "Lead" | "Toprope" | "Boulder"
}
