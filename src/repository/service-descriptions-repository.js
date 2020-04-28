//import repository from "./repository";
import busInfo from "../data/bus-info";

//const RESOURCE = "/BusInfo";

export default {
    async get() {
        //let res = await repository.get(RESOURCE);
        //return res.data;
        return busInfo;
    }
};
