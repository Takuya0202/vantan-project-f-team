"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
// MUIからアイコンを拾ってくる
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-gray-300 py-3 flex justify-evenly items-center">
            <Link href="/home">
                <div className="hover:bg-white px-5 py-3 rounded-full transition-colors duration-200">
                    <HomeFilledIcon className='text-black' />
                </div>
            </Link>
            <Link href="/dashboard">
                <div className="hover:bg-white px-5 py-3 rounded-full transition-colors duration-200">
                    <SignalCellularAltIcon className="text-black" />
                </div>
            </Link>
            <Link href="/spot">
                <div className="hover:bg-white px-5 py-3 rounded-full transition-colors duration-200">
                    <BookmarkIcon className="text-black" />
                </div>
            </Link>
        </footer>
    )
}

export default Footer
