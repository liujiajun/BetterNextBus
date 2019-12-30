import repository from "./repository"

const RESOURCE = "/PickupPoint?route_code=";

export default {
    async get(routeCode) {
        let res = await repository.get(RESOURCE + routeCode);
        let pickupPoints = [];
        res.data["PickupPointResult"]["pickuppoint"].forEach(point => {
            pickupPoints.push({
                lat: point["lat"],
                lng: point["lng"],
                name: point["busstopcode"]
            })
        });
        return pickupPoints
    }
}