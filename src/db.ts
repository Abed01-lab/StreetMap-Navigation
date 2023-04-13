import toast from 'react-hot-toast';
import neo4j, { Driver, Session } from 'neo4j-driver';


export function getClosesPoint(e: any, setAction: any) {
	const driver: Driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', '1234567890'));
	const session: Session = driver.session({ database: "streetmap" });
	session.run(
		'MATCH (p:Point) RETURN p ORDER BY point.distance(point({ longitude: $longitude , latitude: $latitude }), point({ longitude: p.longitude, latitude: p.latitude })) ASC LIMIT 1',
		{ latitude: e.latlng.lat, longitude: e.latlng.lng }
	)
		.then(result => {
			const { latitude, longitude } = result.records[0]["_fields"][0]["properties"];
			setAction({ lat: latitude, lng: longitude })
		})
		.finally(() => {
			session.close();

		}).catch(e => console.log(e))
}



export function getRouteDijkstra(start: any, end: any, setPath: any) {

	if (!start) {
		toast.error("Please choose your start destination")
		return
	}

	if (!end) {
		toast.error("Please choose your end destination")
		return
	}

	const driver: Driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', '1234567890'));
	const session: Session = driver.session({ database: "streetmap" });
	session.run(
		`MATCH (source:Point {latitude: $fromLatitude, longitude: $fromLongitude}), (target:Point {latitude: $toLatitude, longitude: $toLongitude})
		CALL gds.shortestPath.dijkstra.stream('route', {
		sourceNode: source,
		targetNode: target,
		relationshipWeightProperty: 'distance'
		})
		YIELD totalCost, path
		RETURN
		totalCost,
		nodes(path) as path`,
		{ fromLatitude: start.lat, fromLongitude: start.lng, toLatitude: end.lat, toLongitude: end.lng }
	)
		.then(result => {
			setPath(result.records[0]["_fields"][1].map((node: any) => [node.properties.latitude, node.properties.longitude]))
		})
		.finally(() => {
			session.close();

		}).catch(e => console.log(e))
}

export function getRouteAstar(start: any, end: any, setPath: any) {

	if (!start) {
		toast.error("Please choose your start destination")
		return
	}

	if (!end) {
		toast.error("Please choose your end destination")
		return
	}

	const driver: Driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', '1234567890'));
	const session: Session = driver.session({ database: "streetmap" });
	session.run(
		`MATCH (source:Point {latitude: $fromLatitude, longitude: $fromLongitude}), (target:Point {latitude: $toLatitude, longitude: $toLongitude})
		CALL gds.shortestPath.astar.stream('AstarRoute', {
			sourceNode: source,
			targetNode: target,
			latitudeProperty: 'latitude',
			longitudeProperty: 'longitude',
			relationshipWeightProperty: 'distance'
		})
		YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs, path
		RETURN
			totalCost,
			nodes(path) as path`,
		{ fromLatitude: start.lat, fromLongitude: start.lng, toLatitude: end.lat, toLongitude: end.lng }
	)
		.then(result => {
			console.log(result)
			console.log(result.records[0]["_fields"][1].map((node: any) => [node.properties.latitude, node.properties.longitude]))
			setPath(result.records[0]["_fields"][1].map((node: any) => [node.properties.latitude, node.properties.longitude]))
		})
		.finally(() => {
			session.close();

		}).catch(e => console.log(e))
}

