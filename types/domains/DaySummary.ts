import { Timetracker, TTracker } from './Timetracker'
import { MonthIndex, TimeUtils } from '../utils/time'
import { Category } from './Category'
import { AppError } from '../../utils/appError'
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  getFirestore,
  setDoc
} from 'firebase/firestore'
import { Collections } from './utils/collections'
import { getGenericConverter } from './utils/genericConverger'

type DayDate = {
  day: number
  month: MonthIndex
  year: number
}

export type TDaySummary = {
  id: string
  day: DayDate
  summary: {
    totalMinutesPerCategory: CategorySummary
    totalDayLengthInMinutes: number
  }
  trackers: TTracker[]
  createdAt: Date
}

type CategorySummary = Record<
  string,
  {
    category: {
      abbreviation: string
      name: string
      id: string
      colorHex: string
    }
    nrOfMinutes: number
  }
>

type TDaySummaryInput = Omit<TDaySummary, 'id'>

// user/{userId}/day-summary/{year}:{month}:{day}
export class DaySummary {
  private timetracker: Timetracker
  private category: Category
  private collection: CollectionReference<TDaySummary>

  constructor(private userId: string, private timeutils = new TimeUtils()) {
    this.timetracker = new Timetracker(this.userId)
    this.category = new Category(this.userId)

    const firestore = getFirestore()

    this.collection = collection(
      firestore,
      `${Collections.user}/${this.userId}/${Collections.daySummary}`
    ).withConverter(getGenericConverter<TDaySummary>())


  }

  private async calculateDaySummaryForDate (date: Date): Promise<TDaySummaryInput> {
    const trackers = await this.timetracker.getTrackersForDay(date)
    const day: DayDate = {
      day: date.getDate(),
      month: date.getMonth() as MonthIndex,
      year: date.getFullYear()
    }

    const allCategories = await this.category.getAll()

    const totalMinutesPerCategory = trackers.reduce(
      (acc: CategorySummary, tracker): CategorySummary => {
        const duration = this.timeutils.timeframeToNrOfMinutes({
          start: tracker.start,
          end: tracker.end
        })
        const category = allCategories.find(
          (c) => c.id === tracker.categoryId
        )

        if (!category) {
          throw new AppError(
            'tracker is assigned to non existing category. trackerId: ' +
            tracker.id
          )
        }

        if (acc[tracker.categoryId]) {
          acc[tracker.categoryId].nrOfMinutes += duration
        } else {
          acc[tracker.categoryId] = {
            nrOfMinutes: duration,
            category: {
              abbreviation: category.abbreviation,
              id: category.id,
              name: category.name,
              colorHex: category.colorHex
            }
          }
        }
        return acc
      },
      {}
    )

    const totalDayLengthInMinutes = trackers.reduce(
      (totalLength: number, tracker) => {
        return (
          totalLength +
          this.timeutils.timeframeToNrOfMinutes({
            start: tracker.start,
            end: tracker.end
          })
        )
      },
      0
    )

    return {
      day,
      trackers,
      summary: {
        totalMinutesPerCategory,
        totalDayLengthInMinutes
      },
      createdAt: new Date()
    }
  }

  public async createDaySummaryForDate (date: Date) {
    const summary = await this.calculateDaySummaryForDate(date)
    await this.create(summary)
  }

  private async create (summary: TDaySummaryInput): Promise<void> {
    const { day: { day, month, year } } = summary
    const id = `${year}:${month}:${day}`
    await setDoc(doc(this.collection, id), summary)
  }

  public async getDaySummaryForDate (date: Date): Promise<TDaySummary | undefined> {
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    return (await getDoc(doc(this.collection, `${year}:${month}:${day}`))).data()
  }
}
