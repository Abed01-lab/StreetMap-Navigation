import { Circle, Polyline, Popup } from "react-leaflet"
import { Data } from "./cleanData"
import React from "react"

export function getSurfaceAsphalt(features: any) {
	const nodes = [] as any
	const filtered = features.filter((feature: any) => feature.id.includes("way") && feature.properties.surface === "asphalt")
	filtered.forEach((feature: any) => {
		feature.geometry.coordinates.forEach((pos: any) => nodes.push(pos))
	})

	const flatten = nodes.flat()

	const nodesToDisplay = []

	for (let index = 0; index < flatten.length; index++) {

		if (!flatten[index][1] || !flatten[index][0]) {
			continue
		}
		nodesToDisplay.push(
			<Circle
				center={[flatten[index][1], flatten[index][0]]}
				fillOpacity={100}
				color='green'
				radius={1}
			/>
		)
	}

	return nodesToDisplay
}

export function getRoads(data: Data) {

	const highwayNodes = [
		"primary",
		"secondary",
		"tertiary",
		"residential",
		"service",
		"unclassified",
	]

	const roads: JSX.Element[] = []

	data.features.forEach((feature) => {
		if (feature.properties.highway && highwayNodes.some(type => feature.properties.highway.includes(type))) {
			feature.geometry.coordinates.forEach((cords) => {
				roads.push(<Circle
					center={[cords[1], cords[0]]}
					fillOpacity={100}
					color='grey'
					radius={0.5}
				><Popup>{JSON.stringify(cords)}</Popup></Circle>)
			})
		}
	})
	return roads
}

export function getAddresses(features: any) {
	const points: JSX.Element[] = []
	features.forEach((feature: any) => {
		if (feature.geometry.type === "Point") {
			points.push(<Circle
				center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
				fillOpacity={100}
				color='grey'
				radius={1}
			><Popup>{JSON.stringify(feature.properties)}</Popup></Circle>)
		}
	})
	return points
}

export function getRoadsLine(data: Data) {
	const highwayNodes = [
		"primary",
		"secondary",
		"tertiary",
		"residential",
		"service",
		"unclassified"
	]

	const roads: JSX.Element[] = []

	data.features.forEach((feature) => {
		if (feature.properties.highway && highwayNodes.some(type => feature.properties.highway.includes(type))) {

			roads.push(
				<Polyline pathOptions={{ color: "red" }} positions={feature.geometry.coordinates.map((cords) => [cords[1], cords[0]])} />)
		}
	})
	return roads
}

export function getRoadsOneWay(data: Data) {

	const highwayNodes = [
		"primary",
		"secondary",
		"tertiary",
		"residential",
		"service",
		"unclassified"
	]

	const roads: JSX.Element[] = []

	data.features.forEach((feature) => {
		if (feature.properties.highway && highwayNodes.some(type => feature.properties.highway.includes(type)) && feature.properties.oneway === "yes") {
			feature.geometry.coordinates.forEach((cords, index) => {
				roads.push(<Circle
					center={[cords[1], cords[0]]}
					fillOpacity={100}
					color={index === 0 ? "red" : index === feature.geometry.coordinates.length - 1 ? "green" : "grey"}
					radius={0.5}
				/>)
			})
		}
	})
	return roads
}