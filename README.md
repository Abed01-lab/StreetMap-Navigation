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

# Provide in writing, each student individually, answers to the following questions:

### Abdelhamid
a. Advantages and disadvantages of graph databases:

Advantages:

Flexible data modeling: Graph databases are designed to handle complex relationships and hierarchical data, making it easy to represent and store data in a way that reflects real-world relationships.
Efficient querying: Graph databases excel at traversing relationships, making it easy to query for related data, even across large datasets.
Scalability: Graph databases can scale horizontally to handle large datasets and high query loads.
Agility: Graph databases are schema-less, meaning they can easily adapt to changing data models.


Disadvantages:

Not suited for all types of data: Graph databases are best suited for data with complex relationships, but not necessarily for tabular data.
Limited support for transaction processing: Unlike relational databases, graph databases do not support complex transaction processing.
Lack of standardization: Graph databases are a relatively new technology, so there is not yet a standard query language or data model.
Best and worst scenarios for using graph databases:

Best scenarios: Graph databases are ideal for use cases that involve complex, hierarchical data with lots of relationships, such as social networks, recommendation engines, fraud detection, and supply chain management.
Worst scenarios: Graph databases are not well-suited for use cases that involve simple, tabular data or that require complex transaction processing, such as accounting systems or financial trading platforms.


b. To code in SQL the Cypher statements developed for a graphalgorithms-based query, you would need to first create tables to represent nodes and edges in the graph. For example, a node table might contain columns for node ID, label, and properties, while an edge table might contain columns for source node ID, target node ID, label, and properties. You would then need to write SQL queries that use JOIN statements to traverse the graph and retrieve related data.

c. The DBMS I work with (e.g. MySQL, PostgreSQL, Oracle, etc.) organizes data storage in a variety of ways, depending on the specific database engine and configuration. In general, data is stored in tables or files, with indexes used to optimize queries. When a query is executed, the DBMS parses the SQL statement, creates an execution plan, and retrieves the necessary data from disk or memory.

d. Methods for scaling and clustering databases:

Vertical scaling: Adding more resources (CPU, memory, disk space) to a single machine to increase its capacity.
Horizontal scaling: Adding more machines to a cluster to distribute the workload and increase overall capacity.
Sharding: Partitioning data across multiple machines based on a key or hash function to improve scalability and reduce contention.
Replication: Creating multiple copies of a database across multiple machines to improve fault tolerance and read performance.

### Jonas

a. Graph databases have several advantages, including flexible data modeling, efficient querying, scalability, and agility. They are ideal for handling complex, hierarchical data with lots of relationships, such as social networks, recommendation engines, fraud detection, and supply chain management. However, they are not suited for all types of data and do not support complex transaction processing. Therefore, they may not be the best choice for use cases that involve simple, tabular data or require complex transaction processing.

b. If the same data used for a graphalgorithms-based query was stored in a relational database, you would need to create tables to represent nodes and edges in the graph. Then, you would need to write SQL queries that use JOIN statements to traverse the graph and retrieve related data.

c. The data storage and query execution in the DBMS depend on the specific database engine and configuration. Generally, data is stored in tables or files, and indexes are used to optimize queries. When executing a query, the DBMS parses the SQL statement, creates an execution plan, and retrieves the necessary data from disk or memory.

d. Scaling and clustering databases can be achieved through several methods, including vertical scaling, horizontal scaling, sharding, and replication. Vertical scaling involves adding more resources to a single machine to increase its capacity, while horizontal scaling involves adding more machines to a cluster to distribute the workload. Sharding partitions data across multiple machines based on a key or hash function, while replication creates multiple copies of a database across multiple machines for fault tolerance and improved read performance.