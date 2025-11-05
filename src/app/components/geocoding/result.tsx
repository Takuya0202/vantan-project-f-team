import React from "react";
import Image from 'next/image'

type props = {
    id: string;
    place_name: string;
    onClick?: (id: string) => void;
};

export default function Result({id , place_name, onClick} : props) {
  return (
        <div className="bg-white">
            <div 
            key={id}
            onClick={() => onClick && onClick(id)}
            className="my-7 mx-4">
              <p className="flex items-center space-x-5">
                <span className="flex flex-col items-center space-y-1">
                  <img src="/images/pin.svg" alt="pin" className="w-5 h-5"/>
                  <span className="text-[8px] w-[40px] text-center">10km</span>
                </span>
                <strong className="flex flex-col leading-tight border-b-1 border-gray-500 w-[300px] py-2 whitespace-nowrap overflow-hidden">{place_name}</strong>
              </p>
            </div>
        </div>
  );
}