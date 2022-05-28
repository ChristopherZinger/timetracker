import dayjs from 'dayjs'

export class TimeUtils {
  constructor(private dayjs: any) { }

  public static timestampToHourMinute (timestamp: number) {
    return dayjs(timestamp).format("HH:mm")
  }
}
