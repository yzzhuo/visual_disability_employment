import React from "react";
import AreaChart from "../charts/areaChart";

function Situation() {
  return (
    <div className="w-full h-screen flex flex-col items-center space-x-2" data-aos="fade-left" >
      <h1 className="w-7/12 font-serif font-bold text-4xl text-center self-center">Millions of individuals with disabilities looking for work remain unemployed</h1>
      <div className="flex mt-12 w-10/12 justify-center flex-1">
        <div className="w-1/12">
          Almost
          <div>
            <span className="text-primary font-bold text-6xl">1</span> in<span
              className="text-primary font-bold text-6xl">5</span>
          </div>
          are unemployed
        </div>
        <p className="w-5/12">
          Latest data from the European Commission show that 17.7% of people with disabilities were unemployed in 2020, compared with 8.6% of people without disabilities. This also has an impact on lack of financial autonomy for people with disabilities.        </p>
      </div>
      <div className="mb-24">
        <AreaChart />
      </div>
    </div>
  );
}

export default Situation;
