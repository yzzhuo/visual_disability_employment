import { useD3 } from "../useD3";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function BarChart() {
  const containerRef = useRef(null);
  const barHeight = 40;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 10;
  const marginLeft = 30;
  const width = 600;

  const [data, setData] = useState([
    {
      letter: 'Own disability',
      frequency: 0.78
    },
    {
      letter: 'Lack of education or training',
      frequency: 0.12
    },
    {
      letter: 'Need for special features at the job',
      frequency: 0.105
    },
    {
      letter: 'Lack of transport',
      frequency: 0.103
    },
    {
      letter: 'Employer’s negative attitudes',
      frequency: 0.098
    },
    {
      letter: 'Lack of support services',
      frequency: 0.04
    },
    {
      letter: 'Other',
      frequency: 0.27
    }
  ]);
  const ref = useD3(
    (svg) => {
      svg.selectAll("*").remove();

      const height = Math.ceil((data.length + 0.1) * barHeight) + marginTop + marginBottom;

      const x = d3.scaleLinear()
        // .domain([0, d3.max(data, d => d.frequency)])
        .domain([0, 1])
        .range([marginLeft, width - marginRight]);

      const y = d3.scaleBand()
        .domain(d3.sort(data, d => -d.frequency).map(d => d.letter))
        .rangeRound([marginTop, height - marginBottom])
        .padding(0.1);

      // Create a value format.
      const format = x.tickFormat(20, "%");

      // Create the SVG container.
      svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif; overflow: visible;");

      // Append a rect for each letter.
      svg.append("g")
        .attr("fill", "steelblue")
        .selectAll()
        .data(data)
        .join("rect")
        .attr("x", x(0))
        .attr("y", (d) => y(d.letter))
        .attr("width", (d) => x(d.frequency) - x(0))
        .attr("height", y.bandwidth());

      // Append a label for each letter.
      svg.append("g")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .selectAll()
        .data(data)
        .join("text")
        .attr("x", (d) => x(d.frequency))
        .attr("y", (d) => y(d.letter) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -4)
        .text((d) => format(d.frequency))
        .call((text) => text.filter(d => x(d.frequency) - x(0) < 20) // short bars
          .attr("dx", +4)
          .attr("fill", "black")
          .attr("text-anchor", "start"));

      // Create the axes.
      svg.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(d3.axisTop(x).ticks(width / 80, "%"))
        .call(g => g.select(".domain").remove());

      svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0));

    },
    []
  );

  return (
    <div ref={containerRef}>
      <svg
        ref={ref}
      />
    </div>
  );
}

export default BarChart;
