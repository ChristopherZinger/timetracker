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
import { InputErrorsMap, Validator } from '../utils/validator'
import { Timeframe, TimeUtils } from '../utils/time'
import { Collections } from './utils/collections'
import { getGenericConverter } from './utils/genericConverger'
import { number, string } from 'yup'
import * as yup from 'yup'

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
  constructor(
    private userId: string,
    private validator = new TimetrackerValidator(yup),
    private timer = new TimeUtils()) {
    const firestore = getFirestore()
    this.collection = collection(
      firestore,
      `${Collections.user}/${this.userId}/${Collections.trackers}`
    ).withConverter(getGenericConverter<TTracker>())
  }

  public async create (data: TTrackerInput): Promise<void | InputErrorsMap> {
    const { id } = doc(this.collection)
    const errors = await this.validator.validate(data)
    return errors
      ? errors
      : await setDoc(doc(this.collection, id), {
        id,
        ...data
      })
  }

  public async update (data: TTracker): Promise<void | InputErrorsMap> {
    const { id, ...newData } = data // newData doesn't override doc's id.
    const errors = await this.validator.validate(newData)
    return errors ? errors : await updateDoc(doc(this.collection, data.id), newData)
  }

  private async getTrackersForTimeframe ({ start, end }: Timeframe) {
    return (
      await getDocs(
        query(
          this.collection,
          where('start', '>=', start),
          where('start', '<', end),
          orderBy('start', 'asc')
        )
      )
    ).docs.map((s) => s.data())
  }

  public async getTrackersForDay (date: Date): Promise<TTracker[]> {
    const timeframe = this.timer.getDayTimeframeForDate(date)
    return await this.getTrackersForTimeframe(timeframe)
  }

  public async getTodaysTrackers (): Promise<TTracker[]> {
    const timeframe = this.timer.getDayTimeframeForDate(new Date())
    return await this.getTrackersForTimeframe(timeframe)
  }
}

class TimetrackerValidator extends Validator {
  schema: any
  constructor(yup: any) {
    super(yup)
    this.schema = this.yup.object().shape({
      start: number().required(),
      end: number().required(),
      categoryId: string().required(),
      info: string()
    })
  }
}
