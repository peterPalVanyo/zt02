import * as d3 from 'd3'
import {attrs} from './selmulti'
import './main.scss'
import keruletmin from './assets/keruletmin.json'

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
let svg



for(let i = 0; i < btnsOnlak.length; i++) {
    btnsOnlak[i].addEventListener('click', () => {
        btnsOnlak[i].classList.add('selected')
        for(let j=0; j < btnsOnlak.length; j++) {
            if (j !== i) btnsOnlak[j].classList.remove('selected')
        }
    })
}
btnOnlakDis.addEventListener('click', () => {
    svg.remove()
    keruletmin.sort((a, b) => a.ker - b.ker )
    renderOnlak()
})
btnOnlakSiz.addEventListener('click', () => {
    svg.remove()
    keruletmin.sort((a, b) => b.onlak - a.onlak )
    renderOnlak()
})

let dim = {
    width: 600,
    height: 300
}

let margin = {top:20, bottom:50,left:40,right:10}
const graphWidth = dim.width - margin.left - margin.right
const graphHeight = dim.height - margin.top - margin.bottom
const renderOnlak = function () {
    svg = d3.select('#chart2container').append('svg').attrs(dim).style('background', '#adaea5')
    
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
    let scaleY = d3.scaleLinear([0, d3.max(keruletmin, d=>d.onlak)], [graphHeight,0])
    let scaleX = d3.scaleBand().domain(keruletmin.map(d=>d.name)).rangeRound([0,graphWidth]).paddingOuter(.3).paddingInner(.3)
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
    graph.selectAll('rect').data(keruletmin).enter().append('rect').attrs({
        'x': d => scaleX(d.name),
        //adjust the rounded rect widh bandwidth 1
        'y': (d) => scaleY(d.onlak) - scaleX.bandwidth()/2,
        'rx': 7,
        'ry': 7,
        'width': scaleX.bandwidth(),
        //adjust the runded rect widh bandwidth 2 
        'height': (d) => scaleY(0) - scaleY(d.onlak) + scaleX.bandwidth()/2,
        'id': (d,i) => d.id,
        'fill': (d) => setColorByInner(d.inner),
        'stroke': '#222220',
        'fill-opacity': 1,
        'stroke-width': 1.5,
    })
    svg.select('rect#bp01').attr('fill', '#336222')
    //if u saved the script above to a bars variable: to access the html item: using .nodes() method to access the _groups
    /* let ker1 = bars.nodes()[0]
    console.log(bars) */
    
    //circle at the top of the bars
    graph.selectAll('circle').data(keruletmin).enter().append('circle').attrs({
        'cx': d => scaleX(d.name) + scaleX.bandwidth()/2,
        'cy': (d) => scaleY(d.onlak),
        'r': scaleX.bandwidth()/2,
        'fill': (d) => d.side === 'buda' ? '#336222' : '#5bae3d',
        'stroke': '#222220',
        'stroke-width': 1.5,
        id: (d) => d.id,
    })
    //svg.select('circle#bp01').attr('fill', '#9dce8b')
}

renderOnlak()



