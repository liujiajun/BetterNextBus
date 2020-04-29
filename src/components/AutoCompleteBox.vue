<template>
    <div class="flex">
        <v-autocomplete
                :items="items"
                auto-select-first
                chips
                class="mx-4"
                flat
                hide-details
                hide-selected
                item-text="search_field"
                item-value="name"
                label="Enter bus stop or service"
                ref="ac"
                solo-inverted
                v-model="$store.state.autocomplete_selected"
                v-on:input="onSelectItem"
        >

            <template v-slot:no-data>
                <v-list-item>
                    <v-list-item-title>
                        Search for a <strong>Bus stop</strong> or <strong>Bus service</strong>
                    </v-list-item-title>
                </v-list-item>
            </template>

            <template v-slot:selection="{ attr, item, selected }">
                <v-chip
                        :input-value="selected"
                        @click:close="$store.commit('setAutocompleteSelected', '')"
                        class="white--text"
                        close
                        :color="$vuetify.theme.dark ? 'grey darken-1' : 'blue-grey'"
                        v-bind="attr"
                >
                    <v-icon left>{{item.type === "stop" ? "mdi-bus-stop" : "mdi-bus"}}</v-icon>
                    <span v-text="item.type === 'stop' ? item.sub_title : item.title"/>
                </v-chip>
            </template>

            <template v-slot:item="{ item }">
                <v-list-item-avatar
                        class="headline font-weight-light white--text"
                        color="indigo"
                        v-if="item.type==='stop'"
                >
                    {{ item.title.charAt(0) }}
                </v-list-item-avatar>
                <v-list-item-avatar
                        class="font-weight-light white--text"
                        color="orange"
                        v-if="item.type==='service'"
                >
                    {{ item.name.length > 4 ? item.name.charAt(0) : item.name }}
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title v-text="item.title"/>
                    <v-list-item-subtitle v-text="item.sub_title"/>
                </v-list-item-content>
                <v-list-item-action>
                    <v-icon
                            color="red lighten-1"
                            v-if="$store.state.favorites.includes(item.name)"
                    >
                        mdi-heart
                    </v-icon>
                    <v-icon v-else-if="item.type==='stop'">
                        mdi-bus-stop
                    </v-icon>
                    <v-icon v-else>
                        mdi-bus
                    </v-icon>
                </v-list-item-action>
            </template>
        </v-autocomplete>
    </div>
</template>

<script>
    export default {
        name: "auto-complete-box",
        methods: {
            onSelectItem() {
                this.$refs.ac.blur();
                let found = this.items
                    .find(x => x.name === this.$store.state.autocomplete_selected);
                if (found.type === "stop") {
                    this.$router.push({
                        name: "bus-list",
                        params: {bus_stop_name: this.$store.state.autocomplete_selected}
                    })
                        .catch(e => console.log(e));
                } else {
                    this.$router.push({
                        name: "service-card",
                        params: {service_name: this.$store.state.autocomplete_selected}
                    })
                        .catch(e => console.log(e));
                }
            }
        },
        computed: {
            items: function () {
                let res = [];
                for (const stop of this.$store.state.stops) {
                    res.push({
                        type: "stop",
                        search_field: stop.search_field,
                        name: stop.name,
                        title: stop.long_name,
                        sub_title: stop.short_name
                    });
                }

                for (const service of this.$store.state.services) {
                    res.push({
                        type: "service",
                        search_field: service.service_name + service.description,
                        name: service.service_name,
                        title: service.service_name,
                        sub_title: service.description
                    });
                }

                return res;
            }
        }
    };
</script>

<style scoped>

</style>
