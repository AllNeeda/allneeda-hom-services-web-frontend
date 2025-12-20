import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "emerald" | "sky" | "rose" | "amber" | "purple" | "cyan"; // Added more colors
  total?: number;
  unit?: string;
  compact?: boolean;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  total,
  unit = "items",
  compact = false,
}: StatsCardProps) => {
  const colorConfig = {
    emerald: {
      gradient: "from-emerald-500 to-emerald-600",
      bgCircle: "bg-emerald-400/10",
    },
    sky: {
      gradient: "from-sky-500 to-blue-600",
      bgCircle: "bg-sky-400/10",
    },
    rose: {
      gradient: "from-rose-500 to-pink-600",
      bgCircle: "bg-rose-400/10",
    },
    amber: {
      gradient: "from-amber-500 to-orange-600",
      bgCircle: "bg-amber-400/10",
    },
    purple: {
      gradient: "from-purple-500 to-violet-600",
      bgCircle: "bg-purple-400/10",
    },
    cyan: {
      gradient: "from-cyan-500 to-teal-600",
      bgCircle: "bg-cyan-400/10",
    },
  };

  const percentage = total && total > 0 ? Math.round((value / total) * 100) : 0;
  const showPercentage = total !== undefined;

  const sizeClasses = compact
    ? {
        padding: "p-3",
        circleSize: "w-16 h-16 -translate-y-6 translate-x-6",
        iconSize: "w-3.5 h-3.5",
        iconPadding: "p-1",
        iconRound: "rounded-md",
        valueSize: "text-xl",
        titleSize: "text-xs",
        mainValueSize: "text-xl",
        unitSize: "text-xs",
        progressHeight: "h-1",
        spacing: {
          marginBottom: "mb-1.5",
          progressMargin: "mt-1.5 pt-1.5",
        },
      }
    : {
        padding: "p-4",
        circleSize: "w-20 h-20 -translate-y-8 translate-x-8",
        iconSize: "w-4 h-4",
        iconPadding: "p-1.5",
        iconRound: "rounded-lg",
        valueSize: "text-xl",
        titleSize: "text-xs",
        mainValueSize: "text-2xl",
        unitSize: "text-sm",
        progressHeight: "h-1",
        spacing: {
          marginBottom: "mb-2",
          progressMargin: "mt-2 pt-2",
        },
      };

  return (
    <div
      className={`group relative overflow-hidden rounded bg-gradient-to-br ${colorConfig[color].gradient} ${sizeClasses.padding} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
    >
      <div
        className={`absolute top-0 right-0 ${sizeClasses.circleSize} ${colorConfig[color].bgCircle} rounded-full`}
      ></div>
      <div className="relative z-10">
        <div
          className={`flex items-center justify-between ${sizeClasses.spacing.marginBottom}`}
        >
          <div
            className={`${sizeClasses.iconPadding} bg-white/20 backdrop-blur-sm ${sizeClasses.iconRound}`}
          >
            <Icon className={`${sizeClasses.iconSize} text-white`} />
          </div>
          <div className={`${sizeClasses.valueSize} font-black text-white/30`}>
            {value}
          </div>
        </div>

        <p
          className={`text-white/70 ${sizeClasses.titleSize} font-semibold uppercase tracking-wider mb-1`}
        >
          {title}
        </p>
        <p
          className={`text-white ${sizeClasses.mainValueSize} font-bold tracking-tight`}
        >
          {value}
          <span className={`text-white/60 ${sizeClasses.unitSize} ml-1`}>
            {unit}
          </span>
        </p>

        <div
          className={`${sizeClasses.spacing.progressMargin} border-t border-white/20`}
        >
          <div className="flex items-center">
            <div
              className={`w-full bg-white/20 rounded-full ${sizeClasses.progressHeight}`}
            >
              <div
                className={`bg-white ${sizeClasses.progressHeight} rounded-full transition-all duration-500`}
                style={{
                  width: showPercentage ? `${percentage}%` : "100%",
                }}
              ></div>
            </div>
            {showPercentage && (
              <span className="ml-2 text-white/80 text-xs font-medium">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
