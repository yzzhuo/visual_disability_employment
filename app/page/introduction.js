import React from "react";
import DonutChart from "../charts/donutChart";

function Intro() {
  return (
    <div className="w-full h-screen flex flex-col space-x-2" data-aos="fade-left" >
      <h1 className="font-serif font-bold text-4xl text-center">Do you know how many people have a disability?</h1>
      <div className="flex mt-12 w-full items-center justify-center flex-1">
        <div>
          <span className="text-primary font-bold text-6xl">1</span> in
          <span
            className="text-primary font-bold text-6xl">4</span>
        </div>
        <p>
          In 2022, 27% of the EU population over the age of 16 had some form of disability.
        </p>
      </div>
      <div className="flex items-center justify-center  w-full">
        <DonutChart />
      </div>
    </div >
  );
}

export default Intro;
