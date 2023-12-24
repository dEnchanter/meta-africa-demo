import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "@/util/axios";
import { Endpoint } from "@/util/constants";
import { redirect, useRouter } from "next/navigation";

export function useUser({ 
  redirectTo = undefined, 
  redirectIfFound = undefined } : {
  redirectTo?: string | boolean | null,
  redirectIfFound?: string | boolean | null,
  } = {}) {
 
  const { data: user, mutate: mutateUser, ...rest } = useSWR(Endpoint.GET_USER, userFetcher);

  async function userFetcher(url: any) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    // if (!redirectTo || !user) redirect('/login');
    if (!redirectTo || !user) return; 

  }, [user, redirectTo, redirectIfFound]);

  return { user, mutateUser, ...rest };
}