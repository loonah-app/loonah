import DesktopMenuButton from '@/components/DesktopMenuButton';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react'
import { redirect } from 'next/navigation';
import { MobileMenuButton } from '@/components/MobileMenuButton';
import { authOptions } from '@/utils/authOptions';

async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  

  const session = await getServerSession(authOptions);
  // const router = useRouter();

  if (session === null) {
    redirect('/')
  }

  return (
    <div className='bg-background min-h-lvh'>
      <div className='flex justify-between items-center gap-5 px-5 py-5 mb-5 border-b border-b-accent'>

        <div className='flex items-center gap-16'>
          <Link href={'/'} className='font-extrabold text-2xl cursor-pointer'>Loonah</Link>
          <div className='hidden md:flex items-center gap-8 text-[13px] font-medium'>
            <Link href={'/app/projects'}>My Projects</Link>
            <Link href={'/app/domains'}>Domains</Link>
            <Link href={'/app/help'}>Help</Link>
          </div>
        </div>

        <div className='hidden md:inline-block'>
          <DesktopMenuButton />
        </div>

        <div className='inline-block md:hidden'>
          <MobileMenuButton />
        </div>

      </div>
      <div className='px-5'>
        {children}
      </div>
    </div>
  )
}

export default Layout