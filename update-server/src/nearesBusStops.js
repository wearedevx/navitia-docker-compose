const csvtojson = require('csvtojson')
const path = require('path')
const distance = require('turf-distance')

let navitiaBusStops

const calculateNearestBusStops = busStops => {
  return Promise.all(
      busStops.map(async busStop => {
        busStop.nearestBusStops = await calculateNearestBusStopsForBusStop(busStop)
        return busStop
      })
    )
}

const calculateNearestBusStopsForBusStop = async busStop => {
  const busStops = await getNavitiaBusStop()

  const neareastBusStops = busStops
    .filter(bs => {
      const d = distance(
        [parseFloat(bs.stop_lat), parseFloat(bs.stop_lon)],
        [parseFloat(busStop.stop_lat), parseFloat(busStop.stop_lon)],
        'meters'
      )
      bs.distance = d
      return d < 100
    })
    .map(bs => ({
      ...bs,
      time: parseInt(bs.distance * 0.9), // 0.9, because walking average 4km/h. so x = distance * 3600 / 4000 => distance * 0.9
    }))

  return neareastBusStops
}

const getNavitiaBusStop = async () => {
  if (!navitiaBusStops) {
    navitiaBusStops = await csvtojson().fromFile(
      path.join(__dirname, '..', 'navitia-base-data', 'stops.txt')
    )
  }

  return navitiaBusStops
}

getNavitiaBusStop()

module.exports = {
  calculateNearestBusStops
}
