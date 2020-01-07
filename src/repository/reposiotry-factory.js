import bus_stops from "./bus-stops-repository";
import service_descriptions from "./service-descriptions-repository";
import check_points from "./check-points-repository";
import pickup_points from "./pickup-points-repository";
import service_timing_at_bus_stop from "./service-timing-by-bus-stop-repository";
import active_bus from "./active-bus-repository";
import announcements from "./announcements-repository";

const repositories = {
    busStops: bus_stops,
    serviceDescriptions: service_descriptions,
    checkPoints: check_points,
    pickupPoints: pickup_points,
    serviceTimingAtBusStop: service_timing_at_bus_stop,
    activeBus: active_bus,
    announcements: announcements
};

export const RepositoryFactory = {
    get: name => repositories[name]
};