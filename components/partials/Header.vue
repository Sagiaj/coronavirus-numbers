<template>
    <span>
        <v-app-bar app>
            <v-toolbar-title>
                <nuxt-link to="/" tag="span" style="cursor: pointer">
                <v-icon>mdi-home</v-icon>
                </nuxt-link>
            </v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
                <v-btn
                text
                v-for="item in items"
                :key="item.title"
                :to="item.to">
                <v-icon left dark>{{ item.icon }}</v-icon>
                {{ item.title }}
                </v-btn>
            </v-toolbar-items>
        </v-app-bar>
    </span>
</template>

<script>
export default {
    name: "Header",
    data () {
        return {
            items: [
                {
                    icon: 'mdi-chart-bubble',
                    title: 'Corona numbers',
                    to: '/'
                },
                {
                    icon: 'mdi-chart-bubble',
                    title: 'Compare countries',
                    to: '/compare-countries'
                }
            ]
        }
    }
}
</script>
