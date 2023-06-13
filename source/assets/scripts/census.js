// @ts-nocheck

const startDate = "20210101"; // 开始日期
var date = new Date();
var mon = date.getMonth() + 1;
var day = date.getDate();
const endDate = date.getFullYear() + (mon < 10 ? "0" + mon : mon) + (day < 10 ? "0" + day : day); // 结束日期

// 有效期仅为一个月，需要手动刷新，/ImCaO/杂项/百度统计API.txt
const accessToken = "121.cc6891b9e3cc9bf57c03b761e4080972.YnbDtYlClGamAp1Kize3t0G2FzlnyxtzHzjQcgw.ATqLWg"; // accessToken

const siteId = "16350363"; // 网址 id
const dataUrl = "https://tongji.eurkon.com/api?access_token=" + accessToken + "&site_id=" + siteId;
const metrics = "pv_count"; // 统计访问次数 PV 填写 'pv_count'，统计访客数 UV 填写 'visitor_count'，二选一
const metricsName = metrics === "pv_count" ? "访问次数" : metrics === "visitor_count" ? "访客数" : "";
var color = document.documentElement.getAttribute("data-theme") === "light" ? "#4c4948" : "rgba(255,255,255,0.7)";
const mapParamUrl = "&start_date=" + startDate + "&end_date=" + endDate + "&metrics=" + metrics + "&method=visit/district/a";
const trendsParamUrl = "&start_date=" + startDate + "&end_date=" + endDate + "&metrics=" + metrics + "&method=trend/time/a&gran=month";

var mapChart = echarts.init(document.getElementById("mapChart"));
var mapOption = {
  title: {
    text: "",
    x: "center",
    textStyle: {
      color: color,
    },
  },
  tooltip: {
    trigger: "item",
  },
  visualMap: {
    min: 0,
    max: 0,
    left: "left",
    top: "bottom",
    text: ["高", "低"],
    color: ["#49b1f5", "#92d0f9"],
    textStyle: {
      color: color,
    },
    calculable: true,
  },
  series: [
    {
      name: metricsName,
      type: "map",
      mapType: "china",
      showLegendSymbol: false,
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: true,
          color: "#617282",
        },
      },
      itemStyle: {
        normal: {
          areaColor: "rgb(230, 232, 234)",
          borderColor: "rgb(255, 255, 255)",
          borderWidth: 1,
        },
        emphasis: {
          areaColor: "gold",
        },
      },
      data: undefined,
    },
  ],
};

var trendsChart = echarts.init(document.getElementById("trendsChart"));
var trendsOption = {
  title: {
    text: "",
    x: "center",
    textStyle: {
      color: color,
    },
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    name: "日期",
    type: "category",
    boundaryGap: false,
    nameTextStyle: {
      color: color,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      color: color,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: color,
      },
    },
    data: undefined,
  },
  yAxis: {
    name: metricsName,
    type: "value",
    nameTextStyle: {
      color: color,
    },
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      color: color,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: color,
      },
    },
  },
  series: [
    {
      name: metricsName,
      type: "line",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      itemStyle: {
        opacity: 1,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(128, 255, 165)",
          },
          {
            offset: 1,
            color: "rgba(1, 191, 236)",
          },
        ]),
      },
      areaStyle: {
        opacity: 1,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(128, 255, 165)",
          },
          {
            offset: 1,
            color: "rgba(1, 191, 236)",
          },
        ]),
      },
      data: undefined,
      markLine: {
        data: [
          {
            name: "平均值",
            type: "average",
            label: {
              color: color,
            },
          },
        ],
      },
    },
  ],
};

fetch(dataUrl + mapParamUrl)
  .then((data) => data.json())
  .then((data) => {
    let mapName = data.result.items[0];
    let mapValue = data.result.items[1];
    let mapArr = [];
    let max = mapValue[0][0];
    for (let i = 0; i < mapName.length; i++) {
      mapArr.push({ name: mapName[i][0].name, value: mapValue[i][0] });
    }
    mapOption.visualMap.max = max;
    mapOption.series[0].data = mapArr;
    mapChart.setOption(mapOption);
  });

fetch(dataUrl + trendsParamUrl)
  .then((data) => data.json())
  .then((data) => {
    const monthArr = [];
    const monthValueArr = [];
    const monthName = data.result.items[0];
    const monthValue = data.result.items[1];
    for (let i = monthName.length - 1; i >= 0; i--) {
      monthArr.push(monthName[i][0].substring(0, 7).replace("/", "-"));
      monthValueArr.push(monthValue[i][0] !== "--" ? monthValue[i][0] : 0);
    }
    trendsOption.xAxis.data = monthArr;
    trendsOption.series[0].data = monthValueArr;
    trendsChart.setOption(trendsOption);
  });

function switchVisitChart() {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute("data-theme") === "light" ? "#4c4948" : "rgba(255,255,255,0.7)";
  if (document.getElementById("mapChart")) {
    try {
      let mapOptionNew = mapOption;
      mapOptionNew.visualMap.textStyle.color = color;
      mapChart.setOption(mapOptionNew);
    } catch (error) {
      console.log(error);
    }
  }
  if (document.getElementById("trendsChart")) {
    try {
      let trendsOptionNew = trendsOption;
      trendsOptionNew.title.textStyle.color = color;
      trendsOptionNew.xAxis.nameTextStyle.color = color;
      trendsOptionNew.yAxis.nameTextStyle.color = color;
      trendsOptionNew.xAxis.axisLabel.color = color;
      trendsOptionNew.yAxis.axisLabel.color = color;
      trendsOptionNew.xAxis.axisLine.lineStyle.color = color;
      trendsOptionNew.yAxis.axisLine.lineStyle.color = color;
      trendsOptionNew.series[0].markLine.data[0].label.color = color;
      trendsChart.setOption(trendsOptionNew);
    } catch (error) {
      console.log(error);
    }
  }
}

document.onreadystatechange = function () {
  document.getElementById("darkmode").addEventListener("click", function () {
    setTimeout(switchVisitChart, 100);
  });
};

$("#mapChart").resize(function () {
  mapChart.resize();
});

$("#trendsChart").resize(function () {
  trendsChart.resize();
});
