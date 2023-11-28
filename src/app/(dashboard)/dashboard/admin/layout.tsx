'use client'

import { ArrowBigLeftIcon, BarChart2, Drama, ShieldPlus, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReactNode, useEffect, useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {

  const [activeLink, setActiveLink] = useState('player');
  const [email, setEmail] = useState('');

  const handleActiveLinkChange = (linkName: any) => {
    setActiveLink(linkName);
  };

  // Function to determine if a link is active
  const isActive = (linkName: any) => {
    return activeLink === linkName;
  };

  useEffect(() => {
    // This code runs only on the client side
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className='w-full flex h-screen overflow-hidden'>

      <div className='hidden md:flex h-full w-full max-w-[18rem] grow flex-col gap-y-5 overflow-y-auto bg-[rgb(36,36,36)] px-6'>
        <Link href='/dashboard' className='flex mt-3 h-16 shrink-0 items-center'>
          <Image
            src="/meta-africa-logo.png"
            width={40}
            height={40}
            alt="meta-africa-logo"
            className="cursor-pointer object-contain"
          />
        </Link>

        <nav className='flex flex-1 flex-col'>
          <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            <li>
              <ul role='list' className='-mx-2 mt-2 space-y-1'>

                <li>
                  <Link
                    href="/dashboard/admin/league"
                    onClick={() => handleActiveLinkChange('league')}
                    className={`text-gray-700 cursor-not-allowed hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('league') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 border-gray-200 group-hover:border-red-600 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white ${isActive('league') ? 'border-red-600 text-red-800' : ''}`}>
                      <BarChart2 />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('league') ? 'text-red-800' : 'text-zinc-200'}`}>League</span>
                  </Link>
                </li>

                <li>
                <Link
                    href="/dashboard/admin/player"
                    onClick={() => handleActiveLinkChange('player')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('player') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 border-gray-200 group-hover:border-red-600 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white ${isActive('player') ? 'border-red-600 text-red-800' : ''}`}>
                      <ShieldPlus />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('player') ? 'text-red-800' : 'text-zinc-200'}`}>Player</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/admin/coach"
                    onClick={() => handleActiveLinkChange('coach')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('coach') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 border-gray-200 group-hover:border-red-600 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white ${isActive('coach') ? 'border-red-600 text-red-800' : ''}`}>
                      <Drama />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('coach') ? 'text-red-800' : 'text-zinc-200'}`}>Coach</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/admin/team"
                    onClick={() => handleActiveLinkChange('team')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('team') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 border-gray-200 group-hover:border-red-600 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white ${isActive('team') ? 'border-red-600 text-red-800' : ''}`}>
                      <Users />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('team') ? 'text-red-800' : 'text-zinc-200'}`}>Team</span>
                  </Link>
                </li>
                
              </ul>
            </li>

            <li className='-mx-6 mt-auto flex items-center cursor-pointer'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 mb-5 text-sm font-semibold leading-6 text-gray-900'>
                <div className='flex items-center space-x-1 text-sm text-zinc-200'>
                    <span><ArrowBigLeftIcon /></span>
                    <span>Logout</span>
                </div>
              </div>

              {/* <SignOutButton className='h-full aspect-square' /> */}
            </li>
          </ul>
        </nav>
      </div>

      <aside className='max-h-screen w-full'>
        <div className='h-[4.5rem] bg-[rgb(36,36,36)] flex justify-between items-center'>
          <div className='font-semibold text-orange-500 text-sm lg:text-2xl italic ml-2 lg:ml-0'>Meta Africa Sports</div>
          <div className='flex items-center'>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='mr-10 text-zinc-200 text-xs lg:text-sm flex flex-col ml-2'>
              <p>{email}</p>
              <p>Admin</p>
            </div>
          </div>
        </div>
        {children}
      </aside>
    </div>
  )
}

export default Layout