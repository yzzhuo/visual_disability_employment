import { useD3 } from "../useD3";
import * as d3 from "d3";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useContainerSize } from "../useContainerSize";

function DisabilityPopulation() {
  const containerRef = useRef(null);
  const [data, setData] = useState(null);
  const margin = ({ top: 10, right: 0, bottom: 20, left: 0 })
  const { width } = useContainerSize(containerRef)
  const loadData = async () => {
    let data;
    // fetch and save to IndexedDB
    const response = await d3.csv("/us_population.csv");
    data = response;
    setData(data);
    console.log("population data: ", data);
  }
  useEffect(() => {
    loadData();
  }, []);
  const ref = useD3(
    (svg) => {
      svg.selectAll("*").remove();

      if (data) {
        const height = data.length / 2 * 25 + margin.top + margin.bottom;
        console.log('width: ', width)

        svg.attr("viewBox", [0, 0, width, height])
          .attr("font-family", "sans-serif")
          .attr("font-size", 10);

        const xM = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.value)])
          .rangeRound([width / 2, margin.left])

        const xF = d3.scaleLinear()
          .domain(xM.domain())
          .rangeRound([width / 2, width - margin.right])

        const y = d3.scaleBand()
          .domain(data.map(d => d.age))
          .rangeRound([height - margin.bottom, margin.top])
          .padding(0.1)


        const yAxis = g => g
          .attr("transform", `translate(${xM(0)},0)`)
          .call(d3.axisRight(y).tickSizeOuter(0))
          .call(g => g.selectAll(".tick text").attr("fill", "white"))

        const xAxis = g => g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(g => g.append("g").call(d3.axisBottom(xM).ticks(width / 80, "s")))
          .call(g => g.append("g").call(d3.axisBottom(xF).ticks(width / 80, "s")))
          .call(g => g.selectAll(".domain").remove())
          .call(g => g.selectAll(".tick:first-of-type").remove())

        svg.append("g")
          .selectAll("rect")
          .data(data)
          .join("rect")
          .attr("fill", d => d3.schemeSet1[d.sex === "M" ? 1 : 0])
          .attr("x", d => d.sex === "M" ? xM(d.value) : xF(0))
          .attr("y", d => y(d.age))
          .attr("width", d => d.sex === "M" ? xM(0) - xM(d.value) : xF(d.value) - xF(0))
          .attr("height", y.bandwidth());

        svg.append("g")
          .attr("fill", "white")
          .selectAll("text")
          .data(data)
          .join("text")
          .attr("text-anchor", d => d.sex === "M" ? "start" : "end")
          .attr("x", d => d.sex === "M" ? xM(d.value) + 4 : xF(d.value) - 4)
          .attr("y", d => y(d.age) + y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("width", d => d.sex === "M" ? xM(0) - xM(d.value) : xF(d.value) - xF(0))
          .text(d => d.value.toLocaleString());

        svg.append("text")
          .attr("text-anchor", "end")
          .attr("fill", "white")
          .attr("dy", "0.35em")
          .attr("x", xM(0) - 4)
          .attr("y", y(data[0].age) + y.bandwidth() / 2)
          .text("Male");

        svg.append("text")
          .attr("text-anchor", "start")
          .attr("fill", "white")
          .attr("dy", "0.35em")
          .attr("x", xF(0) + 24)
          .attr("y", y(data[0].age) + y.bandwidth() / 2)
          .text("Female");

        svg.append("g")
          .call(xAxis);

        svg.append("g")
          .call(yAxis);
        console.log('svg: ', svg)
      }
    },
    [data]
  );

  return (
    <div className="gap-y-4">
      <div ref={containerRef} className="w-full flex">
        <svg
          ref={ref}
          style={{
            overflow: "visible",
            height: 800,
            width: width,
            marginTop: margin.top,
            marginLeft: margin.left,
            marginRight: margin.right,
            marginBottom: margin.bottom,
          }}
        />
      </div>
    </div>
  );
}

export default DisabilityPopulation;
