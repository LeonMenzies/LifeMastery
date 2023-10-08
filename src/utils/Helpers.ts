export const generateAOIColor = (count: number) => {
  const COLORS = [
    "#FFC10C",
    "#FFCB30",
    "#F5BD16",
    "#001EA8",
    "#163EF5",
    "#6380FF",
    "#4360E6",
    "#99760E",
    "#E6BC43",
  ];

  return count > 8 ? COLORS[0] : COLORS[count];
};

export const getDay = (date: Date) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};
