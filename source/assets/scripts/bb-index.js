// @ts-nocheck

function getbbdata() {
  var bbsurl = bbShortApiUrl;

  var httpRequest = new XMLHttpRequest(); //第一步：建立所需的对象
  httpRequest.open("GET", bbsurl, true); //第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
  httpRequest.send(); //第三步：发送请求  将请求参数写在URL中
  /**
   * 获取数据后的处理程序
   */
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      var json = httpRequest.responseText; //获取到json字符串，还需解析
      var obj = eval("(" + json + ")");
      // console.log(obj.data)
      const bbArray = obj.data.map((e) => {
        return {
          date: e.date,
          content: e.content,
          from: e.from,
        };
      });
      // console.log(fundsArray)
      saveToLocal.set("zhheo-bb", JSON.stringify(bbArray), 5 / (60 * 24));
      const data = saveToLocal.get("zhheo-bb");
      generateBBHtml(JSON.parse(data));
    }
  };
}

var generateBBHtml = (array) => {
  var $dom = document.querySelector("#bber-talk");
  var result = "";

  if (array.length) {
    for (let i = 0; i < array.length; i++) {
      var itemcontent = array[i].content;
      var newitemcontent = itemcontent.replace(/<img src="(https?:[^:<>"]*\/)([^:<>"]*)(\.((png!thumbnail)|(png)|(jpg)|(webp)|(jpeg)|(gif))(!blogimg)?)" >/g, " [图片] ");
      result += `<div class='li-style swiper-slide'>${newitemcontent}</div>`;
    }
  } else {
    result += '!{_p("aside.card_funds.zero")}';
  }

  var $dom = document.querySelector("#bber-talk");
  $dom.innerHTML = result;
  window.lazyLoadInstance && window.lazyLoadInstance.update();
  window.pjax && window.pjax.refresh($dom);
  var swiper = new Swiper(".swiper-container", {
    direction: "vertical", // 垂直切换选项
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
    },
  });
};
var bbInit = () => {
  // console.log('运行')
  if (document.querySelector("#bber-talk")) {
    const data = saveToLocal.get("zhheo-bb");
    if (data) {
      generateBBHtml(JSON.parse(data));
    } else {
      getbbdata();
    }
  }
};

bbInit();
document.addEventListener("pjax:complete", bbInit);
