// Part 1: The x-axis scale & y-axis scale
// Part 2: The axis label below the X axis and next to the Y axis
// Part 3: The circle bubbles
// Part 4: The (abbr state) text inside the circle bubbles
// Part 5: The tool tip popup on mouse move-over

// Set SVG parameters
var svgWidth = 1000;
var svgHeight = 500;

// Margin for SVG graphics
var margin = {
    top: 20,
    bottom: 80,
    left: 100,
    right: 40
  };

  var width = svgWidth - margin.left - margin.right;    
  var height = svgHeight - margin.top - margin.bottom;  

// Create the SVG canvas container  
// Change background color
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("fill", "red")      // font color for labels
  .attr("class", "chart");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Import data
d3.csv("assets/data/data.csv").then(function (myData) {
    console.log("myData");
    console.log(myData);

    myData.forEach(function (st_data) {
        // st_data.state = st_data.state;
        // st_data.abbr = st_data.abbr;
        st_data.poverty = +st_data.poverty;
        st_data.obesity = +st_data.obesity;
        console.log("obesity")
        console.log(st_data.obesity)
      });

//Part 1: The x-axis scale & y-axis scale 
var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(myData, d => d.obesity + 1)])
    .range([0, width]);

var yLinearScale = d3.scaleLinear()
    .domain([5, d3.max(myData, d => d.poverty + 5)])
    .range([height, 0]);    

//create axis
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//Append chartGroup
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
chartGroup.append("g")
    .call(leftAxis);  
    
//Part 2: The axis label below the X axis and next to the Y axis
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("class", "aText")
    .text("In Poverty (%)");

    console.log("y axis label")
    console.log((0 - (height / 2)), (0 - margin.left + 60))

// x-axis labels
chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("Obesity (%)");

    console.log("x axis label")
    console.log((width / 2), (height + margin.top + 30))  

//Part 3: The bubbles
var circlesGroup = chartGroup.selectAll("null")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "20")
    .attr("fill", "blue")
    .attr("class", "stateCircle");

//Part 4: The state abbreviation inside the bubbles 
var stateAbbr = chartGroup.selectAll()
    .data(myData)
    .enter()
    .append("text");
    
    stateAbbr
    .attr("x", function (d) {
      return xLinearScale(d.obesity);
    })
    .attr("y", function (d) {
      return yLinearScale(d.poverty) + 4
    })
    .text(function (d) {
      return d.abbr;
    })
    .attr("class", "stateText")
    .attr("font-size", "9px");    

//Part 5: The tooltip popup on mouseover
var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, 60])
    .html(function (d) {
      var theState = "<div>" + d.state + "</div>";
      var theX = "<div>Obesity: " + d.obesity + "%</div>";
      var theY = "<div>Poverty: " + d.poverty + "%</div>";
      return theState + theX + theY;
    });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
      })    

//mouseout
    .on("mouseout", function (data) {
        toolTip.hide(data);
    });

}).catch(function (error) {
    console.log(error);  
  
});
