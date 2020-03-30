const express = require("express");
const PORT = process.env.PORT || 5003;

const app = express();
var { transit_realtime: GtfsRt } = require("gtfs-realtime-bindings");

app.get("/updates.pb", (req, res) => {
  console.log("GET /updates.pb");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const feed = GtfsRt.FeedMessage.fromObject({
    header: {
      gtfsRealtimeVersion: "2.0",
      incrementality: GtfsRt.FeedHeader.Incrementality.FULL_DATASET,
      timestamp: +new Date()
    },
    entity: [
      {
        id: "TestEntity-1",
        isDeleted: false,
        tripUpdate: {
          trip: {
            tripId: "OQA:PAT:VehicleJourney:0410_20190701_1-1",
            routeId: "OQA:PAT:Line:0805_20170701",
            directionId: "forward",
            startTime: yesterday.toISOString(),
            endTime: tomorrow.toISOString()
          },
          stopTimeUpdate: [
            {
              stopId: "OQA:SP:NAQ:Quay:30943",
              stopSequence: 2,
              arrival: {
                delay: 6
              },
              departure: {
                delay: 6
              }
            }
          ],
          delay: 6
        }
      }
    ]
  });

  const binary = GtfsRt.FeedMessage.encode(feed).finish();

  res
    .status(200)
    .set("Content-Type", "application/x-protobuf")
    .send(binary);
});

app.listen(PORT, () => {
  console.log("Disruption Provider listening on", PORT);
});
