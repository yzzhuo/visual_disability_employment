import { useD3 } from "../useD3";
import React, { useRef } from "react";
import * as d3 from "d3";

function DonutChart() {
  const containerRef = useRef(null);
  const width = 928;
  const height = width;
  const radius = width / 6;
  // data from https://ec.europa.eu/eurostat/databrowser/view/hlth_silc_12/default/table?lang=en
  const data = {
    name: 'population',
    children: [{
      name: 'Without disability',
      value: 73,
    }, {
      name: 'With disability',
      children: [{
        name: 'Some limitation',
        value: 19.8,
      }, {
        name: 'Severe limitation',
        value: 7.2,
      }],
    }]
  }

  const ref = useD3(
    (svg) => {
      svg.selectAll("*").remove();
      // set the dimensions and margins of the graph
      // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
      // Create the color scale.
      const color = (name) => {
        const pattern = {
          "population": "#14532d",
          "Without disability": "#155e75",
          "With disability": "#f43f5e",
          "Some limitation": "#e11d48",
          "Severe limitation": "#ec4899",
        }
        return pattern[name];
      }
      // Compute the layout.
      const hierarchy = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
      const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);
      root.each(d => d.current = d);

      // Create the arc generator.
      const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

      svg.attr("viewBox", [-width / 2, -height / 2, width, width])
        .style("font", "10px sans-serif");

      // Append the arcs.
      const path = svg.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
        .attr("d", d => arc(d.current));

      // Make them clickable if they have children.
      path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

      const format = d3.format(",d");
      path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

      const label = svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("font-size", "1rem")
        .attr("fill", "black")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

      const parent = svg.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

      // Handle zoom on click.
      function clicked(event, p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth)
        });

        const t = svg.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
          })
          .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")

          .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", d => +labelVisible(d.target))
          .attrTween("transform", d => () => labelTransform(d.current));
      }

      function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }

      function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }

      function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      }

      const center_label = svg
        .append("text")
        .attr("font-size", "1rem")
        .attr("text-anchor", "middle")
        .attr("fill", "#888")
        .style("visibility", "hidden");

      center_label
        .append("tspan")
        .attr("class", "percentage")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "-0.1em")
        .attr("font-size", "3em")
        .text("");

      center_label.append("tspan")
        .attr("x", 0)
        .attr("y", 0)
        .text("1")
        .attr("font-size", "6em")
        .attr('font-family', 'ui-serif')
        .attr('font-weight', 'bold')
        .attr("fill", '#38bdf8')

      center_label.append("tspan")
        .text("in")
        .attr("font-size", "2em")

      center_label.append("tspan")
        .text("4")
        .attr("font-size", "6em")
        .attr('font-family', 'ui-serif')
        .attr('font-weight', 'bold')
        .attr("fill", '#38bdf8')

      center_label
        .append("tspan")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "1.5em")
        .text("adults have a disability in the EU");

      center_label
        .style("visibility", null)
      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      svg
        .selectAll('allSlices')
        .data(data)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[1]))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

      // // Add the polylines between chart and labels:
      svg
        .selectAll('allPolylines')
        .data(data)
        .join('polyline')
        .attr("stroke", "gray")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function (d) {
          const posA = arc.centroid(d) // line insertion in the slice
          const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          const posC = outerArc.centroid(d); // Label position = almost the same as posB
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
        })
    },
    []
  );

  return (
    <div ref={containerRef} className="w-10/12 flex justify-center pt-12">
      <svg
        style={{
          overflow: "visible",
          cursor: "pointer",
        }}
        className="w-6/12"
        ref={ref}
      >
      </svg>
      <div className="text-xs flex justify-end self-end mb-24">
        Source: <a className="link" href="https://ec.europa.eu/eurostat/databrowser/view/hlth_silc_12/default/table?lang=en">Eurostat</a>
      </div>
    </div>
  );
}

export default DonutChart;
