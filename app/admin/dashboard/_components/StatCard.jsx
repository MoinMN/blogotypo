const StatCard = ({
  label,
  value,
  sub,
  subUp,
  icon,
  iconBg,
  iconColor,
  accent,
}) => {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl md:rounded-3xl
        border border-gray-200 dark:border-gray-100/[0.06]
        bg-gray-100 dark:bg-[#0f0f22]
        p-3 md:p-5
        shadow-[0_2px_10px_rgba(0,0,0,0.03)]
        dark:shadow-[0_4px_24px_rgba(0,0,0,0.28)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-gray-300 dark:hover:border-indigo-500/20
        group
      `}
    >
      {/* gradient glow */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-br ${accent}
          transition-all duration-500
        `}
      />

      {/* top blur */}
      <div
        className="
          absolute -top-10 -right-10
          w-24 h-24 rounded-full
          bg-gray-100/30 dark:bg-indigo-500/10
          blur-2xl
        "
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="
              text-[10px] md:text-xs
              uppercase tracking-[0.18em]
              text-gray-500 dark:text-gray-500
              font-semibold
              truncate
            "
          >
            {label}
          </p>

          <h2
            className="
              mt-2
              text-2xl md:text-4xl
              font-bold
              leading-none
              text-gray-900 dark:text-gray-100
            "
            style={{
              fontFamily:
                "'Playfair Display', serif",
            }}
          >
            {value.toLocaleString()}
          </h2>

          <div
            className={`
              mt-3 inline-flex items-center gap-1.5
              text-[11px] md:text-xs
              font-medium
              rounded-full
              px-2 py-1
              ${subUp
                ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
              }
            `}
          >
            <i
              className={`fa-solid ${subUp
                ? "fa-arrow-trend-up"
                : "fa-arrow-trend-down"
                } text-[9px]`}
            />
            <span className="truncate">
              {sub}
            </span>
          </div>
        </div>

        <div
          className={`
            w-11 h-11 md:w-14 md:h-14
            rounded-2xl
            flex items-center justify-center
            flex-shrink-0
            ${iconBg}
            group-hover:scale-110
            transition-all duration-300
          `}
        >
          <i
            className={`${icon} ${iconColor} text-base md:text-xl`}
          />
        </div>
      </div>
    </div>
  );
};

export default StatCard;