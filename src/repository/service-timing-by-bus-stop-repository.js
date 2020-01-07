import repository from "./repository";

const RESOURCE = "/ShuttleService?busstopname=";

export default {
    async get(busStopName) {
        let res = await repository.get(RESOURCE + busStopName);
        let buses = [];
        res.data["ShuttleServiceResult"]["shuttles"].forEach(bus => {
            buses.push({
                service_name: bus["name"],
                arrival_time: bus["arrivalTime"],
                next_arrival_time: bus["nextArrivalTime"],
                show_map: false
            });
        });
        return buses;
    }
};