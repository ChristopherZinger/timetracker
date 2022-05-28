export type TTracker = {
  id: string
  start: number
  end: number
  category: string
  info: string
}

export type TTrackerInput = Omit<TTracker, 'id'>

// user/{userId}/tracker/{trackerId}
export class Timetracker {

}