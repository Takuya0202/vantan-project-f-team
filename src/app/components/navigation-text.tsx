import { DirectionsStep } from "@/types/mapbox";
import {
  Navigation,
  TurnLeft,
  TurnRight,
  TurnSharpLeft,
  TurnSharpRight,
  TurnSlightLeft,
  TurnSlightRight,
  Straight,
  UTurnLeft,
} from "@mui/icons-material";
import EndNavigation from "../feature/endNavigation";

// 案内のテキスト。mapのレイヤーではできないので、html要素にする
type props = {
  steps: DirectionsStep[];
};
// m => kmにする関数
const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
};

// modifier に応じて適切なアイコンを返す
const getNavigationIcon = (modifier?: string) => {
  switch (modifier) {
    case "left":
      return TurnLeft;
    case "right":
      return TurnRight;
    case "sharp left":
      return TurnSharpLeft;
    case "sharp right":
      return TurnSharpRight;
    case "slight left":
      return TurnSlightLeft;
    case "slight right":
      return TurnSlightRight;
    case "straight":
      return Straight;
    case "uturn":
      return UTurnLeft;
    default:
      return Navigation;
  }
};

export default function NavigationText({ steps }: props) {
  const currentStep = steps[0];
  const nextSteps = steps.slice(1);

  if (!currentStep) return null;

  const CurrentIcon = getNavigationIcon(currentStep.maneuver.modifier);

  return (
    <div className="absolute bottom-[74px] left-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <CurrentIcon
              sx={{
                fontSize: 48,
                transform: `rotate(${currentStep.maneuver.bearing_after}deg)`,
                color: "#3b82f6",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
              }}
            />
          </div>

          {/* 指示テキストと距離 */}
          <div className="flex-1 flex items-center justify-between pr-2 pl-4">
            {/* 次までの距離とテキスト */}
            <div className="flex items-start flex-col space-y-2">
              <span className="text-black text-3xl font-semibold">
                {formatDistance(currentStep.distance)}
              </span>
              <span className="text-black text-lg">{currentStep.maneuver.instruction}</span>
            </div>
            {/* 案内終了アイコn */}
            <div>
              <EndNavigation />
            </div>
          </div>
        </div>
      </div>

      {nextSteps.length > 0 && (
        <div className="px-6 py-3 max-h-32 overflow-y-auto bg-gray-50/50">
          <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
            次の案内
          </div>
          <div className="space-y-2">
            {nextSteps.map((step, idx) => {
              // アイコンを取得
              const Icon = getNavigationIcon(step.maneuver.modifier);
              return (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <Icon
                    sx={{
                      fontSize: 24,
                      transform: `rotate(${step.maneuver.bearing_after}deg)`,
                      color: "#6b7280",
                    }}
                  />
                  <span className="text-gray-600 font-medium min-w-[60px]">
                    {formatDistance(step.distance)}
                  </span>
                  <span className="text-gray-700 flex-1">{step.maneuver.instruction}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
