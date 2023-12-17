"use client";
import { useState, useEffect } from "react";
import { MyContextProvider } from "./data_context";
import Introduction from './page/introduction';
import Situation from './page/situation';
import Problem from './page/problems';
import Suggestion from './page/suggestion';

import { useRouter } from "next/navigation";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <MyContextProvider>
      <div data-aos="fade-up" className="w-full md:w-4/5 m-auto space-y-2 pt-36 sm:pt-24 h-screen flex flex-col justify-between pl-12 pr-12 items-center">
        <h1 className="mt-36 font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-center place-self-center leading-snug"
          style={{ lineHeight: "1.2em" }}
        >
          A Visual Report: Employment of People with Disabilities
        </h1>
        <div className="flex justify-center pb-24 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </div>
      <Introduction />
      <Situation />
      <Problem />
      <Suggestion />
    </MyContextProvider>
  );
}
