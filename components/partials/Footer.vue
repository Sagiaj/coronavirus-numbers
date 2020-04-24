<template>
    <v-footer
    :fixed="fixed"
    app
    >
        <span>&copy; {{ new Date().getFullYear() }}</span>
        <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
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
