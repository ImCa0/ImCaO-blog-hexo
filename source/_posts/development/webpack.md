---
title: Webpack 核心概念
date: 2021-10-14
tags:
  - 前端
  - Webpack
categories:
  - 开发
cover: /assets/covers/webpack.jpg
---

**本文简述了 webpack 中的一些核心概念，包括基础模块的功能介绍和配置方法。**

## 基础使用

### 使用 webpack 进行打包

#### webpack 的基础功能

- 转换 ES6 规范的代码
- 支持 ES6 模块化
- 压缩代码

#### 安装

```bash
npm init -y

npm install webpack webpack-cli -D
```

#### 基础配置

```js
// webpack.config.js
const path = require("path");

module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    path: path.join(__dirname, "dict"),
    filename: "bundle.js",
  },
};
```

- **entry**：入口，指定 webpack 开始打包的文件
- **output**：出口，指定 webpack 输出文件位置及名称

### SourceMap

#### 功能

建立源代码与打包生成的代码之间的映射关系，用于开发时定位错误位置。

#### 配置

```js
// webpack.config.js
module.exports = {
  devtool: "source-map",
};
```

- **devtool**：接收开启 SourceMap 的参数值，具体取值可参见[webpack 官方文档](https://webpack.js.org/configuration/devtool/)

## Plugins

实现开发时的一些小功能。

### html-webpack-plugin

#### 功能

打包时自动创建 html 文件，并引入打包生成的 js 文件。

#### 安装

```bash
npm install html-webpack-plugin -D
```

#### 配置

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      filename: "index.html",
    }),
  ],
};
```

- **template**：指定生成 html 文件的模板
- **filename**：指定生成的 html 文件名

### clean-webpack-plugin

#### 功能

打包时自动清理目标文件夹，主要用于删除文件名带哈希值的文件，因为它们不会被新打包生成的文件覆盖。

#### 安装

```bash
npm install clean-webpack-plugin -D
```

#### 配置

```js
// webpack.config.js
const { CleanWebpackPlugin } = require("html-webpack-plugin");

module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

### webpack-dev-server

#### 功能

开发时使用 webpack-dev-server 命令进行热部署。

#### 安装

```bash
npm install webpack-dev-server -D
```

#### 配置

```json
// package.json
{
  "scripts": {
    "dev": "webpack server"
  }
}
```

```js
// webpack.config.js
const path = require("path");

module.exports = {
  devServer: {
    port: 8000,
    static: path.join(__dirname, "dist"),
  },
};
```

- **port**：指定项目部署端口
- **static**：指定部署项目的静态资源文件夹

#### 请求转发

代码中使用相对路径进行请求的发送，在配置项中指定转发路径，类似 base url，实现开发与生产环境下请求地址的切换。

```js
// webpack.config.js
const path = require("path");

module.exports = {
  devServer: {
    proxy: {
      "/api/getxxx": {
        target: "http://localhost:8001/",
        pathRewrite: {
          "^/api": "",
        },
        changeOrigin: true,
      },
    },
  },
};
```

- **proxy**：请求转发的配置项
- **target**：转发地址，base url
- **pathRewrite**：对请求地址进行重写，以上例子将删除 /api，最终请求地址为 http://localhost:8001/getxxx
- **changeOrigin**：转换请求 Origin

#### HotModuleReplacement

webpack-dev-serve 4.0.0 以上默认开启该功能。修改代码后对修改部分的页面内容进行更新而不刷新整个页面，便于开发。

Loader 底层常常封装该功能，实现不同类型文件修改后的热替换。

## Loader

用于 webpack 打包时，对不同类型文件进行处理。

### file-loader

#### 功能

将文件直接打包到目标文件夹。

#### 安装

```bash
npm install file-loader -D
```

#### 配置

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.(jpg|png|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
          },
        },
      },
    ],
  },
};
```

- **test**：用正则表达式匹配使用该 loader 的文件名
- **name**：指定打包生成的文件名，[name]指原文件名，[hash]指生成哈希值，[ext]指原文件拓展名

### url-loader

####

将文件转换为 base64 编码，而非生成新文件。

> 对于较大的文件，请使用 file-loader 或配置 **limit** 选项，以避免页面加载时间过长。

#### 安装

```bash
npm install url-loader -D
```

#### 配置

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            limit: 2048,
          },
        },
      },
    ],
  },
};
```

- **limit**：指定使用 url-loader 打包的文件大小上限，单位为字节，超过上限的文件会自动使用 file-loader 进行打包

### css-loader 和 style-loader

#### 功能

css-loader 用于处理以下 css 文件的引用关系，最终导出一个包含 css 信息的数组。

```js
import "./index.css";
```

```css
@import "./index.css";
```

style-loader 用于将 css-loader 生成的 css 信息添加到页面 head 标签下的 style 标签中。

#### 安装

```bash
npm install css-loader sytle-loader -D
```

#### 配置

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

> loader 执行顺序由下往上，因此需要将 css-loader 放在 style-loader 下方。

#### 启用 CSS 模块化

启用 CSS 模块化，避免将 css 文件引入为全局样式导致污染。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
};
```

```js
// index.js
import styles from "./index.css";

img.className += ` ${styles.myImg}`;
```

### sass-loader 和 postcss-loader

#### 功能

sass-loader 用于将 sass 文件转换为 css 文件以进行下一步的打包。

postcss-loader 用于处理 css 文件，例如给 CSS3 样式添加浏览器厂商前缀。

#### 安装

```bash
npm install sass sass-loader -D

npm install postcss postcss-loader -D
npm install autoprefixer -D
```

#### 配置

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
};
```

```js
// postcss.config.js
module.export = {
  plugins: [require("autoprefixer")],
};
```

```json
// package.json
{
  "browserslist": ["> 1%", "last 2 versions"]
}
```

- **browserslist**：兼容市场份额大于 1% 的浏览器的近 2 个版本，为其添加厂商前缀

### babel

#### 功能

处理 ES6 语法的 JS 文件，将其转换为低版本浏览器可执行的 ES5 语法。

#### 安装

```bash
npm install @babel/core @babel/preset-env babel-loader  -D
npm install @babel/polyfill -D
```

#### 配置

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
};
```

- **exclude**：排除 node_modules 文件夹下的文件，不需要使用 babel 转换。

```json
// .babelrc
{
  // 预设：bebel 一系列插件的集合
  "presets": [
    "@babel/preset-env",
    // 配置 @babel/polyfill，用于实现 ES6 中 Promise, map 等特性
    {
      "useBuiltIns": "usage"
    }
  ]
}
```

- **useBuiltIns**：usage 表示只实现代码中涉及到的 ES6 特性，减小打包结果的文件大小。
