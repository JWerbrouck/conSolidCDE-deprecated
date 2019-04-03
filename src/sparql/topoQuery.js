import { newEngine } from '@comunica/actor-init-sparql'

const myEngine = newEngine();

var addedBuildings = []
var addedStoreys = []

function waitFor(obj, prop, timeout, expected) {
    if (!obj) return Promise.reject(new TypeError("waitFor expects an object"));
    if (!expected) expected = Boolean;
    var value = obj[prop];
    if (expected(value)) return Promise.resolve(value);
    return new Promise(function (resolve, reject) {
        if (timeout)
            timeout = setTimeout(function () {
                Object.defineProperty(obj, prop, { value: value, writable: true });
                reject(new Error("waitFor timed out"));
            }, timeout);
        Object.defineProperty(obj, prop, {
            enumerable: true,
            configurable: true,
            get: function () { return value; },
            set: function (v) {
                if (expected(v)) {
                    if (timeout) clearTimeout(timeout);
                    Object.defineProperty(obj, prop, { value: v, writable: true });
                    resolve(v);
                } else {
                    value = v;
                }
            }
        });
    });
}

//convert results to BOT tree
function topoData(one, res) {
    one = one.toObject()
    let project = one["?project"].value
    let site = one["?site"].value
    let building = one["?building"].value
    let storey = one["?storey"].value
    let space = one["?space"].value

    let shortProject = project.split("#")
    shortProject = shortProject[shortProject.length-1]

    let shortSite = site.split("#")
    shortSite = shortSite[shortSite.length-1]

    let shortBuilding = building.split("#")
    shortBuilding = shortBuilding[shortBuilding.length-1]

    let shortStorey = storey.split("#")
    shortStorey = shortStorey[shortStorey.length-1]

    let shortSpace = space.split("#")
    shortSpace = shortSpace[shortSpace.length-1]

    res['project'] = {'shortUri': shortProject, 'uri': project, 'newUri': project}
    res['site'] = {'shortUri': shortSite, 'uri': site, 'newUri': site}

    if (!addedBuildings.includes(building)) {
        res['hasBuilding'].push({'shortUri': shortBuilding, 'uri': building, 'newUri': building, 'hasStorey':[]});
        addedBuildings.push(building)
    }

    if (!addedStoreys.includes(storey)) {
        res['hasBuilding'].forEach(function (item) {
            if (item['uri'] === building) {
                item['hasStorey'].push({'shortUri': shortStorey, 'uri': storey, 'newUri': storey, 'hasSpace':[]})
            }
        });
        addedStoreys.push(storey)
    }

    res['hasBuilding'].forEach(function (item) {
        if (item['uri'] === building) {
            item['hasStorey'].forEach(function (st) {
                if (st['uri'] === storey) {
                    st['hasSpace'].push({'shortUri': shortSpace, 'uri': space, 'newUri': space})
                }
            });
        }
    })
}

function testData(one, res) {
    one = one.toObject()
    console.log(one);
    res['object'] = one
}

//query for the building topology
export default function queryTopology(endpoint) {
    console.log('endpoint', endpoint)
    const context = {sources: [{ type: 'file', value: endpoint }],};
    let streamstatus = { done: false }
    let topology = {}
    topology.hasBuilding = []
    // return myEngine.query(`
    // SELECT  ?s ?p ?o
    // WHERE {
    // ?s ?p ?o
    // }
    // `, context)
    //     .then(function (result) {
    //         result.bindingsStream.on('data', (maprow) => testData(maprow, topology))
    //         result.bindingsStream.on('end', (done) => {
    //             streamstatus["done"] = true
    //         })
    //     })
    //     .then(async function () {
    //         await waitFor(streamstatus, "done", 5000)
    //         console.log(JSON.stringify(topology))
    //         return topology
    //     })
    return myEngine.query(`
    PREFIX bot: <https://w3id.org/bot#>
    PREFIX stg: <https://raw.githubusercontent.com/JWerbrouck/Thesis/master/stg.ttl#>
    SELECT  ?project ?site ?building ?storey ?space
    WHERE {
    ?project stg:hasSite ?site.
    ?site bot:hasBuilding ?building.
    ?storey bot:hasSpace ?space.
    ?building bot:hasStorey ?storey.
    }
    `, context)
        .then(function (result) {
            result.bindingsStream.on('data', (maprow) => topoData(maprow, topology))
            result.bindingsStream.on('end', (done) => {
                streamstatus["done"] = true
            })
        })
        .then(async function () {
            await waitFor(streamstatus, "done", 5000)
            // console.log(JSON.stringify(topology))
            return topology
        })
}

