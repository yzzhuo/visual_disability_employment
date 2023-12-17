import React from "react";
import LineChart from "../charts/lineChart";

function Situation() {
  return (
    <div className="w-full h-screen flex flex-col items-center space-x-2" data-aos="fade-left" >
      <h1 className="w-7/12 font-serif font-bold text-4xl text-center self-center">Almost <span className="text-primary font-bold ">1</span> in <span className="text-primary font-bold ">5</span> are unemployed</h1>
      <div className="flex mt-12 w-10/12 justify-center">
        <p className="lg:w-8/12">
          Despite the general decrease in unemployment, people with disabilities still face a significant employment disparity. In 2021, the unemployment rate for this group was 27%, three times higher than that of those without disabilities (8%).
        </p>
      </div>
      <div className="mb-24 flex-1 mt-12">
        <LineChart />
      </div>
    </div>
  );
}

export default Situation;
