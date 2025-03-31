import { CategoryInfo } from "../types";

export const MOCK_USER_ID = 1;

export const CATEGORIES: CategoryInfo[] = [
  {
    name: "Tools",
    icon: "tool",
    path: "/search?category=Tools",
  },
  {
    name: "Garden",
    icon: "flower2",
    path: "/search?category=Garden",
  },
  {
    name: "Kitchen",
    icon: "utensils",
    path: "/search?category=Kitchen",
  },
  {
    name: "Repairs",
    icon: "hammer",
    path: "/search?category=Repairs",
  },
];

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.getMonth() + 1;
  const endMonth = end.getMonth() + 1;
  
  return `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
}

export function getDateXDaysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
