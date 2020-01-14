import repository from "./repository";

const RESOURCE = "/PickupPoint?route_code=";
const CORRECTION = [
    {original: "PGPE", new: "PGP"},
    {original: "PGPEN", new: "PGP"},
    {original: "PGPEND", new: "PGP"},
    {original: "KTR-E", new: "KR-BT"},
    {original: "KTR-EN", new: "KR-BT"},
    {original: "KR-BTE", new: "KR-BT"},
    {original: "innovation 4.0(R)", new: "innovation 4.0"},
];

export default {
    async get(routeCode) {
        let res = await repository.get(RESOURCE + routeCode);
        let pickupPoints = [];
        res.data["PickupPointResult"]["pickuppoint"].forEach(point => {
            let correctedName;
            let found = CORRECTION.find(x => x.original === point["busstopcode"]);
            if (found !== undefined) {
                correctedName = found.new;
            } else {
                correctedName = point["busstopcode"];
            }
            pickupPoints.push({
                lat: point["lat"],
                lng: point["lng"],
                name: correctedName
            });
        });
        return pickupPoints;
    }
};