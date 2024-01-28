'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { Button } from "./ui/button"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { motion } from "framer-motion"
import { usePathname, useRouter } from 'next/navigation'

const Header = () => {

  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname()
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  // Function to determine if the link is active
  const isActive = (path: any) => {
    return pathname === path;
  };


  return (
    <header className={`${isScrolled && 'bg-[#141414]'}`}>
      <MaxWidthWrapper className="flex items-center justify-between space-x-2 md:space-x-10">
        <motion.div
          initial={{
            x: -500,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x:0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 1.5
          }}
        >
          <Image
            src="/meta-africa-logo.png"
            width={50}
            height={50}
            alt="meta-africa-logo"
            className="cursor-pointer object-contain"
          />
        </motion.div>

        <motion.div
          initial={{
            y: -100,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            y:0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.5
          }}
        >
          <ul className="hidden space-x-4 md:flex">
            {['/', '/about-us', '/contact-us', '/shop'].map((path) => (
              <li
                key={path}
                className={`headerLink ${
                  isActive(path)
                    ? 'cursor-default font-semibold text-[#F4C118]'
                    : 'hover:text-[#f4c118f7]'
                }`}
              >
                <Link href={path}>{path === '/' ? 'Home' : path.split('-').join(' ').replace('/', '')}</Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{
            x: 500,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x:0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.5
          }}
          className="space-x-2"
        >
          <Button onClick={() => router.push('/signup')} variant="ghost" className="text-white hover:bg-transparent hover:shadow-sm text-xs hover:text-zinc-200 uppercase hidden sm:inline-flex">
            <span className="font-semibold">sign up</span>
          </Button>
          <Button onClick={() => router.push('/login')} variant="secondary" className="uppercase text-xs transition-all hover:shadow-xl hover:bg-white/90">
            <span className="login-text-gradient font-semibold">login</span>
          </Button>
        </motion.div>
      </MaxWidthWrapper>
    </header>
  )
}

export default Header