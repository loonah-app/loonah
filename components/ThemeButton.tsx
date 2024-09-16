'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { HiMoon, HiSun } from "react-icons/hi";
import classNames from 'classnames';

function ThemeButton() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button className={classNames('relative flex justify-center items-center w-8 h-8 rounded-full', {
            'bg-slate-100': resolvedTheme === 'light',
            'bg-neutral-800': resolvedTheme === 'dark'
        })} onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
            <HiSun
                className='absolute transition-transform duration-400 h-5 w-5 text-slate-50 scale-0 dark:scale-100' />
            <HiMoon
                className='absolute transition-transform duration-400 scale-100 dark:scale-0' />
        </button>
    )
}

export default ThemeButton