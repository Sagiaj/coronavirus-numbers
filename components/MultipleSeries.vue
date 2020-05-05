<template>
    <v-card>
      <v-row>
        <v-col cols="12" sm="3" align="start" align-self="center">
          <v-card flat>
            <v-card-title>
              View as
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item-group v-model="graphStyleSelector">
                  <v-list-item color="deep-orange accent-3"
                    v-for="(graphStyle, key) in graphStyles"
                    :key="key"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="graphStyle.name"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon v-text="graphStyle.icon"></v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="9" align-self="center">
          <v-row justify="center">
            <v-col cols="12"><h3>Select a property</h3></v-col>
            <v-col :align="['end', 'center', 'start'][idx%3]" v-for="(selectable, idx) in selectables" :key="`selectable-${idx}`">
              <v-btn outlined color="deep-orange accent-3" text :input-value="selected === selectable" @click.native="selected = selectable;"
              >{{ selectable }}</v-btn>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-row>
            <v-col>
              <ejs-chart :title='title' :primaryXAxis='primaryXAxis' selectionMode='Point'
                :primaryYAxis="primaryYAxis"
                :tooltip="tooltip">
                <e-series-collection v-if="selected && providedSeries">
                  <e-series
                  v-for="(serie, idx) in providedSeries"
                  :key="`series-${idx}`"
                  :dataSource='serie.data[selected].data'
                  :type='graphStyles[graphStyleSelector].value'
                  :xName="'date'"
                  :yName='selected'
                  :name='serie.country'
                  :width="'2'"
                  :marker="marker"
                  > </e-series>
                </e-series-collection>
              </ejs-chart>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
</template>
<script>
import { ColumnSeries, Category, Legend, Selection, LineSeries } from "@syncfusion/ej2-vue-charts";
import { transformLineSeriesToColumnSeries } from '../utilities/data-handlers';

export default {
  name: 'MultipleSeries',
  props: ["providedSeries", "labelFormat"],
  computed: {
    selectables() {
      if (!this.providedSeries) return [];
      const props = {};
      for (let serie of this.providedSeries) {
        const keys = Object.keys(serie.data);
        for (let key of keys) {
          props[key] = true;
        }
      }
      const propsArray = Object.keys(props);
      if (!this.selected || this.selected.length < 1) this.selected = propsArray[0] || "";
      return propsArray || [];
    }
  },
  data() {
    return {
      selected: "",
      primaryXAxis: {
        valueType: 'Category'
      },
      graphStyles: [
        { value: "Column", name: "Column", icon: "mdi-chart-bar" },
        { value: "Line", name: "Line", icon: "mdi-chart-line" }
      ],
      graphStyleSelector: 1,
      marker: { visible: true, width: 10, opacity: 0.6, height: 10 },
      title: 'Country comparison chart',
      primaryXAxis: {
        valueType: 'Category',
        labelFormat: this.labelFormat || 'y'
        // intervalType: "Years",
        // edgeLabelPlacement: "Shift"
        // majorGridLines: { width: 0 }
      },
      primaryYAxis: {
        labelFormat: this.labelFormat || '{value}'
        // rangePadding: "None",
        // minimum: 0,
        // maximum: 100,
        // interval: 20,
        // lineStyle: { width: 0 }
        // majorTickLines: { width: 0 },
        // minorTickLines: { width: 0 }
      },
      tooltip: {
        enable: true
      }
    }
  },
  provide: {
    chart: [ ColumnSeries, Category, Legend, Selection, LineSeries ]
  }
}
</script>
