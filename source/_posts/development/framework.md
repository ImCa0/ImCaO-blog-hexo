---
title: 制造设备实时数据传输架构方案
date: 2021-10-07
tags:
  - 科研
  - 数据传输
  - MQTT
  - InfluxDB
categories:
  - 我的开发
cover: framework.jpg
---

## 总体架构

总体架构如下图所示，由底层设备适配层、MQTT 消息传输层、InfluxDB 数据持久层和数据调用 API 四部分构成。

![framework](source@/framework.jpg)

## 适配层

由于制造设备本身不具有标准的实时数据输出，并且不同品牌、不同类型设备的通信协议和需要采集的数据都不同，所以需要对每类设备进行适配。适配层逻辑采用 C++ 语言实现，采集数据以 JSON 格式输出。将同属于一个区域的设备总和视为一个边缘节点（图中的虚线框），设备数据以节点为单位进行发布。

## MQTT

[MQTT](https://mqtt.org/) 是一种适用于物联网（IoT）的极其轻量级的标准消息传输协议，其消息传输基于发布/订阅的模式。

要实现 MQTT 协议的消息传输，需要一个 MQTT 消息服务器，以及发送或接收数据需要的 MQTT 客户端。MQTT 消息服务器需要部署在云服务器上，其本身不发布也不订阅数据，而是作为消息的中转站。MQTT 客户端可以进行消息的发布和订阅，并且支持多种语言实现。

![MQTT](source@/MQTT.jpg)

设备以边缘节点为单位，通过 MQTT 协议将数据发布到云服务器上。云服务器运营商为腾讯云，配置为 1 核 2 G，带宽 6 M。部署的 MQTT 消息服务器为 [EMQ X](https://www.emqx.com/zh/products/emqx) 开源版本。设备层 MQTT 客户端包含在适配层中，使用 C++ 语言实现消息的发布。

## InfluxDB

[InfluxDB](https://www.influxdata.com/) 是一个由 InfluxData 开发的开源时序数据库，着力于高性能地查询与存储时序型数据，被广泛应用于存储系统的监控数据，IoT 行业的实时数据等场景。

时序数据库与关系型数据库的最大区别在于索引不同，时序数据库中的数据都以时间为索引，以此提高查询效率。时序数据库的其他特性如下：

- **measurement**：类似与关系型数据库中表的概念。
- **field**：类似于关系型数据库中属性的概念，存放数据，不具有索引。
- **tag**：类似于关系型数据库中属性的概念，存放标签，具有索引。
- **point**：类似于关系型数据库中记录的概念。
- **retention policy**：数据保留策略，用于定时删除过期数据。
- **series**：具有共同 retention policy，measurement 和 tag 的集合。

![InfluxDB](source@/influxdb.jpg)

通常来讲，想要把设备数据存储到 InfluxDB 中，需要一个 MQTT 客户端订阅相关的消息主题，然后通过连接数据库、编写 Flux 语言（类似于 SQL 语言，用于操作 InfluxDB 数据库）将数据存入数据库。好在有第三方服务 Telegraf 可以帮助我们快速实现这一系列的操作。

## Telegraf

[Telegraf](https://docs.influxdata.com/telegraf/) 是 InfluxData 开发的一个数据采集器，用来收集各种监控数据。因为其非常灵活的插件体系，社区贡献了大量的采集插件，从操作系统层面的指标到各种数据库、中间件的插件应有尽有。

使用 Telegraf，只需要编写配置文件，将其输入设置为 MQTT，连接 MQTT 服务器，订阅相关主题，将其输出设置为 InfluxDB，在接收到数据后向数据库输出数据。

在配置文件中需要指定输入数据的格式为 JSON，并且声明 JSON 中个各个属性的含义。

```conf
## telegraf.conf
[[inputs.mqtt_consumer]]
  ## MQTT 服务器
  servers = ["tcp://127.0.0.1:1883"]

  ## 连接认证
  username = "telegraf"
  password = "telegraf"

  ## 订阅的主题
  topics = [
    "mqtt/js",
    "telegraf/mqtt",
    "telegraf/+/mem",
    "sensors/#",
  ]

  ## 指定数据格式
  data_format = "json"

  ## 指定 tag_key 的属性名
  tag_keys = [
    "host"
  ]

  ## 指定类型为 string 的 field 的属性名
  json_string_fields = ["string_test"]

  ## 指定 measurement 的属性名
  json_name_key = "measurement"

  ## 指定 timestamp 的属性名
  json_time_key = "time"

  ## 指定 timestamp 的格式
  json_time_format = "unix_ms"
```

在以上配置的情况下，接收到一条 JSON 消息如下：

```json
// json
{
  "measurement": "laptop",
  "time": 1633590165557,
  "host": "ImCaO's laptop",
  "used_mem": 7837052928,
  "free_mem": 7057326080
}
```

Telegraf 会向 InfluxDB 的 laptop 表中写入一条 tag 为 host: "ImCaO's laptop"、field 为 used_mem: 7837052928, free_mem: 7057326080、timestamp 为 1633590165557 的记录。

## API

数据查询的 API 初步采用 NodeJS 编写，使用 GET 请求携带 measurement、start、stop、filed 等参数进行查询，以 JSON 格式返回结果。

![API](source@/API.jpg)
