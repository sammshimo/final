
const m = {
    width: 800,
    height: 700
}

d3.select('body')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('flex-direction', 'row')
    .style('font-family', 'sans-serif')

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

const filter = d3.select('body').append('div')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .style('flex-direction', 'column')

let tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0)
.style('display', 'flex')
.style('align-items', 'center')
.style('justify-content', 'center')
.style('position', 'absolute')
.style('width', '120px')
.style('height', '50px')
.style('font', '5px sans-serif')
.style('text-align', 'center')
.style('padding', '2px')
.style('border', '2px solid')
.style('border-radius', '8px')
.style('background', '#F4F4F4')
.style('pointer-events', 'none');

const g = svg.append('g')

let numCases = 0;

d3.json('asiageo.json').then(function(data) {

    d3.csv('Confirmed.csv').then(function(pointData) {

        // draw map
        const albersProj = d3.geoAlbers()
            .scale(500)
            .rotate([-104.1954, 0]) // -longitude
            .center([0, 35.8617]) // latitude
            .translate([m.width/2, m.height/2]);

        const geoPath = d3.geoPath()
        .projection(albersProj)

        g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath)

        svg.append('text')
        .attr('x', 400)
        .attr('y', 100)
        .style('font-size', '16pt')
        .text("Number of Confirmed Cases Over Time")
        .attr('fill', 'grey');

        let dateText = filter.append('p').text('Date: ').style('font-size', '10pt').attr('id', 'date')
        filter.append('p').text('Filter by number of cases:').style('font-size', '10pt')
        let num = ['0', '100', '250', '400', '650', '1000'];
        let numFilter = filter.append('select').attr('id', 'num-filter');
    
        numFilter.selectAll('.option')
            .data(num)
            .enter()
            .append('option')
            .attr('value', function(d) { return d })
            .text(function(d) { return '>' + d });
    
        numFilter.on('change', (d) => {
            numCases = d3.select('#num-filter').property('value');
            plotData(pointData, '2/14/2020');
        });

        filter.append('button')
            .text('Re-animate')
            .style('margin', '20px')
            .attr('id', 'reset')
            .on('click', function(d) {
                animate(pointData);
            })
        
        animate(pointData);

        // animates map
        function animate(pointData) {
            document.getElementById('num-filter').disabled = true;
            document.getElementById('reset').disabled = true;

            let dates = ['1/21/2020', '1/22/2020', '1/23/2020', '1/24/2020', '1/25/2020', '1/26/2020', '1/27/2020',
            '1/28/2020', '1/29/2020', '1/30/2020', '1/31/2020', '2/1/2020', '2/2/2020', '2/3/2020', '2/4/2020',
            '2/5/2020', '2/6/2020', '2/7/2020', '2/8/2020', '2/9/2020', '2/10/2020', '2/11/2020', '2/12/2020',
            '2/13/2020', '2/14/2020'];

            for (let i = 0; i < dates.length; i++) {
                setTimeout(function() { plotData(pointData, dates[i]) }, 
                1000*(i))
            }

            setTimeout(function () { 
                document.getElementById('num-filter').disabled = false; 
                document.getElementById('reset').disabled = false;
            }, 1000 * dates.length);
        }

        // plots circles on the map
       function plotData(pointData, date) {

            g.selectAll('circle').remove();

/*             let case_data = pointData.map((row) => +row["Number of Cases"]);
            let case_limits = d3.extent(case_data);
            let case_map_func = d3.scaleLinear()
            .domain([case_limits[0], case_limits[1]])
            .range([2, ]); */

            document.getElementById('date').innerHTML = "Date: " + date;

            g.selectAll('.circle')
                .data(pointData.filter((d) => {
                    return d['Date'] == date && 
                    d['Number of Cases'] > parseInt(numCases);
                }))
                .enter()
                .append('circle')
                    .attr('cx', function(d) { 
                        let scaledPoints = albersProj([d['Long'], d['Lat']])
                        return scaledPoints[0]
                    })
                    .attr('cy', function(d) {
                        let scaledPoints = albersProj([d['Long'], d['Lat']])
                        return scaledPoints[1]
                    })
                    .attr('r', function(d) {
                        let n = d['Number of Cases'];
                        let rad = 0;
                        if (n > 0) { rad = 2; }
                        if (n > 250) { rad = 4; }
                        if (n > 500) { rad = 6; }
                        if (n > 750) { rad = 8; }
                        if (n > 1000) { rad = 10; }
                        if (n > 1250) { rad = 12; }
                        if (n > 1500) { rad = 14; }
                        if (n > 1750) { rad = 16; }
                        if (n > 2000) { rad = 18; }
                        if (n > 2500) { rad = 20; }
                        if (n > 3000) { rad = 22; }
                        if (n > 3500) { rad = 24; }
                        if (n > 4000) { rad = 26; }
                        if (n > 4500) { rad = 28; }
                        if (n > 5000) { rad = 30; }
                        if (n > 5500) { rad = 32; }
                        if (n > 6000) { rad = 34; }
                        if (n > 8000) { rad = 36; }
                        if (n > 10000) { rad = 38; }
                        if (n > 20000) { rad = 40; }
                        if (n > 30000) { rad = 42; }
                        if (n > 40000) { rad = 44; }
                        if (n > 50000) { rad = 46; }
                        return rad;

                        // return case_map_func(d["Number of Cases"])
                    })
                    .attr('stroke', 'grey')
                    .attr('fill', '#A40034')
                    .attr('opacity', .5)
                    .on("mouseover", (d) => {
                        tooltip.transition()
                          .duration(200)
                          .style("opacity", .9)
                          .style('border-color', 'grey' );
                        tooltip.html(d['Province/State'] + "<br/>" + d['Country/Region'] + "<br/>" + d['Date']
                                    + "<br/>" + "Number of Cases: " + d['Number of Cases'])
                          .style("left", (d3.event.pageX) + "px")
                          .style("top", (d3.event.pageY - 28) + "px");
                      })
                      .on("mouseout", (d) => {
                        tooltip.transition()
                          .delay(250)
                          .duration(500)
                          .style("opacity", 0);
                      });

           }
    })
  
})
