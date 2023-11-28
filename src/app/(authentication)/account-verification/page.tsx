'use client'

import Footer from '@/components/Footer'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import axios from '@/util/axios'
import Image from 'next/image'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const Page = () => {
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const countdownTime = 5 * 60; // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const [otp, setOtp] = useState(Array(5).fill("")); // State to store OTP

  const router = useRouter();

  // Create an array of refs for the input fields
  const inputRefs = Array.from({ length: 5 }, () => useRef<HTMLInputElement>(null));

  useEffect(() => {
    // Update the countdown every second
    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);

    return () => clearInterval(timer as NodeJS.Timeout);
  }, [timeLeft]);

  const handleInputChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    // Filter out non-numeric characters
    const value = e.target.value.replace(/\D/g, '');

    if (value.length >= 1 && index < 4) {
      inputRefs[index + 1].current?.focus();
    }

    // Set the filtered value
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp); // Update the OTP state
    e.target.value = value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true)
      const otpData = otp.join("")
      const email = localStorage.getItem('email');

      const data = {
        otp: otpData,
        email
      }

      const response = await axios.post(Endpoint.ACTIVATE_ACCOUNT, data);
      const payload = response?.data;
      

      if (payload && payload.success.status == "SUCCESS") {
        
        toast.success(payload.success.message);
        localStorage.setItem("token", payload.success.token);

        // Navigate to the account-verification page
        router.push('/dashboard/admin/player');
        
      } else if (payload && payload.success.status == "ERROR") {
        toast.error(payload.success.message)
      }
    } catch(error: any) {
      // display error message to user
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  return (
    <div className='h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-2'>

        <div className='-ml-7 hidden lg:flex lg:flex-1' style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={'/basketball-login.jpg'}
            alt='login image'
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className='flex flex-col items-center justify-start mt-10'>

          <div className='flex flex-col items-center space-y-1'>
            <Image
              src="/meta-africa-logo.png"
              width={50}
              height={50}
              alt="meta-africa-logo"
              className="cursor-pointer object-contain mb-7"
            />
            <h1 className='uppercase font-semibold text-2xl mt-5'>Welcome back</h1>
            <p className='font-light'>Welcome back! Please enter your details</p>
          </div>
        
          <MaxWidthWrapper className='mt-5 mb-[7rem] text-center lg:text-left'>
            <h1 className='font-bold uppercase text-2xl mb-10'>OTP Verification</h1>
            <h2 className='font-semibold uppercase text-lg mb-2'>Account Verification</h2>
            <p className='text-extralight'>We've sent an OTP to your Email Address</p>
            <form className='flex flex-col items-center lg:items-start space-y-5 mt-5' onSubmit={handleSubmit}>
              <div className='flex space-x-2'>
                {inputRefs.map((ref, index) => (
                  <Input // Assuming 'Input' is a styled version of 'input'. Replace with your component if different.
                    key={index}
                    ref={ref}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    className='w-10 text-center'
                    onChange={(e) => handleInputChange(index, e)}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  OTP expires in {formatTime(timeLeft)}
                </p>
              </div>
              <div className='w-full'>
                <Button 
                  type='submit' 
                  disabled={timeLeft === 0}
                  isLoading={isLoading}
                >
                    Submit
                </Button>
              </div>
            </form>
          </MaxWidthWrapper>
          

        </div>
      </div>
      <div className='-mt-10'>
        <Footer />
      </div>
    </div>
  )
}

export default Page