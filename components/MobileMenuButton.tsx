'use client'

import { Button } from "@/_components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/_components/ui/sheet"
import { upperCaseFirst } from "@/utils/helpers"
import { LogOut, Moon, Sun } from "lucide-react"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { RiMenu5Fill } from "react-icons/ri";

export function MobileMenuButton() {
    
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost">
                    <RiMenu5Fill className='w-6 h-6' />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="mb-10">
                    <SheetTitle className="text-left">Loonah</SheetTitle>
                    <SheetDescription className="text-left">
                        Launch your react or vue apps on the decentralized web
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-4">
                    <div>
                        <SheetClose asChild>
                            <Link href={'/app/projects'}>
                                <div>Projects</div>
                            </Link>
                        </SheetClose>
                    </div>
                    <div>
                        <SheetClose asChild>
                            <Link href={'/app/domains'}>
                                <div>Domains</div>
                            </Link>
                        </SheetClose>
                    </div>
                    <div>
                        <SheetClose asChild>
                            <Link href={'/app/account'}>
                                <div>Account</div>
                            </Link>
                        </SheetClose>
                    </div>
                    <div>
                        <SheetClose asChild>
                            <Link href={'/app/help'}>
                                <div>Help</div>
                            </Link>
                        </SheetClose>
                    </div>

                    <div className="py-3">
                        <hr />
                    </div>

                    <div className="cursor-pointer flex gap-1 items-center" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
                        <div className="relative mr-6">
                            <Sun
                                className='absolute top-[-8px] transition-transform duration-400 mr-2 h-4 w-4 scale-0 dark:scale-100' />
                            <Moon
                                className='absolute top-[-8px] transition-transform duration-400 mr-2 h-4 w-4 scale-100 dark:scale-0' />
                        </div>
                        <span>{upperCaseFirst(resolvedTheme === "light" ? "dark" : "light")} mode</span>
                    </div>

                    <div className="py-3">
                        <hr />
                    </div>

                    <div className="cursor-pointer" onClick={() => signOut()}>
                        <div className="flex items-center gap-1">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
