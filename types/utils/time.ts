import dayjs from 'dayjs'

export class TimeUtils {
  constructor() { }

  public timestampToHourMinute (timestamp: number) {
    return dayjs(timestamp).format("HH:mm")
  }
}
