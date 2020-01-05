import Vue from 'vue'
import Vuex from 'vuex'
import {RepositoryFactory} from '../repository/reposiotry-factory'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        announcements: [],
        stops: [],
        services: [],
        active_tab: 0,
        autocomplete_selected: "",
        stop_selected: "UTown",
        service_selected: "A1",
        current_location: null
    },
    mutations: {
        getAnnouncements(state, data) {
            state.announcements = data
        },
        getStops(state, data) {
            state.stops = data
        },
        sortStops(state, latLng) {
            state.stops.sort((stop1, stop2) => {
                function getDistance(lat1, lon1, lat2, lon2, unit) {
                    if ((lat1 == lat2) && (lon1 == lon2)) {
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
                        if (unit == "K") {
                            dist = dist * 1.609344
                        }
                        if (unit == "N") {
                            dist = dist * 0.8684
                        }
                        return dist;
                    }
                }

                var distance1 = getDistance(
                    Number(stop1.latitude),
                    Number(stop1.longitude),
                    latLng.latitude,
                    latLng.longitude,
                    "M"
                );

                var distance2 = getDistance(
                    Number(stop2.latitude),
                    Number(stop2.longitude),
                    latLng.latitude,
                    latLng.longitude,
                    "M"
                );

                if (distance1 > distance2) {
                    return 1
                } else if (distance1 < distance2) {
                    return -1
                } else {
                    return 0
                }
            });
        },
        getServices(state, data) {
            state.services = data
        },
        addCheckPoints(state, data) {
            state.services
                .find(x => x.service_name === data.service_name)
                .check_points = data.checkPoints
        },
        addPickupPoints(state, data) {
            state.services
                .find(x => x.service_name === data.service_name)
                .pickup_points = data.pickupPoints
        },
        setStopSelected(state, name) {
            state.stop_selected = name
        },
        setServiceSelected(state, name) {
            state.service_selected = name
        },
        setAutocompleteSelected(state, name) {
            state.autocomplete_selected = name;
        },
        setActiveTab(state, index) {
            state.active_tab = index;
        },
        setCurrentLocation(state, location) {
            state.current_location = location;
        }
    },
    actions: {
        async getAnnouncements({commit}) {
            await RepositoryFactory.get('announcements').get()
                .then(res => commit('getAnnouncements', res))
        },
        async getStops({commit}) {
            await RepositoryFactory.get('busStops').get()
                .then(res => commit('getStops', res))
        },
        async getServices({commit}) {
            await RepositoryFactory.get('serviceDescriptions').get()
                .then(res => commit('getServices', res))
        },
        async getCheckPoints({commit, state}, service_name) {
            if (state.services
                .find(x => x.service_name === service_name)
                .check_points
                .length > 0) {
                return
            }
            await RepositoryFactory.get('checkPoints').get(service_name)
                .then(res => commit('addCheckPoints', {service_name: service_name, checkPoints: res}))
        },
        async getPickupPoints({commit, state}, service_name) {
            if (state.services
                .find(x => x.service_name === service_name)
                .pickup_points
                .length > 0) {
                return
            }
            await RepositoryFactory.get('pickupPoints').get(service_name)
                .then(res => commit('addPickupPoints', {service_name: service_name, pickupPoints: res}))
        }
    },
    modules: {}
})
