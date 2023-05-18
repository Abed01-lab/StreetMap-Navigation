# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



## Creating graph projection for dijkstra

```
CALL gds.graph.project("route",
{Point:{properties:["latitude","longitude"]}},
{CONNECTED_TO:{properties:"distance",orientation:'UNDIRECTED'}})
```

## Creating graph projection for A start

```
CALL gds.graph.project(
    'AstarRoute',
    'Point',
    'CONNECTED_TO',
    {
        nodeProperties: ['latitude', 'longitude'],
        relationshipProperties: 'distance'
    }
)
```

## Dijkstra

```
MATCH (source:Point {latitude: $fromLatitude, longitude: $fromLongitude}), (target:Point {latitude: $toLatitude, longitude: $toLongitude})
CALL gds.shortestPath.dijkstra.stream('route', {
sourceNode: source,
targetNode: target,
relationshipWeightProperty: 'distance'
})
YIELD totalCost, path
RETURN
totalCost,
nodes(path) as path
```

## Depth First Search algo

```
MATCH (source:Point {latitude: 56.0382693, longitude: 12.5905274}), (target:Point {latitude: 56.0344608, longitude: 12.5929995})
CALL gds.dfs.stream('route', {
  sourceNode: source,
  targetNodes: target
})
YIELD path
RETURN path
```

## A star search

```
MATCH (source:Point {latitude: 56.0382693, longitude: 12.5905274}), (target:Point {latitude: 56.0344608, longitude: 12.5929995})
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
    nodes(path) as path
```
