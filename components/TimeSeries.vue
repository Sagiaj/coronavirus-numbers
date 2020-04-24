<template>
  <ejs-chart style='display:block' align='center' id='chartcontainer' :title='seriesTitle' :primaryXAxis='primaryXAxis' :primaryYAxis='primaryYAxis'
    :tooltip='tooltip' width="100%">
    <e-series-collection v-if="seriesArray && seriesArray.length > 0">
      <e-series v-for="(series, idx) in seriesArray" :key="idx" :dataSource='series.data' :type='seriesType' :xName='xName' :yName='yName' :name='series.country' width=2 :marker='marker'> </e-series>
    </e-series-collection>    
    <e-series-collection v-else>
    </e-series-collection>
  </ejs-chart>
</template>

<script>
import { LineSeries, Category, Tooltip, Legend } from "@syncfusion/ej2-vue-charts";

export default {
  name: "TimeSeries",
  props: ["seriesArray", "xName", "yName", "seriesType", "seriesTitle"],
  provide: {
    chart: [LineSeries, Category, Tooltip, Legend]
  },
  data () {
    return {
      marker: {
        visible: true,
        height: 10,
        width: 10
      },
      primaryXAxis: {
        valueType: "Category",
        // labelFormat: "y",
        // intervalType: "Years",
        // edgeLabelPlacement: "Shift"
        // majorGridLines: { width: 0 }
      },
      primaryYAxis: {
        labelFormat: "{value}",
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
