import _data from './data.json'
import neo4j, { Driver, Session } from 'neo4j-driver';
import fs from 'fs'

export interface Data {
	features: Feature[]
}

interface Feature {
	type: string
	id: string
	properties: Property
	geometry: Geometry
}

interface Property {
	version: string
	distance: string
	name: string
	highway: string
	network: string
	oneway: string
	ref: string
	route: string
	type: string
	id: string
}

interface Geometry {
	type: string
	coordinates: number[][]
}

const data = _data as Data

const highwayNodes = [
	"primary",
	"secondary",
	"tertiary",
	"residential",
	"service",
	"unclassified"
]

interface node {
	longitude: number
	latitude: number
}

interface relation {
	to: node
	from: node
}

const distinctNodes = new Set<string>()
const relations: relation[] = []

const driver: Driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', '1234567890'));

data.features.forEach((feature) => {
	if (feature.properties.highway && highwayNodes.some(type => feature.properties.highway.includes(type))) {

		feature.geometry.coordinates.forEach(async (cords, index) => {
			if (!distinctNodes.has(`${cords[0]}${cords[1]}`)) {
				distinctNodes.add(`${cords[0]}${cords[1]}`)
				await createPoint(cords[1], cords[0])
			}
			if (index === feature.geometry.coordinates.length - 1) return
			if (feature.properties.oneway === "yes") {
				await createRelation({ from: { longitude: cords[0], latitude: cords[1] }, to: { longitude: feature.geometry.coordinates[index + 1][0], latitude: feature.geometry.coordinates[index + 1][1] } })
			} else {
				await createRelation({ from: { longitude: cords[0], latitude: cords[1] }, to: { longitude: feature.geometry.coordinates[index + 1][0], latitude: feature.geometry.coordinates[index + 1][1] } })
				await createRelation({ to: { longitude: cords[0], latitude: cords[1] }, from: { longitude: feature.geometry.coordinates[index + 1][0], latitude: feature.geometry.coordinates[index + 1][1] } })
			}
		})
	}
})



async function createPoint(latitude: number, longitude: number) {
	const session: Session = driver.session({ database: "streetmap" });
	const result = await session.run(
		'CREATE (:Point {latitude: $latitude, longitude: $longitude})',
		{ latitude: latitude, longitude: longitude }
	);
	await session.close();
	return result.summary;
}

// * does node exist
async function checkExists(latitude: number, longitude: number) {
	const session: Session = driver.session({ database: "streetmap" });
	const result = await session.run(
		'MATCH (p:Point {latitude: $latitude, longitude: $longitude}) RETURN p IS NOT NULL AS exists',
		{ latitude, longitude }
	);

	const exists = result.records[0].get('exists');
	return exists
}

async function createRelation(relation: relation) {
	const session: Session = driver.session({ database: "streetmap" });
	const result = await session.run(
		'MATCH (p1:Point {latitude: $point1.latitude, longitude: $point1.longitude}), (p2:Point {latitude: $point2.latitude, longitude: $point2.longitude}) CREATE (p1)-[r:CONNECTED_TO {distance: point.distance(point({ longitude: $point1.longitude , latitude: $point1.latitude }), point({ longitude: $point2.longitude, latitude: $point2.latitude }))}]->(p2)',
		{ point1: relation.from, point2: relation.to }
	);

	return result
}

// const relation: relation = {from : {latitude: 56.0347618, longitude: 12.6154749}, to: {latitude: 56.0355768, longitude: 12.6146629}}
// async function main(){
// }

// main()