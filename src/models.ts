export interface Session {
  id: string
  date: string
  climberIds: string[]
}

export interface Climb {
  id: string
  climberId: string
  name: string
  grade: string
  attempts: number
  notes: string
}

export interface Climber {
  id: string
  name: string
}
