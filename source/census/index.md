---
title: 博客统计
date: 2021-03-15 09:37:13
---

## 访问次数

<div id="visit_container" style="height: 150px"></div>

## 访问来源

<div id="mapChart" style="height:600px;"></div>

## 访问趋势

<div id="trendsChart" style="height:400px;"></div>

<script type="text/javascript" src="https://npm.elemecdn.com/jquery@3.6.0/dist/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/jquery-resize/1.1/jquery.ba-resize.min.js"></script>
<script type="text/javascript" src="https://npm.elemecdn.com/echarts@5.2.1/dist/echarts.min.js"></script>
<script type="text/javascript" src="https://npm.elemecdn.com/echarts@4.9.0/map/js/china.js"></script>
<script type="text/javascript" src="/assets/scripts/visit-calendar.js"></script>
<script type="text/javascript" src="/assets/scripts/census.js"></script>

<style>
.mid-column {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
@media screen and (max-width: 724px) {
  .mid-column {
    border-left: 0;
    border-right: 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  .flex-table {
    flex-direction: column;
  }
  .table-column {
    width: 100%
  }
  #visit_container {
    height: 380px !important;
  }
}
@media screen and (max-width: 1100px) and (min-width: 900px) {
  .mid-column {
    border-left: 0;
    border-right: 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  .flex-table {
    flex-direction: column;
  }
  .table-column {
    width: 100%
  }
  #visit_container {
    height: 380px !important;
  }
}
</style>
