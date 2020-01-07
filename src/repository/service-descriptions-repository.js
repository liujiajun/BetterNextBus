import repository from "./repository"

// const RESOURCE = "/ServiceDescription";
const RESOURCE = "/BusInfo";

export default {
    async get() {
        let res = await repository.get(RESOURCE);
        // let routes = [];
        // res.data["ServiceDescriptionResult"]["ServiceDescription"].forEach(route => {
        //     routes.push({
        //         service_name: route["Route"],
        //         description: route["RouteDescription"],
        //         check_points: [],
        //         pickup_points: []
        //     })
        // });
        // return routes
        return res.data;
    }
}