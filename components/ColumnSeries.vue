<template>
  <div>
    <ejs-chart id="columnchartcontainer" :title='seriesTitle' :primaryXAxis='primaryXAxis' :primaryYAxis='primaryYAxis'
      :tooltip='tooltip' width="100%">
      <e-series-collection>
        <e-series :dataSource="seriesData" :type="seriesType" xName="x" yName="y"></e-series>
      </e-series-collection>
    </ejs-chart>
  </div>
</template>

<script>
import { ChartPlugin, ColumnSeries, Category } from '@syncfusion/ej2-charts'

export default {
  name: 'ColumnSeries',
  components: { ChartPlugin },
  props: ["seriesArray", "labelFormat", "xName", "yName", "seriesType", "seriesTitle"],
  data() {
    return {
      seriesData: [
        { x: 'GER', y: 172 },
        { x: 'RUS', y: 300 },
        { x: 'BRZ', y: 239 },
        { x: 'IND', y: 462 },
        { x: 'CHN', y: 621 }
      ],
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
    chart: [ColumnSeries, Category]
  }
}
</script>
