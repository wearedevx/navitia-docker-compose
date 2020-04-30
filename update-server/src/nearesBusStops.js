const csvtojson = require("csvtojson")
const path = require("path")
const distance = require("turf-distance")

let navitiaBusStops

const calculateNearestBusStops = async (
  busStops,
  includeNavitiaBusStops = false
) => {
  let allBusStops = [...busStops]

  if (includeNavitiaBusStops) {
    console.log("Include Navitia Bus Stops")
    const navitiaBusStops = await getNavitiaBusStop()
    allBusStops = [...allBusStops, ...navitiaBusStops]
  }

  return Promise.all(
    busStops.map(async (busStop) => {
        busStop.nearestBusStops = calculateNearestBusStopsForBusStop(
          busStop,
          allBusStops
        )

      return busStop
    })
  )
}

const calculateNearestBusStopsForBusStop = (busStop, busStops) => {
  const neareastBusStops = busStops
    .filter((bs) => {
      if (bs.stop_id !== busStop.stop_id) {

        const d = distance(
          [parseFloat(bs.stop_lat), parseFloat(bs.stop_lon)],
          [parseFloat(busStop.stop_lat), parseFloat(busStop.stop_lon)],
          "meters"
        )
        bs.distance = d
        return d < 460
      }

      return false
    })
    .map((bs) => ({
      ...bs,
      time: parseInt(bs.distance * 0.9), // 0.9, because walking average 4km/h. so x = distance * 3600 / 4000 => distance * 0.9
    }))

  return neareastBusStops
}

const getNavitiaBusStop = async () => {
  if (!navitiaBusStops) {
    navitiaBusStops = await csvtojson().fromFile(
      path.join(__dirname, "..", "navitia-base-data", "stops.txt")
    )
  }

  return navitiaBusStops
}

// getNavitiaBusStop()

module.exports = {
  calculateNearestBusStops,
}
