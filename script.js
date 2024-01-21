// Fetch the dataset
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(data => {
        createScatterplot(data);
    });

function createScatterplot(dataset) {
    // Define the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#scatterplot")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleLinear()
      .domain([d3.min(dataset, d => d.Year), d3.max(dataset, d => d.Year)])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("id", "x-axis")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const y = d3.scaleTime()
      .domain(d3.extent(dataset, d => d.Seconds))
      .range([ height, 0 ]);
    svg.append("g")
      .attr("id", "y-axis")
      .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S")));

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(dataset)
      .enter()
      .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.Year))
        .attr("cy", d => y(d.Seconds))
        .attr("r", 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => d.Seconds);

    // Add a legend
    // ...

    // Add tooltip
    const tooltip = d3.select("#scatterplot")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg.selectAll(".dot")
      .on("mouseover", (d) => {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html(d.Name + ": " + d.Nationality)
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY - 28) + "px")
                 .attr("data-year", d.Year);
      })
      .on("mouseout", (d) => {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      });

    // Add the legend
    // ...
}
