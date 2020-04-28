//import repository from "./repository";
import busStops from "../data/bus-stops";

//const RESOURCE = "/BusStops";

export default {
    async get() {
        //let res = await repository.get(RESOURCE);
        let res = busStops;
        let stops = [];
        res["BusStopsResult"]["busstops"].forEach(stop => {
            stops.push({
                name: stop["name"],
                caption: stop["caption"],
                short_name: stop["ShortName"],
                long_name: stop["LongName"],
                search_field: stop["ShortName"] + stop["LongName"],
                latitude: stop["latitude"],
                longitude: stop["longitude"]
            });
        });
        return stops;
    }
};
