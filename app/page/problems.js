import React from "react";
import BarChart from "../charts/barChart";

function Problem() {
  return (
    <div className="w-full h-screen flex flex-col items-center space-x-2" data-aos="fade-left" >
      <h1 className="w-7/12 font-serif font-bold text-4xl text-center self-center">
        What Barriers to Employment do People with Disabilities Face?
      </h1>
      <div className="flex mt-12 w-10/12 justify-center ">
        <p className="w-5/12">
          Survey of people with disabilities in the Eurostat shows that they face one or more barriers to employment.
        </p>
      </div>
      <div className="mb-24 flex-1 mt-16">
        <BarChart />
      </div>
    </div>
  );
}

export default Problem;
