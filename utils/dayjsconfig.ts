
import dayjs from "dayjs"
import updateLocale from "dayjs/plugin/updateLocale"
import isToday from "dayjs/plugin/isToday"
import weekOfYear from "dayjs/plugin/weekOfYear"
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)
dayjs.extend(isToday)
dayjs.extend(updateLocale)
dayjs.extend(weekOfYear)

dayjs.updateLocale("en", {
  weekStart: 1,
})