## 单独的日志域名
对于日志上报使用单独的日志域名的目的是避免对业务造成影响。其一，对于服务器来说，我们肯定不希望占用业务服务器的计算资源，也不希望过多的日志在业务服务器堆积，造成业务服务器的存储空间不够的情况。其二，我们知道在页面初始化的过程中，会对页面加载时间、PV、UV等数据进行上报，这些上报请求会和加载业务数据几乎是同时刻发出，而浏览器一般会对同一个域名的请求量有并发数的限制，如Chrome会有对并发数为6个的限制。因此需要对日志系统单独设定域名，最小化对页面加载性能造成的影响。

跨域的问题

* 一种是构造空的Image对象的方式，其原因是请求图片并不涉及到跨域的问题
```javascript
var url = 'xxx'
new Image().src = url
```

* 利用Ajax上报日志，必须对日志服务器接口开启跨域请求头部Access-Control-Allow-Origin: *, 这里Ajax就并不强制使用GET请求了，即可克服URL长度限制的问题
```javascript
if (XMLHttpRequest) {
  var xhr = new XMLHttpRequest();
  xhr.open('post', 'https://log.xxx.com', true); // 上报给node中间层处理
  xhr.setRequestHeader('Content-Type', 'application/json'); // 设置请求头
  xhr.send(JSON.stringify(errorObj)); // 发送参数
}
```

## 省去响应主体

对于我们上报日志，其实对于客户端来说，并不需要考虑上报的结果，甚至对于上报失败，我们也不需要在前端做任何交互，所以上报来说，其实使用HEAD请求就够了，接口返回空的结果，最大地减少上报日志造成的资源浪费。

## 合并上报

类似于雪碧图的思想，如果我们的应用需要上报的日志数量很多，那么有必要合并日志进行统一的上报。解决方案可以是尝试在用户离开页面或者组件销毁时发送一个异步的POST请求来进行上报，但是尝试在卸载（unload）文档之前向web服务器发送数据。保证在文档卸载期间发送数据一直是一个困难。因为用户代理通常会忽略在卸载事件处理器中产生的异步XMLHttpRequest，因为此时已经会跳转到下一个页面。所以这里是必须设置为同步的XMLHttpRequest请求

```javascript
window.addEventListener('unload', logData, false);
function logData() {
    var client = new XMLHttpRequest();
    client.open("POST", "https://log.xxx.com", false); // 第三个参数表明是同步的 xhr
    client.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    client.send(analyticsData);
}
```

使用同步的方式势必会对用户体验造成影响，甚至会让用户感受到浏览器卡死感觉，对于产品而言，体验非常不好，通过查阅MDN文档，可以使用sendBeacon()方法，将会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能。这就解决了提交分析数据时的所有的问题：使它可靠，异步并且不会影响下一页面的加载。此外，代码实际上还要比其他技术简单！

下面的例子展示了一个理论上的统计代码模式——通过使用sendBeacon()方法向服务器发送数据。

```javascript
window.addEventListener('unload', logData, false);
function logData() {
    navigator.sendBeacon("/log", analyticsData);
}
```










