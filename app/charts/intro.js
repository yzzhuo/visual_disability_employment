import React from "react";



function Intro() {
  return (
    <div className="w-full">
      <h1 className="font-bold text-lg">How many people have a disability in the EU? </h1>
      <p>
        In 2022, 27% of the EU population over the age of 16 had some form of disability.
      </p>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div
          >
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              1 <span>in</span> 4
            </dd>
            <dt className="truncate text-sm font-medium text-gray-500">
              adults have a disability in the EU
            </dt>
          </div>
        </dl>
        <div>
          <h2 className="font-bold">Percentage of people with a disability per country</h2>
          <div>
            <span>Latvias has the highest share of people with a disability</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
