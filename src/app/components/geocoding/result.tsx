import { LocationPin } from "@mui/icons-material";
import React from "react";
type props = {
  id: string;
  place_name: string;
  onClick?: (id: string) => void;
};

export default function Result({ id, place_name, onClick }: props) {
  return (
    <div className="bg-white opacity-70 rounded-lg">
      <div key={id} onClick={() => onClick && onClick(id)} className="py-6 mx-4">
        <p className="flex items-center space-x-5">
          <LocationPin sx={{ color : "black"}}/>
          <strong className="flex flex-col leading-tight border-b-1 border-gray-500 w-[300px] py-2 whitespace-nowrap overflow-hidden">
            {place_name}
          </strong>
        </p>
      </div>
    </div>
  );
}
