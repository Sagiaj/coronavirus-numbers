<template>
  <v-card>
    <h1 class="py-6">{{ seriesTitle }}</h1>
    <v-row justify="end">
      <v-col cols="12" sm="9" offset-sm="3">
        <v-row justify="center">
          <v-col cols="6" align="center">
            <v-autocomplete
              v-model="selectedIndicators"
              :items="indicatorChoices"
              dense
              chips
              :autofocus="false"
              small-chips
              label="Choose Stats"
              multiple
              clearable
              solo
            >
              <template v-slot:item="data">
                {{ data.item.charAt(0).toUpperCase() + data.item.slice(1).toLowerCase() }}
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-col>
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
                    :key="`${seriesTitle}-list-item-${key}`"
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
      <v-col cols="12" sm="9" align="center">
        <v-card-text>
          <ejs-chart
            style="display:block"
            align="center"
            :id="givenId"
            :title="seriesTitle"
            :primaryXAxis="primaryXAxis"
            :primaryYAxis="primaryYAxis"
            :tooltip="tooltip"
            width="100%"
          >
            <e-series-collection v-if="seriesArray && seriesArray.length > 0">
              <e-series
                v-for="(series, idx) in seriesArray"
                :key="`${seriesTitle}-series-${idx}`"
                :dataSource="series.data"
                :type="seriesType"
                :xName="series.xName"
                :yName="series.yName"
                :name="series.yName"
                width="2"
                :marker="marker"
              ></e-series>
            </e-series-collection>
            <e-series-collection v-else>
              <e-series
                :dataSource="[]"
                :type="seriesType"
                :xName="''"
                :yName="''"
                :name="''"
                width="2"
                :marker="marker"
              />
            </e-series-collection>
          </ejs-chart>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import {
  LineSeries,
  Category,
  Tooltip,
  Legend,
  ColumnSeries
} from '@syncfusion/ej2-vue-charts'

export default {
  name: 'TimeSeries',
  props: [
    'providedSeries',
    'labelFormat',
    'providedSeriesType',
    'seriesTitle',
    'givenId'
  ],
  watch: {
    graphStyleSelector(styleIdx, oldStyleIdx) {
      if (styleIdx === null) this.seriesArray = [];
      if (styleIdx === oldStyleIdx || styleIdx === undefined) return;
      this.seriesType = this.graphStyles[styleIdx].value;
    },
    selectedIndicators() {
      try {
        let arr = [];
        for (let selector of this.selectedIndicators) {
          let obj = { yName: selector };
          let xName = (Object.keys(this.providedSeries[selector].data[0]) || ["date"])[0];
          let data = this.providedSeries[selector];
          if (xName) obj["xName"] = xName;
          if (data) obj = { ...data, ...obj };
          arr.push(obj);
        }
        this.seriesArray = arr.length > 0 ? arr : [];
      } catch (err) {
        console.log("Error in selectedindicators watch:", err, this.providedSeries);
      }
    }
  },
  computed: {
    indicatorChoices() {
      if (!this.providedSeries || this.providedSeries.length < 1) return [];
      let keys = Object.keys(this.providedSeries || {});
      if (this.first == true) {
        this.selectedIndicators.push(keys[0]);
      }
      this.first = false;
      return keys || [];
    }
  },
  provide: {
    chart: [LineSeries, Category, Tooltip, Legend, ColumnSeries]
  },
  data() {
    return {
      first: true,
      seriesArray: [],
      selectedIndicators: [],
      graphStyleSelector: 1,
      seriesType: this.providedSeriesType || "Line",
      graphStyles: [
        { value: "Column", name: "Column", icon: "mdi-chart-bar" },
        { value: "Line", name: "Line", icon: "mdi-chart-line" }
      ],
      marker: {
        visible: true,
        height: 10,
        width: 10
      },
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
  }
}
</script>
