import repository from "./repository";

const RESOURCE = "/ActiveBus?token=8UVANBHAKJNK&route_code=";

export default {
    async get(routeCode) {
        let res = await repository.get(RESOURCE + routeCode);
        return res.data["ActiveBusResult"]["activebus"];
    }
};