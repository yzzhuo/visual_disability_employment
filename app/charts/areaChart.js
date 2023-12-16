import { useD3 } from "../useD3";
import React, { useRef, useState } from "react";
import * as d3 from "d3";

function AreaChart() {
  const containerRef = useRef(null);
  const [data, setData] = useState([
    {
      date: '2014',
      value: 22.7
    },
    {
      date: '2015',
      value: 23.8
    },
    {
      date: '2016',
      value: 24.2
    },
    {
      date: '2017',
      value: 23.5
    },
    {
      date: '2018',
      value: 23.5
    },
    {
      date: '2019',
      value: 24.4
    },
    {
      date: '2020',
      value: 24.4
    },
    {
      date: '2021',
      value: 23.1
    },
    {
      date: '2022',
      value: 21.4
    }
  ]);
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  const ref = useD3(
    (svg) => {
      svg.selectAll("*").remove();
      const x = d3.scaleUtc(d3.extent(data, d => d.date), [marginLeft, width - marginRight]);
      const y = d3.scaleLinear([0, 30], [height - marginBottom, marginTop]);

      // Declare the area generator.
      const area = d3.area()
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(d.value));

      svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      // Append a path for the area (under the axes).
      svg.append("path")
        .attr("fill", "steelblue")
        .attr("d", area(data));

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
          .text("↑ Daily value ($)"));
    },
    []
  );

  return (
    <div ref={containerRef}>
      <svg
        style={{
          overflow: "visible",
          height: 800,
          width: width,
        }}
        ref={ref}
      >
      </svg>
    </div>
  );
}

export default AreaChart;
