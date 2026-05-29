const STAT_CARDS = (u, b) => [
  {
    label: "Total Users",
    value: u.total ?? 0,
    sub: `+${u.today ?? 0} joined today`,
    subUp: (u.today ?? 0) >= 0,
    icon: "fa-solid fa-users",
    iconBg:
      "bg-indigo-200 dark:bg-indigo-500/10",
    iconColor:
      "text-indigo-700 dark:text-indigo-400",
    accent:
      "from-indigo-500/10 to-indigo-500/0",
  },
  {
    label: "Total Blogs",
    value: b.total ?? 0,
    sub: `+${b.today ?? 0} published today`,
    subUp: (b.today ?? 0) >= 0,
    icon: "fa-solid fa-book-open",
    iconBg:
      "bg-violet-200 dark:bg-violet-500/10",
    iconColor:
      "text-violet-700 dark:text-violet-400",
    accent:
      "from-violet-500/10 to-violet-500/0",
  },
  {
    label: "Monthly Users",
    value: u.thisMonth ?? 0,
    sub: `vs ${u.lastMonth ?? 0} last month`,
    subUp:
      (u.thisMonth ?? 0) >=
      (u.lastMonth ?? 0),
    icon: "fa-solid fa-user-plus",
    iconBg:
      "bg-emerald-200 dark:bg-emerald-500/10",
    iconColor:
      "text-emerald-700 dark:text-emerald-400",
    accent:
      "from-emerald-500/10 to-emerald-500/0",
  },
  {
    label: "Monthly Blogs",
    value: b.thisMonth ?? 0,
    sub: `vs ${b.lastMonth ?? 0} last month`,
    subUp:
      (b.thisMonth ?? 0) >=
      (b.lastMonth ?? 0),
    icon: "fa-solid fa-pen-nib",
    iconBg:
      "bg-amber-200 dark:bg-amber-500/10",
    iconColor:
      "text-amber-700 dark:text-amber-400",
    accent:
      "from-amber-500/10 to-amber-500/0",
  },
  {
    label: "Yearly Users",
    value: u.thisYear ?? 0,
    sub: `vs ${u.lastYear ?? 0} last year`,
    subUp:
      (u.thisYear ?? 0) >=
      (u.lastYear ?? 0),
    icon: "fa-solid fa-chart-line",
    iconBg:
      "bg-sky-200 dark:bg-sky-500/10",
    iconColor:
      "text-sky-700 dark:text-sky-400",
    accent:
      "from-sky-500/10 to-sky-500/0",
  },
  {
    label: "Yearly Blogs",
    value: b.thisYear ?? 0,
    sub: `vs ${b.lastYear ?? 0} last year`,
    subUp:
      (b.thisYear ?? 0) >=
      (b.lastYear ?? 0),
    icon: "fa-solid fa-layer-group",
    iconBg:
      "bg-rose-200 dark:bg-rose-500/10",
    iconColor:
      "text-rose-700 dark:text-rose-400",
    accent:
      "from-rose-500/10 to-rose-500/0",
  },
];

export default STAT_CARDS;