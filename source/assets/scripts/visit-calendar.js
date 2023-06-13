// @ts-nocheck

var visit_calendar = (site_id, access_token, metrics, visit_color) => {
  var date = new Date();
  var end_date = "" + date.getFullYear() + (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
  date.setFullYear(date.getFullYear() - 1);
  date.setTime(date.getTime() - 24 * 3600 * 1000 * date.getDay());
  var start_date = "" + date.getFullYear() + (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
  var visit_apiurl =
    "https://tongji.eurkon.com/api?site_id=" +
    site_id +
    "&access_token=" +
    access_token +
    "&method=overview/getTimeTrendRpt" +
    "&metrics=" +
    metrics +
    "&start_date=" +
    start_date +
    "&end_date=" +
    end_date;
  var visit_month = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  var visit_monthchange = [];
  var visit_oneyearbeforeday = "";
  var visit_thisday = "";
  var visit_amonthago = "";
  var visit_aweekago = "";
  var visit_weekdatacore = 0;
  var visit_total = 0;
  var visit_positionplusdata = [];
  var visit_firstweek = [];
  var visit_lastweek = [];
  var visit_beforeweek = [];
  var visit_thisweekdatacore = 0;
  var visit_thisdayindex = 0;
  var visit_firstdate = [];
  var visit_first2date = [];
  var visit_montharrbefore = [];
  var visit_monthindex = 0;
  var retinaCanvas = (canvas, context, ratio) => {
    if (ratio > 1) {
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      canvas.width = canvasWidth * ratio;
      canvas.height = canvasHeight * ratio;
      canvas.style.width = "100%";
      canvas.style.height = canvasHeight + "px";
      context.scale(ratio, ratio);
    }
  };

  function responsiveChart() {
    var ratio = window.devicePixelRatio || 1;
    if (document.getElementById("visitcanvas")) {
      var c = document.getElementById("visitcanvas");
      c.style.width = "100%";
      c.style.height = "";
      var ctx = c.getContext("2d");
      width = c.width = document.getElementById("visitcalendarcanvasbox").offsetWidth;
      height = c.height = (9 * 0.96 * c.width) / visit_data.length;
      retinaCanvas(c, ctx, ratio);
      var linemaxwitdh = height / 9;
      var lineminwitdh = 0.8 * linemaxwitdh;
      var setposition = { x: 0.02 * width, y: 0.025 * width };
      for (var week in visit_data) {
        weekdata = visit_data[week];
        for (var day in weekdata) {
          var dataitem = { date: "", count: "", x: 0, y: 0 };
          visit_positionplusdata.push(dataitem);
          setposition.y = Math.round(setposition.y * 100) / 100;
          dataitem.date = weekdata[day].date;
          dataitem.count = weekdata[day].count;
          dataitem.x = setposition.x;
          dataitem.y = setposition.y;
          ctx.fillRect(setposition.x, setposition.y, lineminwitdh, lineminwitdh);
          setposition.y = setposition.y + linemaxwitdh;
        }
        setposition.y = 0.025 * width;
        setposition.x = setposition.x + linemaxwitdh;
      }
    }
  }

  function addlastmonth() {
    if (visit_thisdayindex === 0) {
      thisweekcore(52);
      thisweekcore(51);
      thisweekcore(50);
      thisweekcore(49);
      thisweekcore(48);
      visit_thisweekdatacore += visit_firstdate[6].count;
      visit_amonthago = visit_firstdate[6].date;
    } else {
      thisweekcore(52);
      thisweekcore(51);
      thisweekcore(50);
      thisweekcore(49);
      thisweek2core();
      visit_amonthago = visit_first2date[visit_thisdayindex - 1].date;
    }
  }

  function thisweek2core() {
    for (var i = visit_thisdayindex - 1; i < visit_first2date.length; i++) {
      visit_thisweekdatacore += visit_first2date[i].count;
    }
  }

  function thisweekcore(index) {
    for (var item of visit_data[index]) {
      visit_thisweekdatacore += item.count;
    }
  }

  function addlastweek() {
    for (var item of visit_lastweek) {
      visit_weekdatacore += item.count;
    }
  }

  function addbeforeweek() {
    for (var i = visit_thisdayindex; i < visit_beforeweek.length; i++) {
      visit_weekdatacore += visit_beforeweek[i].count;
    }
  }

  function addweek(data) {
    if (visit_thisdayindex === 6) {
      visit_aweekago = visit_lastweek[0].date;
      addlastweek();
    } else {
      lastweek = data.contributions[51];
      visit_aweekago = lastweek[visit_thisdayindex + 1].date;
      addlastweek();
      addbeforeweek();
    }
  }

  function spArr(arr, num) {
    let newArr = [];
    for (let i = 0; i < arr.length; ) {
      newArr.push(arr.slice(i, (i += num)));
    }
    return newArr;
  }

  fetch(visit_apiurl)
    .then((data) => data.json())
    .then((res) => {
      var date_arr = res.result.items[0];
      var value_arr = res.result.items[1];
      var total = 0;
      var contributions = [];
      for (let i = 0; i < date_arr.length; i++) {
        if (value_arr[i][0] !== "--") {
          contributions.push({ date: date_arr[i][0].replace(/\//g, "-"), count: value_arr[i][0] });
          total += value_arr[i][0];
        } else {
          contributions.push({ date: date_arr[i][0].replace(/\//g, "-"), count: 0 });
        }
      }
      var data = {
        total: total,
        contributions: spArr(contributions, 7),
      };

      visit_data = data.contributions;
      visit_total = data.total;
      visit_first2date = visit_data[48];
      visit_firstdate = visit_data[47];
      visit_firstweek = data.contributions[0];
      visit_lastweek = data.contributions[52];
      visit_beforeweek = data.contributions[51];
      visit_thisdayindex = visit_lastweek.length - 1;
      visit_thisday = visit_lastweek[visit_thisdayindex].date;
      visit_oneyearbeforeday = visit_firstweek[0].date;
      visit_monthindex = visit_thisday.substring(5, 7) * 1;
      visit_montharrbefore = visit_month.splice(visit_monthindex, 12 - visit_monthindex);
      visit_monthchange = visit_montharrbefore.concat(visit_month);
      addweek(data);
      addlastmonth();

      var html = visit_main_box(
        visit_monthchange,
        visit_data,
        visit_color,
        visit_total,
        visit_thisweekdatacore,
        visit_weekdatacore,
        visit_oneyearbeforeday,
        visit_thisday,
        visit_aweekago,
        visit_amonthago
      );
      append_div_visitcalendar(document.getElementById("visit_container"), html);
      if (document.getElementById("visit_loading")) {
        document.getElementById("visit_loading").remove();
      }
      responsiveChart();
    })
    .catch(function (error) {
      console.log(error);
    });
  window.onresize = function () {
    responsiveChart();
  };
  window.onscroll = function () {
    if (document.querySelector(".visitmessage")) {
      visit_tooltip_container.innerHTML = "";
    }
  };
  var visit_info_box = (color) => {
    var html = "";
    html +=
      '<div id="visit_tooltip_container"></div><div class="contrib-footer clearfix mt-1 mx-3 px-3 pb-1"><div class="text-gray" style="text-align: right">数据来源 <a href="https://tongji.baidu.com/" target="blank">百度统计</a></div>';
    return html;
  };
  var visit_main_box = (monthchange, visit_data, color, total, thisweekdatacore, weekdatacore, oneyearbeforeday, thisday, aweekago, amonthago) => {
    var html = "";
    var infobox = visit_info_box(color);
    var style = visit_main_style();
    html +=
      '<div class="flex-table" style="display:flex;width:100%"><div class="table-column" style="border-top:0"><span class="text-muted">最近一年访问</span><span class="contrib-number">' +
      total +
      '</span><span class="text-muted">' +
      oneyearbeforeday +
      "&nbsp;-&nbsp;" +
      thisday +
      '</span></div><div class="table-column mid-column"><span class="text-muted">最近一月访问</span><span class="contrib-number">' +
      thisweekdatacore +
      '</span><span class="text-muted">' +
      amonthago +
      "&nbsp;-&nbsp;" +
      thisday +
      '</span></div><div class="table-column" style="border-top:0"><span class="text-muted">最近一周访问</span><span class="contrib-number">' +
      weekdatacore +
      '</span><span class="text-muted">' +
      aweekago +
      "&nbsp;-&nbsp;" +
      thisday +
      "</span></div></div>" +
      style;
    html += infobox + "</div></div>";
    return html;
  };
  var visit_main_style = () => {
    style =
      '<style>#visit_container{text-align:center;margin:0 auto;width:100%;padding:10px;display:flex;display:-webkit-flex;justify-content:center;align-items:center;flex-wrap:wrap;}.visit_title{font-size:1rem;font-weight:550;}.visitcalendar-graph text.wday,.visitcalendar-graph text.month{font-size:10px;fill:#aaa;}.contrib-legend{text-align:right;padding:0 14px 10px 0;display:inline-block;float:right;}.contrib-legend .legend{display:inline-block;list-style:none;margin:0 5px;position:relative;bottom:-7px;padding:0;}.contrib-legend .legend li{display:inline-block;width:10px;height:10px;}.text-small{font-size:12px;color:#767676;}.visitcalendar-graph{padding:15px 0 0;text-align:center;}.contrib-column{text-align:center;border-left:1px solid #ddd;border-top:1px solid #ddd;}.contrib-column-first{border-left:0;}.table-column{padding:10px;display:table-cell;flex:1;vertical-align:top;}.contrib-number{font-weight:400;line-height:1.3em;font-size:24px;display:block;}.visitcalendar img.spinner{width:70px;margin-top:50px;min-height:70px;}.monospace{text-align:center;color:#000;font-family:monospace;}.monospace a{color:#1D75AB;text-decoration:none;}.contrib-footer{font-size:11px;padding:0 10px 12px;text-align:left;width:100%;box-sizing:border-box;height:26px;}.left.text-muted{float:left;margin-left:9px;color:#767676;}.left.text-muted a{color:#4078c0;text-decoration:none;}.left.text-muted a:hover,.monospace a:hover{text-decoration:underline;}h2.f4.text-normal.mb-3{display:none;}.float-left.text-gray{float:left;}#user-activity-overview{display:none;}.day-tooltip{white-space:nowrap;position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.85);border-radius:3px;display:none;pointer-events:none;}.day-tooltip strong{color:#dfe2e5;}.day-tooltip.is-visible{display:block;}.day-tooltip:after{position:absolute;bottom:-10px;left:50%;width:5px;height:5px;box-sizing:border-box;margin:0 0 0 -5px;content:" ";border:5px solid transparent;border-top-color:rgba(0,0,0,.85)}.position-relative{width:100%;}@media screen and (max-width:650px){.contrib-column{display:none}}.angle-wrapper{z-index:9999;display:inline;width:200px;height:40px;position:relative;padding:5px 0;background:rgba(0,0,0,0.8);border-radius:8px;text-align:center;color:white;}.angle-box{position:fixed;padding:10px}.angle-wrapper span{padding-bottom:1em;}.angle-wrapper:before{content:"";width:0;height:0;border:10px solid transparent;border-top-color:rgba(0,0,0,0.8);position:absolute;left:47.5%;top:100%;}</style>';
    return style;
  };
};
var append_div_visitcalendar = (parent, text) => {
  if (parent !== null) {
    if (typeof text === "string") {
      var temp = document.createElement("div");
      temp.innerHTML = text;
      var frag = document.createDocumentFragment();
      while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
      }
      parent.appendChild(frag);
    } else {
      parent.appendChild(text);
    }
  }
};

var loading_visit = (color) => {
  loading =
    '<div id="visit_loading" style="width:10%;height:100%;margin:0 auto;display: block"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 50 50" style="enable-background:new 0 0 50 50" xml:space="preserve"><path fill="' +
    color +
    '" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z" transform="rotate(275.098 25 25)"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg></div>';
  return loading;
};

(function init() {
  var visit_color = ["#d7dbe2", "#fdcdec", "#fc9bd9", "#fa6ac5", "#f838b2", "#f5089f", "#c4067e", "#92055e", "#540336", "#48022f", "#30021f"];
  append_div_visitcalendar(visit_container, loading_visit("#49b1f5"));
  // 统计访问次数 PV 填写 'pv_count'，统计访客数 UV 填写 'visitor_count'，二选一
  visit_calendar("16350363", "121.cc6891b9e3cc9bf57c03b761e4080972.YnbDtYlClGamAp1Kize3t0G2FzlnyxtzHzjQcgw.ATqLWg", "pv_count", visit_color);
})();
