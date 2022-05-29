import {
  collection,
  CollectionReference,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
  orderBy,
  updateDoc
} from 'firebase/firestore'
import { Collections } from './utils/collections'
import { getGenericConverter } from './utils/genericConverger'

export type TTracker = {
  id: string
  start: number
  end: number
  categoryId: string
  info: string
}

export type TTrackerInput = Omit<TTracker, 'id'>

// user/{userId}/tracker/{trackerId}
export class Timetracker {
  private collection: CollectionReference<TTracker>
  constructor(private userId: string) {
    const firestore = getFirestore()
    this.collection = collection(
      firestore,
      `${Collections.user}/${this.userId}/${Collections.trackers}`
    ).withConverter(getGenericConverter<TTracker>())
  }

  public async create (data: TTrackerInput): Promise<TTracker> {
    const { id } = doc(this.collection)
    await setDoc(doc(this.collection, id), {
      id,
      ...data
    })
    return { ...data, id }
  }

  public async update (data: TTracker): Promise<TTracker> {
    const { id, ...newData } = data // newData doesn't override doc's id.
    await updateDoc(doc(this.collection, data.id), newData)
    return data
  }

  public async getTodaysTrackers (): Promise<TTracker[]> {
    const today = new Date(new Date().toDateString())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return (
      await getDocs(
        query(
          this.collection,
          where('start', '>=', today.getTime()),
          where('start', '<', tomorrow.getTime()),
          orderBy('start', 'asc')
        )
      )
    ).docs.map((s) => s.data())
  }
}
