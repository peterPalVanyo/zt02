import * as d3 from 'd3'
import {attrs} from './selmulti'
import { tip as d3tip } from 'd3-v6-tip'
import './main.scss'
import keruletmin from './assets/keruletmin.json'

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
//svg and graph
let graph
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
graph = svg.append('g').attrs({
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
        d3.select(`circle#c${d.id}`).attr('fill', (d) => d.side === 'buda' ? '#336222' : '#5bae3d')
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
        'fill': (d) => d.side === 'buda' ? '#336222' : '#5bae3d'
    })

    circls.enter().append('circle').attrs({
        'cx': d => scaleX(d.name) + scaleX.bandwidth()/2,
        'cy': (d) => scaleY(d.onlak),
        'r': scaleX.bandwidth()/2,
        'fill': (d) => d.side === 'buda' ? '#336222' : '#5bae3d',
        'stroke': '#222220',
        'stroke-width': 1.2,
        'id': (d) => `c${d.id}`,
    }).on('mouseover', function (e,d) {
        d3.select(this).attr('fill', '#f4f4f4')
        d3.select(`rect#${d.id}`).attr('fill', '#f4f4f4')
        tip.show(e,d)
    }).on('mouseout', function (e,d) {
        d3.select(this).attr('fill', (d) => d.side === 'buda' ? '#336222' : '#5bae3d')
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