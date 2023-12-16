import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useD3 } from "../useD3";

function WorldEvolution() {
  const containerRef = useRef(null);
  const marginLeft = 0;
  const marginBottom = 6;
  const marginRight = 6;
  const marginTop = 16;
  const barSize = 48
  const duration = 250
  const n = 10
  const [data, setData] = useState([]);
  const width = 928;

  const loadData = async () => {
    const data = await d3.csv("/eu_disability_employment_gap.csv");
    setData(data);
  }

  useEffect(() => {
    loadData();
  }, []);


  const ref = useD3((svg) => {
    if (!data.length) return;
    svg.selectAll("*").remove();
    const height = marginTop + barSize * n + marginBottom

    svg
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");
    const names = new Set(data.map(d => d.name))

    let datevalues = Array.from(d3.rollup(data, ([d]) => d.value, d => d.date, d => d.name))
      .map(([date, data]) => [new Date(date), data])
      .sort(([a], [b]) => d3.ascending(a, b))

    const y = d3.scaleBand()
      .domain(d3.range(n + 1))
      .rangeRound([marginTop, marginTop + barSize * (n + 1 + 0.1)])
      .padding(0.1)

    const ticker = (svg) => {
      const now = svg.append("text")
        .style("font", `bold ${barSize}px var(--sans-serif)`)
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .attr("x", width - 6)
        .attr("y", marginTop + barSize * (n - 0.45))
        .attr("dy", "0.32em")
        .text(formatDate(keyframes[0][0]));
      return async ([date], transition) => {
        await transition.end()
        now.text(formatDate(date));
      };
    }

    const axis = (svg) => {
      const g = svg.append("g")
        .attr("transform", `translate(0,${marginTop})`);

      const axis = d3.axisTop(x)
        .ticks(width / 160, tickFormat)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()));

      return (_, transition) => {
        g.transition(transition).call(axis);
        g.select(".tick:first-of-type text").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
        g.select(".domain").remove();
      };
    }

    const tickFormat = undefined // override as desired
    const formatNumber = d3.format(",d")

    const textTween = (a, b) => {
      const i = d3.interpolateNumber(a, b);
      return function (t) {
        this.textContent = formatNumber(i(t));
      };
    }

    function labels(svg) {
      let label = svg.append("g")
        .style("font", "bold 12px var(--sans-serif)")
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .selectAll("text");

      return ([date, data], transition) => label = label
        .data(data.slice(0, n), d => d.name)
        .join(
          enter => enter.append("text")
            .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
            .attr("y", y.bandwidth() / 2)
            .attr("x", -6)
            .attr("dy", "-0.25em")
            .text(d => d.name)
            .call(text => text.append("tspan")
              .attr("fill-opacity", 0.7)
              .attr("font-weight", "normal")
              .attr("x", -6)
              .attr("dy", "1.15em")),
          update => update,
          exit => exit.transition(transition).remove()
            .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
            .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
        )
        .call(bar => bar.transition(transition)
          .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
          .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))));
    }

    function bars(svg) {
      let bar = svg.append("g")
        .attr("fill-opacity", 0.6)
        .selectAll("rect");

      return ([date, data], transition) => bar = bar
        .data(data.slice(0, n), d => d.name)
        .join(
          enter => enter.append("rect")
            .attr("fill", color)
            .attr("height", y.bandwidth())
            .attr("x", x(0))
            .attr("y", d => y((prev.get(d) || d).rank))
            .attr("width", d => x((prev.get(d) || d).value) - x(0)),
          update => update,
          exit => exit.transition(transition).remove()
            .attr("y", d => y((next.get(d) || d).rank))
            .attr("width", d => x((next.get(d) || d).value) - x(0))
        )
        .call(bar => bar.transition(transition)
          .attr("y", d => y(d.rank))
          .attr("width", d => x(d.value) - x(0)));
    }
    const k = 10
    const keyframes = (() => {
      const keyframes = [];
      let ka, a, kb, b;
      for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; ++i) {
          const t = i / k;
          keyframes.push([
            new Date(ka * (1 - t) + kb * t),
            rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
          ]);
        }
      }
      keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);
      return keyframes;
    })()
    const nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.name)

    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))
    const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))

    function rank(value) {
      const data = Array.from(names, name => ({ name, value: value(name) }));
      data.sort((a, b) => d3.descending(a.value, b.value));
      for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
      return data;
    }
    const x = d3.scaleLinear([0, 1], [marginLeft, width - marginRight])
    const color = (() => {
      const scale = d3.scaleOrdinal(d3.schemeTableau10);
      if (data.some(d => d.category !== undefined)) {
        const categoryByName = new Map(data.map(d => [d.name, d.category]))
        scale.domain(categoryByName.values());
        return d => scale(categoryByName.get(d.name));
      }
      return d => scale(d.name);
    })()
    const formatDate = d3.utcFormat("%Y")


    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    (async function () {
      for (const keyframe of keyframes) {
        const transition = svg
          .transition()
          .duration(duration)
          .ease(d3.easeLinear);

        x.domain([0, keyframe[1][0].value]);

        updateAxis(keyframe, transition);
        updateBars(keyframe, transition);
        updateLabels(keyframe, transition);
        updateTicker(keyframe, transition);

        await transition.end();
      }
    })();
  }, [data])


  return (
    <div ref={containerRef} className="w-full aspect-square">
      <svg
        ref={ref}
      />
    </div >
  );
}

export default WorldEvolution;
