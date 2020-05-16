<template>
    <div>
        <v-app-bar app>
            <v-toolbar-title v-if="breakpoint.mdAndUp">
                <nuxt-link to="/" tag="span" style="cursor: pointer">
                    <v-icon>mdi-home</v-icon>
                </nuxt-link>
            </v-toolbar-title>
            <v-spacer v-if="breakpoint.mdAndUp"/>
            <v-toolbar-items v-if="breakpoint.mdAndUp">
                <v-btn
                text
                v-for="item in items"
                :key="item.title"
                :to="item.to">
                    <v-icon left>{{ item.icon }}</v-icon>
                    {{ item.title }}
                </v-btn>
            </v-toolbar-items>
            <v-app-bar-nav-icon v-if="!breakpoint.mdAndUp" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </v-app-bar>
        <span v-if="breakpoint.smAndDown">
            <v-navigation-drawer
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
    computed: {
        breakpoint() {
            return this.hydrated
            ? this.$vuetify.breakpoint
            : {
                lg: false,
                lgAndDown: false,
                lgAndUp: false,
                lgOnly: false,
                md: false,
                mdAndDown: false,
                mdAndUp: false,
                mdOnly: false,
                name: false,
                sm: false,
                smAndDown: false,
                smAndUp: false,
                smOnly: false,
                width: false,
                xl: false,
                xlOnly: false,
                xs: false,
                xsOnly: false
            };
        }
    },
    mounted() {
        this.hydrated = true;
    },
    data () {
        return {
            hydrated: false,
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
