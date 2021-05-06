import * as d3 from 'd3'
import {attrs} from './selmulti'
import { tip as d3tip } from 'd3-v6-tip'
import './main.scss'
import keruletmin from './assets/keruletmin.json'

const tip1 = d3tip().attr('class', 'tip1').html((e,d) => {
    return `<div>${d.name}:<br>${d.nep} lakos,<br>${d.ter} km2,<br>lakásonként ${d.lak_nep} fő</div>`
}) 

const tip = d3tip().attr('class', 'tip').html( (e, d) => {
    let content = "<div>Önk. lakások</div>"
    content += `<div>${d.name}: ${d.onlak}</div>`
    return content
})

const setColorByInner = function (inner) {
    let color
    if (inner == 1) color = '#336222'
    if (inner == 2) color = '#5bae3d'
    if (inner == 3) color = '#9dce8b'
    return color
}
let btnsOnlak = document.getElementsByClassName('btn-onlak')
let btnOnlakDis = document.getElementById('btn-onlak-dis')
let btnOnlakSiz = document.getElementById('btn-onlak-siz')
//svg and graph1
let dim1 = {
    width: 700,
    height: 600
}
let svg1 = d3.select('#chart1container').append('svg').attrs(dim1).style('background', 'transparent')
let margin1 = {top:30, bottom:30,left:50,right:50}
const graph1width = dim1.width - margin1.left - margin1.right
const graph1height = dim1.height - margin1.top - margin1.bottom
let graph1 = svg1.append('g').attrs({
    width: graph1width,
    height: graph1height,
    transform: `translate(${margin1.left}, ${margin1.top})`
})
graph1.append('g').attrs({
    transform: `translate(0, ${graph1height})`,
    id: 'x-grid1',
    class: 'grid'
})
graph1.append('g').attrs({
    id: 'y-grid1',
    class: 'grid'
})
graph1.append('polyline').attrs({
    points: `0,0 ${graph1width},0 ${graph1width},${graph1height}`,
    'stroke-width': 2,
    stroke: '#f4f4f4',
    fill: 'none'
})
graph1.append('polyline').attrs({
    points: '23.5,395.5 23.5,468.5 36.5,451.5 13.5,451.5 20.5,468.5',
    'stroke-width': 1,
    stroke: '#f4f4f4',
    fill: 'none',
    'stroke-linecap': 'round'
})
graph1.append('g').attrs({
    transform: `translate(0, ${graph1height})`,
    id: 'xaxis1',
    color: '#f4f4f4'
})
graph1.append('g').attrs({
    color: '#f4f4f4',
    id: 'yaxis1',
})
//scale
//let scaleX1 = d3.scaleLinear().range([graph1width, 0]).domain(d3.max(keruletmin, d=>d.nep))
let scaleX1 = d3.scaleLinear().range([0,graph1width]).domain([20000,150000])
let scaleY1 = d3.scaleLinear().range([graph1height,0]).domain([0,60])
let scaleSize = d3.scaleSqrt().range([20,60]).domain(d3.extent(keruletmin, d=>d.nep / d.lak))
d3.axisBottom(scaleX1)
d3.axisLeft(scaleY1)
let zIndexOrder = [0,2,3,4,5,6,7,10,11,13,15,16,17,18,19,20,21,22,14,9,1,12,8]
let keruletminZ = zIndexOrder.map(i=>keruletmin[i])
graph1.selectAll('circle').data(keruletminZ).enter().append('circle').attrs({
    cx: (d)=>scaleX1(d.nep),
    cy: (d)=>scaleY1(d.ter),
    r: d=>scaleSize(d.nep / d.lak),
    fill: (d) => d.side === 'buda' ? '#D4D45E' : '#91A6E5',
    'fill-opacity': .3,
    stroke: '#f4f4f4',
    'stroke-width': 1.5,
    class: 'c1'
}).on('mouseover', function(e, d) {
    tip1.show(e,d)
}).on('mouseout', function(e, d) {
    tip1.hide(e,d)
})

let gridX1 = d3.axisBottom(scaleX1)
gridX1.tickFormat('').tickSize(-1*graph1height).tickSizeOuter(0)
d3.select('#x-grid1').call(gridX1)
let gridY1 = d3.axisLeft(scaleY1)
gridY1.tickFormat('').tickSize(-1*graph1width).tickSizeOuter(0)
d3.select('#y-grid1').call(gridY1)
d3.selectAll('.grid line').attrs({
    stroke: '#f4f4f4' ,
    'stroke-width': .5,
    'stroke-dasharray': '1,5'
})
let xaxis1 = d3.axisBottom(scaleX1).ticks(5)
d3.select('#xaxis1').call(xaxis1).select('path').attr('stroke-width', 2)
let yaxis1 = d3.axisLeft(scaleY1).ticks(5)
d3.select('#yaxis1').call(yaxis1).select('path').attr('stroke-width', 2)
d3.selectAll('#xaxis1 text').attrs({
    'font-size': 13
})
d3.selectAll('#yaxis1 text').attrs({
    'font-size': 13
})

graph1.call(tip1)
graph1.selectAll('.label').data(keruletmin).enter().append('text').attrs({
    'x':d => d.ker === 1 ? scaleX1(d.nep) -9 : scaleX1(d.nep)+1,
    'y':d => d.ker === 1 ? scaleY1(d.ter) -9 : scaleY1(d.ter)+1,
    'font-size': 16,
    'fill': '#222220',
    'text-anchor': 'middle',
    'alignment-baseline': 'middle',
    'font-weight': 800
}).text(d=>d.ker)
graph1.selectAll('.label').data(keruletmin).enter().append('text').attrs({
    'x':d => d.ker === 1 ? scaleX1(d.nep) -10 : scaleX1(d.nep),
    'y':d => d.ker === 1 ? scaleY1(d.ter) -10 : scaleY1(d.ter),
    'font-size': 16,
    'fill': '#f4f4f4',
    'text-anchor': 'middle',
    'alignment-baseline': 'middle',
    'font-weight': 600
}).text(d=>d.ker)


//svg and graph2
let dim = {
    width: 600,
    height: 300
}
let svg = d3.select('#chart2container').append('svg').attrs(dim).style('background', '#adaea5')
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
//scale
let scaleY = d3.scaleLinear().range([graphHeight,0])
let scaleX = d3.scaleBand().rangeRound([0,graphWidth]).paddingOuter(.3).paddingInner(.2)
let axisX = d3.axisBottom(scaleX)
let axisY = d3.axisLeft(scaleY)
let gridY = d3.axisLeft(scaleY)
axisY.ticks(5)
axisX.tickSize(0)
gridY.tickSize(-1*graphWidth).ticks(5).tickFormat('').tickSizeOuter(0)
let graph = svg.append('g').attrs({
    width: graphWidth,
    height: graphHeight,
    transform: `translate(${margin.left}, ${margin.top})`
})
//gridY, if call to xAxisGroup: the later call diminish it
graph.append('g').call(gridY).selectAll('line').attrs({
    'stroke': '#f4f4f4',
    'stroke-dasharray': '3,9'
})
graph.call(tip)

//render
const update = (data) => {
    scaleY.domain([0, d3.max(data, d=>d.onlak)])
    scaleX.domain(data.map(d=>d.name))

    /* CHART - the content of the chart */
    // the rectangles for the bars
    const rects = graph.selectAll('rect').data(data)
    rects.attrs({
        'x': d => scaleX(d.name),
        'y': (d) => scaleY(d.onlak) - scaleX.bandwidth()/2 +5,
        'rx': 7,
        'ry': 7,
        'width': scaleX.bandwidth(),
        'height': 0,
        'id': (d,i) => d.id,
        'fill': (d) => setColorByInner(d.inner),
        'stroke': '#222220',
        'fill-opacity': 1,
        'stroke-width': 1.2,
        'class': 'rectonlak'
    }).transition().duration(1000).delay(1000).ease(d3.easeBounceOut).attr('height', (d) => scaleY(0) - scaleY(d.onlak) + scaleX.bandwidth()/2 - 5)

    rects.enter().append('rect').attrs({
        'x': d => scaleX(d.name),
        'y': (d) => scaleY(d.onlak) - scaleX.bandwidth()/2 +5,
        'rx': 7,
        'ry': 7,
        'width': scaleX.bandwidth(),
        'height': (d) => scaleY(0) - scaleY(d.onlak) + scaleX.bandwidth()/2,
        'id': (d,i) => d.id,
        'fill': (d) => setColorByInner(d.inner),
        'stroke': '#222220',
        'fill-opacity': 1,
        'stroke-width': 1.2,
    }).on('mouseover', function (e, d) {
        d3.select(this).attr('fill', '#f4f4f4')
        d3.select(`circle#c${d.id}`).attr('fill', '#f4f4f4')
        //console.log(this.getBoundingClientRect())
        tip.offset(function() {
            return [-10, 0]
        })
        tip.show(e,d)
    }).on('mouseout', function (e, d) {
        d3.select(this).attr('fill', (d) => setColorByInner(d.inner))
        d3.select(`circle#c${d.id}`).attr('fill', (d) => d.side === 'buda' ? '#D4D45E' : '#91A6E5')
        tip.hide()
    })
    //circles on the bars
    const circls = graph.selectAll('circle').data(data)
    circls.attrs({
        'r': scaleX.bandwidth()/2,
        'stroke': '#222220',
        'stroke-width': 1.2,
        'id': (d) => `c${d.id}`,
    }).transition().duration(1000).attrs({
        'cx': d => scaleX(d.name) + scaleX.bandwidth()/2,
        'cy': (d) => scaleY(d.onlak),
        'fill': (d) => d.side === 'buda' ? '#D4D45E' : '#91A6E5'
    })

    circls.enter().append('circle').attrs({
        'cx': d => scaleX(d.name) + scaleX.bandwidth()/2,
        'cy': (d) => scaleY(d.onlak),
        'r': scaleX.bandwidth()/2,
        'fill': (d) => d.side === 'buda' ? '#D4D45E' : '#91A6E5',
        'stroke': '#222220',
        'stroke-width': 1.2,
        'id': (d) => `c${d.id}`,
    }).on('mouseover', function (e,d) {
        d3.select(this).attr('fill', '#f4f4f4')
        d3.select(`rect#${d.id}`).attr('fill', '#f4f4f4')
        tip.show(e,d)
    }).on('mouseout', function (e,d) {
        d3.select(this).attr('fill', (d) => d.side === 'buda' ? '#D4D45E' : '#91A6E5')
        d3.select(`rect#${d.id}`).attr('fill', (d) => setColorByInner(d.inner))
        tip.hide()
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
}

update(keruletmin)

//if u saved the script above to a bars variable: to access the html item: using .nodes() method to access the _groups
/* let ker1 = bars.nodes()[0]
console.log(bars) */

//btns
for(let i = 0; i < btnsOnlak.length; i++) {
    btnsOnlak[i].addEventListener('click', () => {
        btnsOnlak[i].classList.add('selected')
        for(let j=0; j < btnsOnlak.length; j++) {
            if (j !== i) btnsOnlak[j].classList.remove('selected')
        }
    })
}
btnOnlakDis.addEventListener('click', () => {
    keruletmin.sort((a, b) => a.ker - b.ker )
    update(keruletmin)
})
btnOnlakSiz.addEventListener('click', () => {
    keruletmin.sort((a, b) => b.onlak - a.onlak )
    update(keruletmin)
})