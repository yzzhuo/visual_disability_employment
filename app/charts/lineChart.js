import { useD3 } from "../useD3";
import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

function LineChart() {
  const containerRef = useRef(null);
  const [disabilityData, setDisabilityData] = useState([]);
  const [withoutDisabilityData, setWithoutDisabilityData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [countries, setCountries] = useState([]);
  const handleSelectCountry = (e) => {
    setSelectedCountry(e.target.value);
  }
  const loadData = async () => {
    // fetch and save to IndexedDB
    const disability_unemploy_res = await Promise.all([
      d3.csv("/unemployment_rate_with_disability.csv"),
      d3.csv("/unemployment_rate_without_disability.csv"),
    ])
    const disability_unemploy = disability_unemploy_res[0];
    const without_disability_unemploy = disability_unemploy_res[1];
    const disability_unemploy_data = disability_unemploy.map((d) => {
      return {
        date: new Date(d.Period),
        value: Number(d.Value),
        country: d['Country_E'],
      };
    });
    const without_disability_unemploy_data = without_disability_unemploy.map((d) => {
      return {
        date: new Date(d.Period),
        value: Number(d.Value),
        country: d['Country_E'],
      };
    });
    // get all countries
    const countries = new Set(disability_unemploy.map((d) => d['Country_E']));

    setCountries(['All', ...countries]);
    setDisabilityData(d3.sort(disability_unemploy_data, (a, b) => b.date - a.date));
    setWithoutDisabilityData(d3.sort(without_disability_unemploy_data, (a, b) => b.date - a.date));
  }

  useEffect(() => {
    loadData();
  }, []);

  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  const transformToAverage = (data) => {
    const groupedData = d3.group(data, (d) => d.date);
    const result = [];
    groupedData.forEach((value, key) => {
      const sum = value.reduce((a, b) => a + (b.value || 0), 0);
      const average = sum / value.length;
      result.push({
        date: key,
        value: average,
      })
    })
    return d3.sort(result, (a, b) => b.date - a.date)
  }

  const ref = useD3(
    (svg) => {
      svg.selectAll("*").remove();
      if (disabilityData.length === 0 || !withoutDisabilityData.length === 0) return;
      let dataWithDisability;
      let compareDataWithoutDisability
      if (selectedCountry !== 'All') {
        dataWithDisability = disabilityData.filter((d) => d.country === selectedCountry);
        compareDataWithoutDisability = withoutDisabilityData.filter((d) => d.country === selectedCountry);
      } else {
        // calucate the average value for each date
        dataWithDisability = transformToAverage(disabilityData)
        compareDataWithoutDisability = transformToAverage(withoutDisabilityData)
      }
      console.log(dataWithDisability);
      console.log(compareDataWithoutDisability);
      const x = d3.scaleUtc(d3.extent(dataWithDisability, d => d.date), [marginLeft, width - marginRight]);
      // Declare the y (vertical position) scale.
      const y = d3.scaleLinear([0, d3.max(dataWithDisability, d => d.value)], [height - marginBottom, marginTop]);

      // Declare the line generator.
      const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

      // Create the SVG container.
      svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

      // Add the x-axis.
      svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

      // Add the y-axis, remove the domain line, add grid lines and a label.
      svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("Unemployment Rate (%)"));
      // Append a path for the line.
      svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", line(dataWithDisability));

      // add label right to the line
      svg.append("text")
        .attr("x", width - marginRight)
        .attr("y", y(dataWithDisability[0].value))
        .attr("dy", "1em")
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .style("font-size", "0.75rem")
        .text("With Disability");

      svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line(compareDataWithoutDisability))

      // add label right to the line
      svg.append("text")
        .attr("x", width - marginRight)
        .attr("y", y(compareDataWithoutDisability[0].value))
        .attr("dy", "1em")
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .style("font-size", "0.75rem")
        .text("Without Disability")
    },
    [disabilityData, withoutDisabilityData, selectedCountry]);

  return (
    <div ref={containerRef}>
      <div className="flex margin-y-2 justify-end">
        <select
          className="select select-bordered select-sm w-full max-w-xs mb-4"
          onInput={handleSelectCountry}
        >
          {countries.map((country) => {
            return <option value={country} key={country}>{country}</option>
          })}
        </select>
      </div>
      <svg
        style={{
          overflow: "visible",
          height: 800,
          width: width,
        }}
        ref={ref}
      >
      </svg>
      <div className="text-xs flex justify-end mt-4">
        Source: <a className="link" href="https://w3.unece.org/SDG/en/Indicator?id=25">UNECE</a>
      </div>
    </div>
  );
}

export default LineChart;
