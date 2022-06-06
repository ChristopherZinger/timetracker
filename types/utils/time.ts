import day from 'dayjs'

export type Timeframe = {
  start: number
  end: number
}

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6
export function isDayIndex (day: number): day is DayIndex {
  return [0, 1, 2, 3, 4, 5, 6].includes(day)
}

export class TimeUtils {
  private dayjs: (date?: day.ConfigType) => day.Dayjs
  constructor(d: (date?: day.ConfigType) => day.Dayjs = day) {
    this.dayjs = d
  }

  public timestampToHourMinute (timestamp: number) {
    return this.dayjs(timestamp).format('HH:mm')
  }

  public getDayTimeframeForDate (date: Date): Timeframe {
    const dayStart = new Date(date.toDateString())
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)
    return {
      start: dayStart.getTime(),
      end: dayEnd.getTime()
    }
  }

  public timeframeToNrOfMinutes ({ start, end }: Timeframe): number {
    return Math.abs(this.dayjs(start).diff(end, 'minute'))
  }

  public minutesToHours (nrOfMinutes: number): string {
    const nrOfHours = Math.floor(nrOfMinutes / 60)
    const minutes = nrOfMinutes - nrOfHours * 60
    return `${nrOfHours}:${minutes < 10 ? '0' : ''}${minutes}`
  }
}
