
// fetching the data from the url and saving it in an array
let dataset = [];
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
try {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            dataset = data.data
            console.log(dataset)
            
            // declaring the size of the svg container
            const width = 900;
            const height = 480;
            let padding = 40;
            
            // selecting the svg container
            const svg = d3.select('svg')
                .attr("width", width)
                .attr("height", height)
                // .style("background-color", "coral")
            
            // scaling the rect bars horizontally
            let xScale = d3.scaleLinear()
                        .domain([0, dataset.length -1 ])
                        .range([padding, width - padding]);
            
            // scaling the rect verticelly
            let yScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset, (item) => {
                            return item[1]
                        })])
                        .range([0, height - (2 * padding)]);
            
            
            // Creating an array to store the converted dates from the json array
            const datesArray = dataset.map((item) => {
                return new Date(item[0])
            })
            
            
            // creating the x & y axis scale
            let xAxisScale = d3.scaleTime()
                            .domain([d3.min(datesArray), d3.max(datesArray)])
                            .range([padding, width - padding]);
            
            let yAxisScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, (item) => {
                                return item[1]
                            })])
                            .range([height - padding, padding])
            
            // drawing the axises on the svg canvas

            let xAxis = d3.axisBottom().scale(xAxisScale);  // drawing the x axis
            let yAxis = d3.axisLeft().scale(yAxisScale);    // drawing the y axis
               
            // adding the x axis               
            svg.append('g')
            .attr('id', "x-axis")
            .attr("transform", `translate(0,${height - padding})`)
            .call(xAxis);

            // adding the y axis
            svg.append('g')
            .attr('id', "y-axis")
            .attr("transform", `translate(${padding},0)`)
            .call(yAxis);


            // creating a container for the tooltip
            let tooltip = d3.select("body")
                            .append("div")
                            .attr("id", "tooltip")
                            .style('visibility', 'hidden')
                            .style('width', 'auto')
                            .style('height', 'auto')

            // drawing the rectangle bars onto the scales created
            svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", (height - (2 * padding)) / dataset.length)
            .attr("data-date", (item) => {
                return item[0]
            })
            .attr("data-gdp", (item) => {
                return item[1]
            })
            .attr("height", (item) => {
                return yScale(item[1])
            })
            .attr("x", (item, index) => {
                return xScale(index)
            })
            .attr("y", (item) => {
                return (height-padding) - yScale(item[1])
            })
            .on('mouseover', (item) => {
                tooltip.transition()
                .style('visibility', 'visible')

                tooltip.text(item[0])

                document.querySelector('#tooltip').setAttribute('data-date', item[0])
            })
            .on('mouseout', (item) => {
                tooltip.transition()
                .style('visibility', 'hidden')
            })
        })
} catch (error) {
    console.log("error fetching the data: " + error);
}


