import React from "react";

type CardProps = {
  name: string;
  className?: string;
  distance: number;
  divClassName?: string;
  icon: React.ReactNode;
};

export function Card(props: CardProps) {
  const { name, className, distance, divClassName, icon } = props;
  return (
    <div
      className={`bg-white w-[339px] h-[117px] rounded-[5px] flex justify-between items-center ${divClassName}`}
    >
      <div className="ml-[20px]">
        <div className="mb-[24px]">
          <p className="text-[14px]">{name}</p>
        </div>
        <div className={`${className}`}>
          <p className="text-[24px] font-sans font-bold">{distance}km</p>
        </div>
      </div>
      <div>{icon}</div>
    </div>
  );
}
