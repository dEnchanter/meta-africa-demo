'use client'

import { AmpersandIcon, ArrowBigLeftIcon, BarChart2, Drama, Gamepad, LogOut, ShieldPlus, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReactNode, useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useUser } from '@/hooks/auth'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {

  const {
    user,
    isValidating: userIsValidating,
    error: fetchingUserError,
  } = useUser({
    redirectTo: "/login",
  });

  const [activeLink, setActiveLink] = useState('player');
  const [email, setEmail] = useState('');

  const router = useRouter();

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstname");
    localStorage.removeItem("lastname");
    localStorage.removeItem("email");
    localStorage.removeItem("user_type");

    router.push("/login")

  };

  return (
    <div className='w-full flex h-screen overflow-hidden'>

      <div className='hidden md:flex h-full w-full max-w-[18rem] grow flex-col gap-y-5 overflow-y-auto bg-[rgb(36,36,36)] px-6'>
        <Link href='/dashboard/overview' className='flex mt-3 h-16 shrink-0 items-center'>
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
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('league') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('league') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/league_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('league') ? 'text-red-800' : 'text-zinc-200'}`}>League</span>
                  </Link>
                </li>

                <li>
                <Link
                    href="/dashboard/admin/player"
                    onClick={() => handleActiveLinkChange('player')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('player') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('player') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/team_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('player') ? 'text-red-800' : 'text-zinc-200'}`}>Player</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/admin/coach"
                    onClick={() => handleActiveLinkChange('coach')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('coach') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('coach') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/coach_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('coach') ? 'text-red-800' : 'text-zinc-200'}`}>Coach</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/admin/team"
                    onClick={() => handleActiveLinkChange('team')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('team') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('team') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/team_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('team') ? 'text-red-800' : 'text-zinc-200'}`}>Team</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/admin/games"
                    onClick={() => handleActiveLinkChange('games')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('games') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('games') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/game_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('games') ? 'text-red-800' : 'text-zinc-200'}`}>Games</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/admin/administration"
                    onClick={() => handleActiveLinkChange('administration')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('administration') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('administration') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/admin_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('administration') ? 'text-red-800' : 'text-zinc-200'}`}>Administration</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/admin/documentation"
                    onClick={() => handleActiveLinkChange('documentation')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('administration') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('administration') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/league_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('administration') ? 'text-red-800' : 'text-zinc-200'}`}>Documentation</span>
                  </Link>
                </li>
                
              </ul>
            </li>

            <li className='-mx-6 mt-auto flex items-center cursor-pointer'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 mb-5 text-sm font-semibold leading-6 text-gray-900'>
                <div className='flex items-center space-x-3 text-sm text-zinc-200' onClick={handleLogout}>
                  <span><LogOut className='h-5 w-5'/></span>
                  <span>Logout</span>
                </div>
              </div>

              {/* <SignOutButton className='h-full aspect-square' /> */}
            </li>
          </ul>
        </nav>
      </div>

      <aside className='max-h-screen w-full overflow-y-auto scrollbar-hide'>
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