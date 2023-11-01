'use client'

import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "first name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "last name must be at least 2 characters.",
  }),
  company: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  message: z.string(),
})

const NewsLetter = () => {

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }


  return (
    <MaxWidthWrapper className="flex flex-col mt-[4rem]">

      <div className="max-w-[65rem] flex items-center justify-between bg-black/95 text-white p-[5rem] mb-[8rem] mx-auto rounded-2xl space-x-10 shadow-lg">

        <div className="flex flex-col justify-between space-y-3">
          <h1 className="uppercase text-2xl font-semibold">Sign up for our newsletter</h1>
          <p className="text-sm max-w-sm font-extralight">Lorem ipsum dolor sit amet consectetur adipisicing elit. ipsum doloribus veritatis molestias maxime qui ipsa?</p>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between space-x-2">
            <Input
              placeholder="Enter your email"
            />
            <Button className="bg-orange-500">Notify me</Button>
          </div>
          <p className="text-sm max-w-sm font-extralight">We care about the protection of your data. Read our <span className="underline">Privacy Policy</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-10">
        <div>
          <h1 className="uppercase text-3xl font-bold mb-2">Have Something in mind?</h1>
          <p className="text-sm max-w-sm font-extralight mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. ipsum doloribus veritatis molestias maxime qui ipsa?</p>
          <Image
            src={'/top-players/top-player3.png'}
            alt="baller"
            width={320}
            height={320}
            quality={100}
            className="mx-auto"
          />
        </div>
        
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex flex-col max-w-lg">
              
              <div className="flex justify-between items-center space-x-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-light">FIRST NAME</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Arthur" 
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-light">LAST NAME</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Curry" 
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-light">COMPANY</FormLabel>
                      <FormControl>
                        <Input placeholder="GSW" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-light">EMAIL</FormLabel>
                      <FormControl>
                        <Input placeholder="ac@gmail.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-light">PHONE NUMBER</FormLabel>
                      <FormControl>
                        <Input placeholder="+19383922829" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-light">MESSAGE</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch />
                <p className="text-xs font-light">By selecting this, you agree to the <span className="underline font-bold">Privacy Policy</span> and <span className="font-bold">Cookie Policy</span></p>
              </div>

              <Button className="bg-orange-500" type="submit">Let's talk</Button>
            </form>
          </Form>
        </div>
      </div>

    </MaxWidthWrapper>
  )
}

export default NewsLetter