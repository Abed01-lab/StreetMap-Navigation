import { Circle, LayerGroup, MapContainer, Polyline, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import './App.css'
import { useState } from 'react';
import { getClosesPoint, getRouteAstar, getRouteDijkstra } from './db';
import { Toaster } from 'react-hot-toast';
import Dropdown from './dropdown';
import data from "./data.json"
import { Data } from './cleanData';
import { getRoads, getRoadsLine } from './utils';
import React from 'react';

const algorithms = [
  { name: 'Dijksta' },
  { name: 'Depth First Search' },
  { name: 'A*' },
]
function App() {
  const [selected, setSelected] = useState(algorithms[0])
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [path, setPath] = useState<any>(null)
  const [nodes, setNodes] = useState<any>(false)
  const [paths, setPaths] = useState<any>(false)


  const CalculateRoute = () => {
    switch (selected.name) {
      case "Dijksta":
        getRouteDijkstra(start, end, setPath)
        break;

      case 'A*':
        getRouteAstar(start, end, setPath)
        break;

      case 'Depth First Search':
        console.log("not yet implemented")
        break;

      default:
        console.log("Sorry, we are out of memory.");
    }
  }

  function LocationMarker() {
    useMapEvents({
      click(e: any) {
        console.log(e)
        if (!start) {
          getClosesPoint(e, setStart)
        } else if (!end) {
          getClosesPoint(e, setEnd)
        } else {
          getClosesPoint(e, setStart)
          setEnd(null)
          setPath(null)
        }
      }
    })
    return null
  }

  return (
    <>
      <MapContainer id='map' center={[56.0345, 12.5907]} zoom={15} scrollWheelZoom={true} className='z-10'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
        />
        <LayerGroup>
          <LocationMarker />
          {start && <Circle
            center={start}
            fillOpacity={100}
            color='green'
            radius={4}>
            <Popup>Start position</Popup>
          </Circle>}
          {end && <Circle
            center={end}
            fillOpacity={100}
            color='red'
            radius={4}>
            <Popup>End position</Popup>
          </Circle>}
          {path && <Polyline positions={path} />}
          {nodes && getRoads(data as Data)}
          {paths && getRoadsLine(data as Data)}
          <LocationMarker />
        </LayerGroup>
      </MapContainer>
      <Toaster />
      <div className='p-2 absolute top-2 right-2 z-50 flex flex-col gap-2'>
        <Dropdown selected={selected} setSelected={setSelected} algorithms={algorithms} />
        <button onClick={CalculateRoute} className='p-2 rounded-md hover:text-white hover:bg-gray-800 border-gray-800 border'>Calculate Route</button>
        <button onClick={() => { setPath(null); setEnd(null); setStart(null) }} className='p-2 rounded-md hover:text-white hover:bg-gray-800 border-gray-800 border'>Clear</button>
        <button onClick={() => { nodes ? setNodes(false) : setNodes(true) }} className='p-2 rounded-md hover:text-white hover:bg-gray-800 border-gray-800 border'>{nodes ? "Clear nodes" : "Show nodes"}</button>
        <button onClick={() => { paths ? setPaths(false) : setPaths(true) }} className='p-2 rounded-md hover:text-white hover:bg-gray-800 border-gray-800 border'>{paths ? "Clear Paths" : "Show paths"}</button>

      </div>
    </>
  );
}

export default App;
