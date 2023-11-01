'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { Button } from "./ui/button"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { motion } from "framer-motion"

const Header = () => {

  const [isScrolled, setIsScrolled] = useState(false);

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
            <li className="headerLink cursor-default font-semibold text-yellow-300 hover:text-yellow-400">Home</li>
            <li className="headerLink">About</li>
            <li className="headerLink">Contact Us</li>
            <li className="headerLink">Shop</li>
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
          <Button variant="ghost" className="text-white hover:bg-transparent text-xs hover:text-gray-200 uppercase hidden sm:inline-flex">
            <Link href="/signup">sign up</Link>
          </Button>
          <Button variant="secondary" className="uppercase text-xs">
            <Link href="/login" className="text-orange-500">login</Link>
          </Button>
        </motion.div>
      </MaxWidthWrapper>
    </header>
  )
}

export default Header