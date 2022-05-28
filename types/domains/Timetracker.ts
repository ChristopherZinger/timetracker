import { collection, CollectionReference, doc, getFirestore, setDoc } from 'firebase/firestore'
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
    this.collection = collection(firestore, `${Collections.user}/${userId}/${Collections.trackers}`)
      .withConverter(getGenericConverter<TTracker>())
  }

  public async create (data: TTrackerInput) {
    const { id } = doc(this.collection)
    await setDoc(doc(this.collection, id), {
      id,
      ...data
    })
  }
}