import * as d3 from 'd3'
import {attrs} from './selmulti'
import './main.scss'
import districts from './assets/districts.json'

/* IF U WANT TO SORT OUT */
//districts.sort((a,b)=>a.onlak - b.onlak)
let dim = {
    width: 600,
    height: 300
}
let svg = d3.select('#chart2').append('svg').attrs(dim).style('background', '#adaea5')
let margin = {top:20, bottom:50,left:40,right:10}
const graphWidth = dim.width - margin.left - margin.right
const graphHeight = dim.height - margin.top - margin.bottom
const xAxisGroup = svg.append('g').attrs({
    color: 'white',
    transform: `translate(${margin.left}, ${graphHeight+margin.top})`,
    id: 'xaxis'
})
const yAxisGroup = svg.append('g').attrs({
    color: 'white',
    id: 'yaxis',
    transform: `translate(${margin.left}, ${margin.top})`
})
const graph = svg.append('g').attrs({
    width: graphWidth,
    height: graphHeight,
    transform: `translate(${margin.left}, ${margin.top})`
})
//domain and range: top is the svg height-50
let scaleY = d3.scaleLinear([0, d3.max(districts, d=>d.onlak)], [graphHeight,0])
let scaleX = d3.scaleBand().domain(districts.map(d=>d.name)).rangeRound([0,graphWidth]).paddingOuter(.3).paddingInner(.3)
/* AXES - the axises, somehow the translateX didnot work */
let axisX = d3.axisBottom(scaleX)
let axisY = d3.axisLeft(scaleY)
let gridY = d3.axisLeft(scaleY)
axisY.ticks(5)
axisX.tickSize(0)
gridY.tickSize(-1*graphWidth).ticks(5).tickFormat('').tickSizeOuter(0)
//gridY, if call to xAxisGroup: the later call diminish it
graph.append('g').call(gridY).selectAll('line').attrs({
    'stroke': '#f4f4f4',
    'stroke-dasharray': '3,9'
})
//titleX
xAxisGroup.call(axisX)
d3.selectAll('#xaxis text').attrs({
    'font-size': 14,
    'text-anchor': 'end',
    'color': '#222220',
    'transform': `rotate(-90), translate(-8,-${scaleX.bandwidth()/2})`
})
//titleY
yAxisGroup.call(axisY)
d3.selectAll('#yaxis text').attrs({
    'color': '#f4f4f4',
})
/* CHART - the content of the chart */
graph.selectAll('rect').data(districts).enter().append('rect').attrs({
    'x': d => scaleX(d.name),
    //adjust the rounded rect widh bandwidth 1
    'y': (d) => scaleY(d.onlak) - scaleX.bandwidth()/2,
    'rx': 7,
    'ry': 7,
    'width': scaleX.bandwidth(),
    //adjust the runded rect widh bandwidth 2 
    'height': (d) => scaleY(0) - scaleY(d.onlak) + scaleX.bandwidth()/2,
    'id': (d,i) => d.id,
    'fill': '#5bae3d',
    'stroke': '#222220',
    'fill-opacity': 1,
    'stroke-width': 1.5,
})
svg.select('rect#elso').attr('fill', '#336222')
//if u saved the script above to a bars variable: to access the html item: using .nodes() method to access the _groups
/* let ker1 = bars.nodes()[0]
console.log(bars) */

//circle at the top of the bars
graph.selectAll('circle').data(districts).enter().append('circle').attrs({
    'cx': d => scaleX(d.name) + scaleX.bandwidth()/2,
    'cy': (d) => scaleY(d.onlak),
    'r': scaleX.bandwidth()/2,
    'fill': '#336222',
    'stroke': '#222220',
    'stroke-width': 1.5,
    id: (d) => d.id,
})
svg.select('circle#elso').attr('fill', '#9dce8b')
