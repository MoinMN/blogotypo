const QuickActionCard = ({
  title,
  desc,
  icon,
  color,
}) => {
  return (
    <button
      className="
        relative overflow-hidden
        rounded-2xl
        border border-gray-200 dark:border-gray-100/[0.06]
        bg-gray-100 dark:bg-[#0f0f22]
        px-4 py-4
        text-left
        transition-all duration-300
        hover:-translate-y-1
        hover:border-gray-300 dark:hover:border-indigo-500/20
        group
      "
    >
      <div
        className="
          absolute inset-0 opacity-0
          group-hover:opacity-100
          transition-all duration-300
          bg-gradient-to-br from-indigo-500/5 to-transparent
        "
      />

      <div className="relative z-10">
        <div
          className={`
            w-10 h-10 rounded-xl
            flex items-center justify-center
            mb-3
            ${color}
          `}
        >
          <i className={`${icon} text-sm`} />
        </div>

        <h3
          className="
            text-sm md:text-base
            font-semibold
            text-gray-900 dark:text-gray-100
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1 text-xs md:text-sm
            leading-relaxed
            text-gray-500 dark:text-gray-400
          "
        >
          {desc}
        </p>
      </div>
    </button>
  );
};

export default QuickActionCard;