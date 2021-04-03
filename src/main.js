import * as d3 from 'd3'
import {attrs} from './selmulti'

// DATA - önkormányzati lakások száma
let data1 = [1424,462,3032,2382,1035,1034,2527,4375,2926,2536,1321,1128,5865,2571,1952,270,728,1338,648,663,1412,618,45]
let cat = ['01ker', '02ker', '03ker', '04ker', '05ker', '06ker', '07ker', '08ker', '09ker', '10ker', '11ker', '12ker', '13ker', '14ker', '15ker', '16ker', '17ker', '18ker', '19ker', '20ker', '21ker', '22ker', '23ker']

let districts = [{name:'01ker', onlak:1424, id:'elso'},{name:'02ker', onlak:462},{name:'03ker', onlak:3032},{name:'04ker', onlak:2382},{name:'05ker', onlak:1035},{name:'06ker', onlak:1034},{name:'07ker', onlak:2527},{name:'08ker', onlak:4375},{name:'09ker', onlak:2926},{name:'10ker', onlak:2536},{name:'11ker', onlak:1321},{name:'12ker', onlak:1128},{name:'13ker', onlak:5865},{name:'14ker', onlak:2571},{name:'15ker', onlak:1952},{name:'16ker', onlak:270},{name:'17ker', onlak:728},{name:'18ker', onlak:1338},{name:'19ker', onlak:648},{name:'20ker', onlak:663},{name:'21ker', onlak:1412},{name:'22ker', onlak:618},{name:'23ker', onlak:45},]

/* IF U WANT TO SORT OUT */
//districts.sort((a,b)=>a.onlak - b.onlak)

let dim = {
    'width': 800,
    'height': 420
}

let svg = d3.select('body').append('svg').attrs(dim).style('background', '#333')



//domain and range: top is the svg height-50
let scaleY = d3.scaleLinear([0, d3.max(districts, d=>d.onlak)], [350,50])
let scaleX = d3.scaleBand().domain(districts.map(d=>d.name)).rangeRound([50,780]).paddingOuter(0).paddingInner(.2)

/* AXES - the axises, somehow the translateX didnot work */

let axisX = d3.axisBottom(scaleX)
let axisY = d3.axisLeft(scaleY)
let gridY = d3.axisLeft(scaleY)
axisY.ticks(5)
axisX.tickSize(0)
gridY.tickSize(-730).ticks(5).tickFormat('').tickSizeOuter(0)
//gridY
svg.append('g').attr('transform', 'translate(50,0)').call(gridY).selectAll('line').attrs({
    'stroke': 'white',
    'stroke-dasharray': '3,9'
})
//titleX
svg.append('g').attr('transform','translate(0,350)').attr('color','white').call(axisX).selectAll('text').attrs({
    'font-size': 15,
    'transform': 'rotate(-60), translate(-30,0)',
})
//titleY
svg.append('g').style('font-size', '12px').attrs({
    'transform': 'translate(50,0)',
    'color': 'white',
}).call(axisY)

/* CHART - the content of the chart */

svg.selectAll('rect').data(districts).enter().append('rect').attrs({
    'x': d => scaleX(d.name),
    'y': (d) => scaleY(d.onlak),
    'width': scaleX.bandwidth(),
    'height': (d) => scaleY(0) - scaleY(d.onlak),
    id: (d,i) => d.id,
    'fill': '#808080',
    'stroke': 'white',
    'fill-opacity': .6,
    'stroke-width': 2,
})
//svg.select('rect#elso').attr('fill', '#FFB0CD')
svg.select('rect#elso').attr('fill', 'white')

//if u saved the script above to a bars variable: to access the html item: using .nodes() method to access the _groups
/* let ker1 = bars.nodes()[0]
console.log(bars) */

//circle at the top of the bars
svg.selectAll('circle').data(districts).enter().append('circle').attrs({
    'cx': d => scaleX(d.name) + scaleX.bandwidth()/2,
    'cy': (d) => scaleY(d.onlak),
    'r': scaleX.bandwidth()/2,
    'fill': '#666',
    'stroke': 'white',
    'stroke-width': 2,
    id: (d) => d.id,
})
svg.select('circle#elso').attr('fill', '#FF7BAC')

