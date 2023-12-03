'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import axios from '@/util/axios'
import useSWR from "swr";
import toast from 'react-hot-toast'
import { Endpoint } from "@/util/constants";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator"
import Skeleton from "react-loading-skeleton";



const AssistCard = () => {


  const { data: getAllTeamsData, isLoading } = useSWR(Endpoint, fetcher);
  
  async function fetcher(Endpoint: any) {
 
    try {
      const response = await axios.get(Endpoint.GET_ALL_TEAM)
      const payload = response.data;
      if (payload && payload.status == "suceess") {
        return payload.data
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  return (
    <Card className="bg-[rgb(36,36,36)] border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="text-white text-md">Assists</p>
          <Button className="bg-[#d63f3f] rounded-full" size={'sm'}>View All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">

        {isLoading ? (
            <>
              <Skeleton count={2} height={40} baseColor={"#bcbcbc"} />
            </>
          ): (
            getAllTeamsData?.slice(0,5).map((team: any, index: number, array: any[]) => (
              <div key={index} className="flex flex-col space-y-2">
                <div className="text-white flex items-center justify-between text-center">
                  <div className="rounded-full">
                    <Image
                      src={team.logo_url ? team.logo_url : '/meta-africa-logo.png'}
                      width={30}
                      height={30}
                      alt="meta-africa-logo"
                      className="cursor-pointer object-contain rounded-md"
                    />
                  </div>
                  <p className="font-semibold grow">{team.name}</p>
                  <div><Link href={""} className="text-sm text-yellow-600">view League</Link></div>
                </div>

                {index !== array.length - 1 && <Separator className="bg-gray-50/20 w-full" />}
              </div>
            ))
          )
        } 
        
      </CardContent>
    </Card>
  )
}

export default AssistCard