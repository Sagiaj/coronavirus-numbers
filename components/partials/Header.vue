<template>
    <div>
        <span>
            <v-app-bar app>
                <span v-if="$vuetify.breakpoint.mdAndUp">
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
                        <v-icon left>{{ item.icon }}</v-icon>
                        {{ item.title }}
                        </v-btn>
                    </v-toolbar-items>
                </span>
                <span v-else>
                    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                </span>
            </v-app-bar>
        </span>
        <span v-if="$vuetify.breakpoint.smAndDown">
            <v-navigation-drawer app
            v-model="drawer"
            absolute
            left
            temporary>
                <v-system-bar></v-system-bar>
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-img src="/virus.svg"></v-img>
                        </v-list-item-avatar>
                        <h2>Routes</h2>
                    </v-list-item>

                    <v-list-item link>
                        <v-list-item-content>
                            <v-list-item-title class="title">COVID-19 Numbers</v-list-item-title>
                            <v-list-item-subtitle>Varied statistics on coronavirus</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list nav dense>
                    <v-list-item v-for="item in items" :key="item.title" :to="item.to">
                        <v-icon>{{ item.icon }}</v-icon>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        </span>
    </div>
</template>

<script>
export default {
    name: "Header",
    watch: {
        group () {
            this.drawer = false
        }
    },
    data () {
        return {
            drawer: false,
            group: null,
            items: [
                {
                    icon: 'mdi-chart-bubble',
                    title: 'Corona numbers',
                    to: '/'
                },
                {
                    icon: 'mdi-chart-bubble',
                    title: 'Compare Countries',
                    to: '/compare-countries'
                },
                {
                    icon: 'mdi-chart-bubble',
                    title: 'Worldwide Statistics',
                    to: '/worldwide-statistics'
                }
            ]
        }
    }
}
</script>
