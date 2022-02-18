var script1 = document.createElement("script"); //创建script标签节点
script1.setAttribute("type", "text/javascript"); //设置script类型
script1.setAttribute(
  "src",
  "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"
); //设置js地址
document.body.appendChild(script1); //将js追加为body的子标签

//判断script1是否加载成功
script1.onload = script1.onreadystatechange = function () {
  //如果script1加载成功则创建script2引入，这样就不会由于后面的js依赖前面的js导致后面的js先加载而导致程序报错
  if (
    !this.readyState ||
    this.readyState == "loaded" ||
    this.readyState == "complete"
  ) {
    var script2 = document.createElement("script");
    script2.setAttribute("type", "text/javascript");
    script2.setAttribute(
      "src",
      "https://cdn.bootcdn.net/ajax/libs/jquery-resize/1.1/jquery.ba-resize.min.js"
    );
    document.body.appendChild(script2);

    script2.onload = script2.onreadystatechange = function () {
      if (
        !this.readyState ||
        this.readyState == "loaded" ||
        this.readyState == "complete"
      ) {
        var script3 = document.createElement("script");
        script3.setAttribute("type", "text/javascript");
        script3.setAttribute(
          "src",
          "https://cdn.jsdelivr.net/npm/echarts@5.2.1/dist/echarts.min.js"
        );
        document.body.appendChild(script3);

        script3.onload = script3.onreadystatechange = function () {
          if (
            !this.readyState ||
            this.readyState == "loaded" ||
            this.readyState == "complete"
          ) {
            var script4 = document.createElement("script");
            script4.setAttribute("type", "text/javascript");
            script4.setAttribute("src", "/assets/scripts/china.js");
            document.body.appendChild(script4);

            script4.onload = script4.onreadystatechange = function () {
              if (
                !this.readyState ||
                this.readyState == "loaded" ||
                this.readyState == "complete"
              ) {
                var script5 = document.createElement("script");
                script5.setAttribute("type", "text/javascript");
                script5.setAttribute("src", "/assets/scripts/myMap.js");
                document.body.appendChild(script5);
              }
            };
          }
        };
      }
    };
  }
};
