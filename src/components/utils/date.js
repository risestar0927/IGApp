export const NUMBER_OF_FUTURE_MONTHS = 12;

export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(dateStr) {
  if (dateStr) {
    const [monthNum, yearNum] = dateStr.split('/');
    return `${monthNames[monthNum - 1]} ${yearNum.substr(2, 2)}`;
  }
  else {
    return null;
  }
}

export function getDates(dateStr, includingPast = false, includingFuture = true) {
  return getDatesSpecific(dateStr,
    includingPast ? NUMBER_OF_FUTURE_MONTHS : 0,
    includingFuture ? NUMBER_OF_FUTURE_MONTHS : 0,
    false);
}

export function getRawDates(dateStr, includingPast = false, includingFuture = true) {
  return getRawDatesSpecific(dateStr,
    includingPast ? NUMBER_OF_FUTURE_MONTHS : 0,
    includingFuture ? NUMBER_OF_FUTURE_MONTHS : 0)
}

export function getQuarterOffset(dates) {
  const lastIndexOfFirstQuarter = dates && dates.findIndex(date => {
    const month = date.getMonth();
    return (month + 1) % 3 === 0;
  });

  return (lastIndexOfFirstQuarter && lastIndexOfFirstQuarter >= 0) ? lastIndexOfFirstQuarter + 1 : null;
}

export function formatSpecificDate(date, isSystemDate) {
  const monthStr = isSystemDate ? date.getMonth() + 1 : monthNames[date.getMonth()];
  const yearStr = isSystemDate ? date.getFullYear().toString() : date.getFullYear().toString().substr(2, 2);
  const delimiter = isSystemDate ? '/' : ' ';
  return monthStr + delimiter + yearStr;
}

export function getRawDatesSpecific(dateStr, numberOfPast, numberOfFuture) {
  if (dateStr) {
    const dates = [];
    const planDate = dateStr.split('/');
    for (let i = -numberOfPast; i < numberOfFuture; i++) {
      const date = new Date(planDate[1], planDate[0] - 1);
      date.setMonth(date.getMonth() + i);
      dates.push(new Date(date));
    }
    return dates;
  }
  return [];
}

export function getDatesSpecific(dateStr, numberOfPast, numberOfFuture, isSystemDates = false) {
  const rawDates = getRawDatesSpecific(dateStr, numberOfPast, numberOfFuture);
  return rawDates.map(date => formatSpecificDate(date, isSystemDates));
}

export function getEndOfMonthDate(dateStr) {
  const [monthStr, year] = dateStr.split(' ');
  const month = monthNames.indexOf(monthStr);
  return new Date(parseInt(`20${year}`), month + 1, 0);
}

export function getEndOfMonthString(dateStr) {
  const [monthStr, year] = dateStr.split(' ');
  const month = monthNames.indexOf(monthStr);
  const date = new Date(year, month + 1, 0);
  return `${date.getDate()} ${monthStr} ${year}`;
}

export function getNumberOfDaysBetweenDates(toDate, fromDate = new Date()) {
  return Math.max(Math.ceil((toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000)), 0);
}

export function formatTimestamp(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear().toString().substr(2, 2);

  return `${day}-${monthNames[monthIndex]}-${year}`;
}