import repository from "./repository"

const RESOURCE = "/CheckPoint?route_code=";

export default {
    async get(routeCode) {
        let res = await repository.get(RESOURCE + routeCode);
        let checkPoints = [];
        res.data["CheckPointResult"]["CheckPoint"].forEach(point => {
            checkPoints.push({
                lat: point["latitude"],
                lng: point["longitude"]
            })
        });
        return checkPoints
    }
}