import dayjs from 'dayjs';

export const getDaysInMonth = (year: number, month: number) => {
  const startDate = dayjs(`${year}-${month + 1}-01`);
  const endDate = startDate.endOf('month');
  const days = [];

  for (let i = startDate.date(); i <= endDate.date(); i++) {
    days.push(dayjs(`${year}-${month + 1}-${i}`));
  }

  return days;
};

export const getMonthData = (year: number, month: number) => {
  const firstDayOfMonth = dayjs(`${year}-${month + 1}-01`);
  const lastDayOfMonth = firstDayOfMonth.endOf('month');
  const startDate = firstDayOfMonth.startOf('week');
  const endDate = lastDayOfMonth.endOf('week');

  const days = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    days.push(currentDate);
    currentDate = currentDate.add(1, 'day');
  }

  return days;
};

export const formatDate = (date: dayjs.Dayjs) => {
  return date.format('YYYY-MM-DD');
};

