const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getTodayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getNextSevenDaysEnd() {
  const date = getTodayStart();
  date.setTime(date.getTime() + 7 * DAY_IN_MS);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function isOverdue(dueAt: Date | null, status: string) {
  if (!dueAt || status === "DONE" || status === "CANCELED") {
    return false;
  }

  return dueAt < getTodayStart();
}

export function isDueSoon(dueAt: Date | null, status: string) {
  if (!dueAt || status === "DONE" || status === "CANCELED") {
    return false;
  }

  const today = getTodayStart();
  return dueAt >= today && dueAt <= getNextSevenDaysEnd();
}
