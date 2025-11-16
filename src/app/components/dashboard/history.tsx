"use client";
import React from "react";
import UpdateIcon from "@mui/icons-material/Update";
import ReplyIcon from "@mui/icons-material/Reply";


type HistoryProps = {
  name: string;
};

export default function History({ name }: HistoryProps) {

  return (
    <button className="bg-white w-full h-[42px] rounded-[5px] flex justify-between items-center px-4"
    >
      <div className="flex-1 flex items-center space-x-9">
        <UpdateIcon />
        <span className="border-b border-[#bababa] pb-1">{name}</span>
      </div>
      <div className="w-[30px]">
        <ReplyIcon className="scale-x-[-1]" />
      </div>
    </button>
  );
}
