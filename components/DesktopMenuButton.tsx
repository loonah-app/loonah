'use client'

import {
    // Cloud,
    // CreditCard,
    // LifeBuoy,
    LogOut,
    // Settings,
    User,
    Moon,
    Sun
} from "lucide-react"

import { Button } from "@/_components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu"
import { PiGearFineLight } from "react-icons/pi";
import { useTheme } from "next-themes";
import { upperCaseFirst } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';

function DesktopMenuButton() {
    const { resolvedTheme, setTheme } = useTheme();
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <PiGearFineLight className='w-6 h-6' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/app/account')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
                        <div className="relative mr-6">
                            <Sun
                                className='absolute top-[-8px] transition-transform duration-400 mr-2 h-4 w-4 scale-0 dark:scale-100' />
                            <Moon
                                className='absolute top-[-8px] transition-transform duration-400 mr-2 h-4 w-4 scale-100 dark:scale-0' />
                        </div>
                        <span>{upperCaseFirst(resolvedTheme === "light" ? "dark" : "light")} mode</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DesktopMenuButton;