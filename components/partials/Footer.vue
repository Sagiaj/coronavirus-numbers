<template>
    <v-footer
    :fixed="fixed"
    app
    >
        <span>&copy; {{ new Date().getFullYear() }}</span>
        <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <v-spacer />
        <span>&copy; Data from <a class="pl-2" href="https://corona.lmao.ninja/">corona.lmao.ninja/</a></span>
    </v-footer>
</template>

<script>
export default {
    name: "Footer",
    data () {
        return {
            fixed: false,
        }
    }
}
</script>
