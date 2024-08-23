import { isAfter, isToday, subDays } from "date-fns";

export const DATE_INTERVALS = {
  any_time: {
    value: "Any time",
    helper: () => true,
  },
  today: {
    value: "Today",
    helper: (date: string) => isToday(new Date(date)),
  },
  last_3_days: {
    value: "Last 3 days",
    helper: (date: string) =>
      isAfter(new Date(date), subDays(new Date(date), 3)),
  },
  last_week: {
    value: "Last week",
    helper: (date: string) =>
      isAfter(new Date(date), subDays(new Date(date), 7)),
  },
  last_month: {
    value: "Last month",
    helper: (date: string) =>
      isAfter(new Date(date), subDays(new Date(date), 30)),
  },
  last_year: {
    value: "Last year",
    helper: (date: string) =>
      isAfter(new Date(date), subDays(new Date(date), 365)),
  },
};
