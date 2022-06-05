import day from 'dayjs'

export type Timeframe = {
  start: number
  end: number
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
}
