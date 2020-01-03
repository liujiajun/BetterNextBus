<template>
    <h1>hi {{$store.state.stops}}</h1>
</template>

<script>
    export default {
        props: ["data"],
        name: "About"
    }
</script>

<style scoped>

</style>