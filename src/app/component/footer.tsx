"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { usePathname } from 'next/navigation'
// MUIからアイコンを拾ってくる
import InsightsTwoToneIcon from '@mui/icons-material/InsightsTwoTone'
import HomeFilledIcon from '@mui/icons-material/HomeFilled'
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Footer = () => {
    const pathname = usePathname()

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-gray-300 py-3 flex justify-evenly items-center">
            <Link href="/top">
                <div className={`px-5 py-3 rounded-full transition-colors duration-200
                ${pathname === '/top' ? 'bg-[#a9a9a9]' : 'bg-transparent hover:bg-white'}`}
                >
                    <HomeFilledIcon className="!text-black transition-colors duration-200" />
                </div>

            </Link>
            <Link href="/spot">
                <div className={`px-5 py-3 rounded-full transition-colors duration-200
                ${pathname === '/spot' ? 'bg-[#a9a9a9]' : 'bg-transparent hover:bg-white'}`}
                >
                    <BookmarkIcon className="!text-black transition-colors duration-200" />
                </div>
            </Link>
            <Link href="/user">
                <div className={`px-5 py-3 rounded-full transition-colors duration-200
                ${pathname === '/user' ? 'bg-[#a9a9a9]' : 'bg-transparent hover:bg-white'}`}
                >
                    <InsightsTwoToneIcon className="!text-black transition-colors duration-200" />
                </div>
            </Link>
        </footer>
    )
}

export default Footer
