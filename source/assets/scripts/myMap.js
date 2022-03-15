// @ts-nocheck

var myChart = echarts.init(document.getElementById("myMap"));

var data = [
  { name: "北京", value: [116.403963, 39.915119] },
  { name: "上海", value: [121.480248, 31.236276] },
  { name: "南京", value: [118.803129, 32.065761] },
  { name: "杭州", value: [120.216481, 30.251863] },
  { name: "宁波", value: [121.630925, 29.866002] },
  { name: "嘉兴", value: [120.686889, 30.516913] },
  { name: "湖州", value: [120.093415, 30.900146] },
  { name: "绍兴", value: [120.590041, 30.057623] },
  { name: "舟山", value: [122.213931, 29.991275] },
  { name: "丽水", value: [119.92989, 28.473478] },
  { name: "厦门", value: [118.073467, 24.450968] },
  { name: "景德镇", value: [117.190881, 29.281629] },
  { name: "丽江", value: [100.242047, 26.876464] },
  { name: "重庆", value: [106.556901, 29.570045] },
  { name: "无锡", value: [120.318628, 31.497438] },
  { name: "苏州", value: [120.591682, 31.305976] },
  { name: "赤峰", value: [117.241878, 42.531783] },
  { name: "西安", value: [108.946166, 34.349382] },
  { name: "延安", value: [110.47329, 36.077286] },
  { name: "兰州", value: [103.840755, 36.066746] },
  { name: "酒泉", value: [94.685194, 40.094898] },
  { name: "嘉峪关", value: [98.226473, 39.806466] },
  { name: "", value: [] },
  { name: "", value: [] },
  { name: "", value: [] },
  { name: "", value: [] },
  { name: "", value: [] },
  { name: "", value: [] },
];

option = {
  // backgroundColor: '#404a59',
  title: {},
  tooltip: {
    trigger: "item",
    padding: 10,
    backgroundColor: "#222",
    borderColor: "#777",
    borderWidth: 1,
    textStyle: {
      color: "#fff",
      fontSize: 16,
    },
    formatter: function (params) {
      name = params.name;
      return '<div style="font-size: 16px; color: white;">' + name + "</div>";
    },
  },
  geo: {
    map: "china",
    label: {
      emphasis: {
        show: false,
      },
    },
    roam: false,
    itemStyle: {
      normal: {
        areaColor: "#ACDAF9",
        borderColor: "#111",
      },
      emphasis: {
        areaColor: "#49b1f5",
      },
    },
  },
  series: [
    {
      name: "足迹",
      type: "scatter",
      symbolSize: 8,
      coordinateSystem: "geo",
      data: data,
      showEffectOn: "render",
      rippleEffect: {
        brushType: "stroke",
      },
      hoverAnimation: true,
      label: {
        normal: {
          formatter: "{b}",
          position: "right",
          show: false,
        },
      },
      itemStyle: {
        normal: {
          color: "#FF6C57",
          shadowBlur: 10,
          shadowColor: "#ACDAF9",
        },
      },
      zlevel: 1,
    },
  ],
};

myChart.setOption(option);

$(".map").resize(function () {
  myChart.resize();
});
