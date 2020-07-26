import Vue from "vue";
import Vuex from "vuex";
import {RepositoryFactory} from "../repository/reposiotry-factory";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        announcements: [],
        stops: [],
        stops_by_distance: [],
        services: [],
        active_tab: 0,
        autocomplete_selected: "",
        stop_selected: "UTown",
        service_selected: "AA1",
        current_location: null,
        favorites: [],
        enable_analytics: true,
        enable_dark: 'false',
        time_and_frequency: [],
        error: false,
        error_message: null
    },
    mutations: {
        getAnnouncements(state, data) {
            state.announcements = data;
        },
        getStops(state, data) {
            state.stops = data;
            state.stops_by_distance = data;
        },
        sortStops(state, latLng) {
            state.stops.sort((stop1, stop2) => {
                function getDistance(lat1, lon1, lat2, lon2, unit) {
                    if ((lat1 === lat2) && (lon1 === lon2)) {
                        return 0;
                    } else {
                        var radlat1 = Math.PI * lat1 / 180;
                        var radlat2 = Math.PI * lat2 / 180;
                        var theta = lon1 - lon2;
                        var radtheta = Math.PI * theta / 180;
                        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                        if (dist > 1) {
                            dist = 1;
                        }
                        dist = Math.acos(dist);
                        dist = dist * 180 / Math.PI;
                        dist = dist * 60 * 1.1515;
                        if (unit === "K") {
                            dist = dist * 1.609344;
                        }
                        if (unit === "N") {
                            dist = dist * 0.8684;
                        }
                        return dist;
                    }
                }

                let distance1, distance2;
                if (latLng === null) {
                    distance1 = 0;
                    distance2 = 0;
                } else {
                    distance1 = getDistance(Number(stop1.latitude), Number(stop1.longitude), latLng.latitude, latLng.longitude, "M");
                    distance2 = getDistance(Number(stop2.latitude), Number(stop2.longitude), latLng.latitude, latLng.longitude, "M");
                }

                if (distance1 < distance2) {
                    return -1;
                } else if (distance1 > distance2) {
                    return 1;
                } else {
                    return stop1.name.localeCompare(stop2.name);
                }
            });
        },
        sortStopsFavoriteFirst(state) {
            state.stops.sort((stop1, stop2) => {
                if (state.favorites.includes(stop1.name) && !state.favorites.includes(stop2.name)) {
                    return -1;
                } else if (!state.favorites.includes(stop1.name) && state.favorites.includes(stop2.name)) {
                    return 1;
                } else {
                    return 0;
                }
            });
        },
        getServices(state, data) {
            state.services = data;
        },
        getTimeAndFrequency(state, data) {
            state.time_and_frequency = data;
        },
        addCheckPoints(state, data) {
            state.services
                .find(x => x.service_name === data.service_name)
                .check_points = data.checkPoints;
        },
        addPickupPoints(state, data) {
            state.services
                .find(x => x.service_name === data.service_name)
                .pickup_points = data.pickupPoints;
        },
        setStopSelected(state, name) {
            state.stop_selected = name;
        },
        setServiceSelected(state, name) {
            state.service_selected = name;
        },
        setAutocompleteSelected(state, name) {
            state.autocomplete_selected = name;
        },
        setActiveTab(state, index) {
            state.active_tab = index;
        },
        setCurrentLocation(state, location) {
            state.current_location = location;
        },
        toggleFavorite(state, name) {
            if (localStorage.getItem("favorites") === null) {
                localStorage.setItem("favorites", JSON.stringify(state.favorites));
            } else {
                state.favorites = JSON.parse(localStorage.getItem("favorites"));
            }

            if (name === "") return;
            let index = state.favorites.indexOf(name);
            if (index !== -1) {
                state.favorites.splice(index, 1);
            } else {
                state.favorites.push(name);
            }
            localStorage.setItem("favorites", JSON.stringify(state.favorites));
        },
        updateFavorites(state, newFavorites) {
            state.favorites = newFavorites;
            localStorage.setItem("favorites", JSON.stringify(state.favorites));
        },
        initializeSettings(state) {
            if (localStorage.getItem("analytics") === null) {
                localStorage.setItem("analytics", JSON.stringify(state.enable_analytics));
            } else {
                state.enable_analytics = JSON.parse(localStorage.getItem("analytics"));
            }
            if (localStorage.getItem("dark") === null) {
                localStorage.setItem("dark", state.enable_dark);
            } else {
                state.enable_dark = localStorage.getItem("dark");
            }
        },
        enableAnalytics(state, enable) {
            localStorage.setItem("analytics", enable);
            state.enable_analytics = enable;
        },
        enableDark(state, enable) {
            localStorage.setItem("dark", enable);
            state.enable_dark = enable;
        },
        toggleError(state, isError) {
            state.error = isError;
        },
        setErrorMessage(state, message) {
            state.error_message = message;
        }
    },
    actions: {
        async getAnnouncements({commit}) {
            await RepositoryFactory.get("announcements").get()
                .then(res => commit("getAnnouncements", res));
        },
        async getStops({commit}) {
            await RepositoryFactory.get("busStops").get()
                .then(res => commit("getStops", res));
        },
        async getServices({commit}) {
            await RepositoryFactory.get("serviceDescriptions").get()
                .then(res => commit("getServices", res));
        },
        async getCheckPoints({commit, state}, service_name) {
            if (state.services
                .find(x => x.service_name === service_name)
                .check_points
                .length > 0) {
                return;
            }
            await RepositoryFactory.get("checkPoints").get(service_name)
                .then(res => commit("addCheckPoints", {service_name: service_name, checkPoints: res}));
        },
        async getPickupPoints({commit, state}, service_name) {
            if (state.services
                .find(x => x.service_name === service_name)
                .pickup_points
                .length > 0) {
                return;
            }
            await RepositoryFactory.get("pickupPoints").get(service_name)
                .then(res => commit("addPickupPoints", {service_name: service_name, pickupPoints: res}));
        }
    },
    modules: {}
});
