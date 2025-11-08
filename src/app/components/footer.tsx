"use client";

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// MUIからアイコンを拾ってくる
import InsightsTwoToneIcon from '@mui/icons-material/InsightsTwoTone'
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const Footer = () => {
    const pathname = usePathname()

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-gray-300 py-3 flex justify-evenly items-center">
            <Link href="/top">
                <div className={`px-5 py-3 rounded-full transition-colors duration-200
                ${pathname === '/top' ? 'bg-[#a9a9a9]' : 'bg-transparent hover:bg-white'}`}
                >
                    <HomeOutlinedIcon className="text-black! transition-colors duration-200" />
                </div>

            </Link>
            <Link href="/spot">
                <div className={`px-5 py-3 rounded-full transition-colors duration-200
                ${pathname === '/spot' ? 'bg-[#a9a9a9]' : 'bg-transparent hover:bg-white'}`}
                >
                    <SignalCellularAltOutlinedIcon className="text-black! transition-colors duration-200" />
                </div>
            </Link>
            <Link href="/dashboard">
                <div className={`px-5 py-3 rounded-full transition-colors duration-200
                ${pathname === '/dashboard' ? 'bg-[#a9a9a9]' : 'bg-transparent hover:bg-white'}`}
                >
                    <InsightsTwoToneIcon className="text-black! transition-colors duration-200" />
                </div>
            </Link>
        </footer>
    )
}

export default Footer
