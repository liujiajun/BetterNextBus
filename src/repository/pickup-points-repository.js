import repository from "./repository"

const RESOURCE = "/PickupPoint?route_code=";
// const CORRECTION = [
//     { original: 'PGPE', new: 'PGP'},
//     { original: 'PGPEN', new: ''},
//     { original: 'PGPEND', new: ''},
//     { original: 'KTR-E', new: ''},
//     { original: 'KTR-EN', new: ''},
//     { original: 'KR-BTE', new: ''},
//     { original: 'innovation 4.0(R)', new: 'innovation 4.0'},
// ];
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