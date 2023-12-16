import { useD3 } from "../useD3";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";


function SunBurst() {
  const containerRef = useRef(null);
  // const { width, height } = useContainerSize(containerRef);
  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 40;
  const marginBottom = 30;
  const marginLeft = 40;
  const [data, setData] = useState([]);

  const loadData = async () => {
    const data = await d3.csv("/unemployment_rate_by_disability_status_annual.csv").then((values) => {
      return values.filter((d) => {
        return d['classif1.label'] === 'Disability status (Aggregate): Persons with disability'
          && d['sex.label'] === 'Sex: Total' && d.value !== ''
      }).map((item) => {
        return {
          Date: item.time,
          Symbol: item['ref_area.label'],
          value: Number(item.obs_value)
        }
      })
    })
    setData(data);
  }

  useEffect(() => {
    loadData();
  }, []);

  const ref = useD3((svg) => {
    if (!data.length) return;

    svg.selectAll("*").remove();
    // Create the horizontal time scale.
    const x = d3.scaleUtc()
      .domain(d3.extent(data, d => new Date(d.Date)))
      .range([marginLeft, width - marginRight])
      .clamp(true)

    // Normalize the series with respect to the value on the first date. Note that normalizing
    // the whole series with respect to a different date amounts to a simple vertical translation,
    // thanks to the logarithmic scale! See also https://observablehq.com/@d3/change-line-chart
    const series = d3.groups(data, d => d.Symbol).map(([key, values]) => {
      return { key, values: values };
    });

    const y = d3.scaleLog()
      .domain([1, d3.max(series, d => d3.max(d.values, d => d.value))])
      .rangeRound([height - marginBottom, marginTop])


    // Create a color scale to identify series.
    const z = d3.scaleOrdinal(d3.schemeCategory10).domain(series.map(d => d.Symbol));

    // For each given series, the update function needs to identify the date—closest to the current
    // date—that actually contains a value. To do this efficiently, it uses a bisector:
    const bisect = d3.bisector(d => new Date(d.Date)).left;

    // Create the SVG container.
    svg.attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; -webkit-tap-highlight-color: transparent;");

    // Create the axes and central rule.
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y)
        .ticks(null, x => +x.toFixed(6) + "×"))
      .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", d => d === 1 ? null : 0.2)
        .attr("x2", width - marginLeft - marginRight))
      .call(g => g.select(".domain").remove());

    const rule = svg.append("g")
      .append("line")
      .attr("y1", height)
      .attr("y2", 0)
      .attr("stroke", "black");

    // Create a line and a label for each series.
    const serie = svg.append("g")
      .style("font", "bold 10px sans-serif")
      .selectAll("g")
      .data(series)
      .join("g");

    const line = d3.line()
      .x(d => x(new Date(d.Date)))
      .y(d => y(d.value));

    serie.append("path")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke", d => z(d.key))
      .attr("d", d => {
        return line(d.values);
      });

    serie.append("text")
      .datum(d => ({ key: d.key, value: d.values[d.values.length - 1].value }))
      .attr("fill", d => z(d.key))
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("x", x.range()[1] + 3)
      .attr("y", d => y(d.value))
      .attr("dy", "0.35em")
      .text(d => d.key);

    // Define the update function, that translates each of the series vertically depending on the
    // ratio between its value at the current date and the value at date 0. Thanks to the log
    // scale, this gives the same result as a normalization by the value at the current date.
    function update(date) {
      date = d3.utcDay.round(date);
      rule.attr("transform", `translate(${x(date) + 0.5},0)`);
      serie.attr("transform", ({ values }) => {
        const i = bisect(values, date)
        console.log('i', i);

        if (values[i]) {
          return `translate(0,${y(1) - y(values[i].value / values[0].value)})`;
        }
      });
      svg.property("value", date).dispatch("input"); // for viewof compatibility
    }

    d3.transition()
      .ease(d3.easeCubicOut)
      .duration(1500)
      .tween("date", () => {
        const i = d3.interpolateDate(x.domain()[1], x.domain()[0]);
        return t => update(i(t));
      });

    // When the user mouses over the chart, update it according to the date that is
    // referenced by the horizontal position of the pointer.
    svg.on("mousemove touchmove", function (event) {
      update(x.invert(d3.pointer(event, this)[0]));
      event.preventDefault();
    });
  },
    [data.length]
  );

  return (
    <div ref={containerRef} className="w-full aspect-square">
      <svg
        ref={ref}
        style={{
          height: height,
          width: width,
          marginRight: "0px",
          marginLeft: "0px",
        }}
      />
    </div>
  );
}

export default SunBurst;
