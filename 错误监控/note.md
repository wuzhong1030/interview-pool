# 异常捕获

* 接口调用情况
* 页面逻辑是否存在错误

## 异常捕获方法

全局捕获
可以通过全局监听异常来捕获，通过window.onerror或者addEventListener
```javascript
window.onerror = function(errorMessage, scriptURI, lineNo, columnNo, error) {
  console.log('errorMessage: ' + errorMessage); // 异常信息
  console.log('scriptURI: ' + scriptURI); // 异常文件路径
  console.log('lineNo: ' + lineNo); // 异常行号
  console.log('columnNo: ' + columnNo); // 异常列号
  console.log('error: ' + error); // 异常堆栈信息
  // ...
  // 异常上报
};
throw new Error('这是一个错误');
```
通过window.onerror事件，可以得到具体的异常信息、异常文件的URL、异常的行号与列号及异常的堆栈信息，再捕获异常后，统一上报至我们的日志服务器。

亦或是，通过window.addEventListener方法来进行异常上报，道理同理：

```javascript
window.addEventListener('error', function() {
  console.log(error);
  // ...
  // 异常上报
});
throw new Error('这是一个错误');
```

## try... catch

使用try... catch虽然能够较好地进行异常捕获，不至于使得页面由于一处错误挂掉，但try ... catch捕获方式显得过于臃肿，大多代码使用try ... catch包裹，影响代码可读性。

# 常见问题

## 跨域脚本无法准确捕获异常

跨域之后window.onerror根本捕获不到正确的异常信息，而是统一返回一个Script error

解决方案：对script标签增加一个crossorigin=”anonymous”，并且服务器添加Access-Control-Allow-Origin。

```javascript
<script src="http://cdn.xxx.com/index.js" crossorigin="anonymous"></script>
```
## sourceMap
开启 source-map

## Vue捕获异常
```javascript
Vue.config.errorHandler = function (err, vm, info) {
  // handle error  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子  // 只在 2.2.0+ 可用
}
```






