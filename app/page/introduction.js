import React from "react";
import DonutChart from "../charts/donutChart";

function Intro() {
  return (
    <div className="w-full h-screen flex flex-col space-x-2" data-aos="fade-left" >
      <h1 className="font-serif font-bold text-4xl text-center">Do you know how many people have a disability?</h1>
      <div className="flex mt-12 w-full items-center justify-center flex-1">
        <p>
          In 2022, <span className="font-bold text-primary">27% </span>of the EU population over the age of 16 had some form of disability.
        </p>
      </div>
      <div className="flex items-center justify-center w-full">
        <DonutChart />
      </div>
    </div >
  );
}

export default Intro;
