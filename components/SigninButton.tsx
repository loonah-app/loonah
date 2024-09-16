'use client'

import React from 'react'
import { signIn } from 'next-auth/react';
import { Button } from '@/_components/ui/button'

function SigninButton() {

    return (
        <>
            <Button onClick={() => signIn('github')} variant={'ghost'} className="px-4 py-2.5 border flex items-center gap-2">
                <div className='w-[23px] bg-white px-1 py-1 rounded-full'>
                    {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src="/assets/icons/github.png" alt="github" className='w-full' />
                    }
                </div>
                <div>
                    Sign in with github
                </div>
            </Button>
        </>
    )
}

export default SigninButton