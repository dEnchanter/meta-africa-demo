'use client'

import { ArrowBigLeftIcon, BarChart2, Drama, ShieldPlus, Users, UserCircleIcon, CuboidIcon, Cuboid, CpuIcon, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReactNode, useEffect, useState } from 'react'
import { useUser } from '@/hooks/auth'
import axios from '@/util/axios'
import "react-loading-skeleton/dist/skeleton.css"
import { notFound, redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import { Endpoint } from '@/util/constants'
import { is } from 'date-fns/locale'

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

  const [activeLink, setActiveLink] = useState('overview');
  const [email, setEmail] = useState('');

  const [isLoadingMale, setIsLoadingMale] = useState(false);
  const [isLoadingFemale, setIsLoadingFemale] = useState(false);

  const handleMaleClick = async () => {
    setIsLoadingMale(true);
    try {
      const response = await axios.post(Endpoint.SET_PREFERENCE, {
        preference: "male",
      });
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message)
        window.location.reload();
        // router.push('/dashboard/overview');        
      }
    } catch (error) {
      toast.error('Error setting preference!');
    } finally {
      setIsLoadingMale(false);
    }
  };

  const handleFemaleClick = async () => {
    setIsLoadingFemale(true);
    try {
      const response = await axios.post(Endpoint.SET_PREFERENCE, {
        preference: "female",
      });

      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message)
        window.location.reload();
        // router.push('/dashboard/overview');        
      }
    } catch (error) {
      toast.error('Error setting preference!');
    } finally {
      setIsLoadingFemale(false);
    }
  };

  const handleClick = user?.data?.preference === 'male' ? handleFemaleClick : handleMaleClick;

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
      toast.error("session expired")
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

      <div className='hidden md:flex h-full w-full max-w-[13rem] grow flex-col gap-y-5 overflow-y-auto bg-[rgb(36,36,36)] px-6'>
        <Link href='#' className='flex mt-3 h-16 shrink-0 items-center'>
          <Image
            src="/meta-africa-logo.png"
            width={40}
            height={40}
            alt="meta-africa-logo"
            className="cursor-pointer object-contain"
          />
        </Link>

        <nav className='flex flex-1 flex-col'>
          <ul role='list' className='flex flex-1 flex-col'>
            <li>
              <ul role='list' className='-mx-2 space-y-1'>

                <li>
                  <Link
                    href="/dashboard/overview"
                    onClick={() => handleActiveLinkChange('overview')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('overview') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('overview') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/overview_icon.png"
                        alt="icon"
                        width="20"
                        height="20"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('overview') ? 'text-red-800' : 'text-zinc-200'}`}>Overview</span>
                  </Link>
                </li>

                <li>
                <Link
                    href="/dashboard/games"
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
                    href="/dashboard/leagues"
                    onClick={() => handleActiveLinkChange('leagues')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('leagues') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('leagues') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/league_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('leagues') ? 'text-red-800' : 'text-zinc-200'}`}>Leagues</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/mas100"
                    onClick={() => handleActiveLinkChange('mas100')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('mas100') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('mas100') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/team_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('mas100') ? 'text-red-800' : 'text-zinc-200'}`}>Mas 100</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/teams"
                    onClick={() => handleActiveLinkChange('teams')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('teams') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('teams') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/coach_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('teams') ? 'text-red-800' : 'text-zinc-200'}`}>Teams</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/players"
                    onClick={() => handleActiveLinkChange('players')}
                    className={`text-gray-700 hover:text-red-600 hover:bg-pink-200/80 group flex items-center gap-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive('players') ? 'bg-pink-200/80 border-red-600 text-red-600' : ''}`}>
                    <span className={`text-gray-400 group-hover:text-red-800 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium ${isActive('players') ? 'border-red-600 text-red-800' : ''}`}>
                      <Image
                        src="/team_icon.png"
                        alt="icon"
                        width="30"
                        height="30"
                      />
                    </span>

                    <span className={`truncate group-hover:text-red-800 ${isActive('players') ? 'text-red-800' : 'text-zinc-200'}`}>Players</span>
                  </Link>
                </li>
                
              </ul>
            </li>
            
            <ul className='mt-7'>
              <li className='-mx-6 mt-auto flex items-center cursor-pointer'>
                <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                  <div className='flex items-center space-x-1 text-zinc-200 bg-red-400 hover:bg-red-500 transition-all'>
                      <Button 
                        onClick={handleClick}
                        isLoading={user?.data?.preferecne === 'male' ? isLoadingFemale : isLoadingMale}
                      >
                        Switch to {user?.data?.preference === 'male' ? 'female' : 'male'}
                      </Button>
                  </div>
                </div>
              </li>

              <li className='-mx-6 mt-auto flex items-center cursor-pointer'>
                <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                  <div className='flex items-center space-x-1 text-sm text-zinc-200 hover:text-zinc-400'>
                      <span>
                        <Users className='h-5 w-5' />
                      </span>
                      <Link href="/profile">My Profile</Link>
                  </div>
                </div>
              </li>

              <li className='-mx-6 mt-auto flex items-center cursor-pointer'>
                <div className='flex flex-1 items-center gap-x-4 px-6 py-3 mb-5 text-sm font-semibold leading-6 text-gray-900'>
                  <div className='flex items-center space-x-1 text-sm text-zinc-200 hover:text-zinc-400' onClick={handleLogout}>
                      <span><LogOut className='h-5 w-5'/></span>
                      <span>Logout</span>
                  </div>
                </div>
              </li>
            </ul>
          </ul>
        </nav>
      </div>

      <aside className='max-h-screen w-full'>
        <div className='h-[4.5rem] bg-[rgb(36,36,36)] flex justify-between items-center'>
          <div className='font-semibold text-orange-500 text-sm lg:text-2xl italic ml-2 lg:ml-0'></div>
          <div className='flex items-center'>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='mr-10 text-zinc-200 text-xs lg:text-sm flex flex-col ml-2'>
              <p>{user?.data?.email}</p>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className='flex'>
                      <p className='text-xs'>Freemium plan {" "}</p> 
                      {/* <p className='text-xs dashboard-button-gradient rounded-full px-3 py-2'>Upgrade plan</p>      */}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='font-semibold'>Free plan lasts for a month</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
            </div>
          </div>
        </div>
        {children}
      </aside>
    </div>
  )
}

export default Layout