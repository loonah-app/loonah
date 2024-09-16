'use client'

import React, { useEffect } from 'react'
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"

function Providers({ children, session }: {
    children: React.ReactNode,
    session: any
}) {
    const [mounted, setMounted] = React.useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute='class'>
                {mounted && children}
            </ThemeProvider>
        </SessionProvider>
    )
}

export default Providers