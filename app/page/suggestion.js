import React from "react";
import BarChart from "../charts/barChart";

function Suggestion() {
  return (
    <div className="w-full h-screen flex flex-col items-center space-x-2" data-aos="fade-left" >
      <h1 className="w-7/12 font-serif font-bold text-4xl text-center self-center">
        What should we do?
      </h1>
      <div className="flex mt-12 w-10/12 justify-center ">
        <p className="w-5/12">
          These insights may give us some direction on how to improve the situation.
        </p>
      </div>
      <div className="mb-24 flex-1 mt-16 flex gap-4">

        <div className="card w-96 shadow-xl border-cyan-700 border-solid border-2 h-80">
          <div className="card-body">
            <h2 className="card-title">1</h2>
            <p className="font-bold">
              Connect job seekers with disabilities to employers who are looking for talent.
            </p>
          </div>
        </div>

        <div className="card w-96 shadow-xl border-cyan-700 border-solid border-2 h-80">
          <div className="card-body">
            <h2 className="card-title">2</h2>
            <p className="font-bold">
              Connect job seekers with disabilities to employers who are looking for talent.
            </p>
          </div>
        </div>

        <div className="card w-96 shadow-xl border-cyan-700 border-solid border-2 h-80">
          <div className="card-body">
            <h2 className="card-title">3</h2>
            <p className="font-bold">
              Connect job seekers with disabilities to employers who are looking for talent.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Suggestion;
