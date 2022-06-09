# rainy window

## 安装

```shell
yarn add rainy-window
# or
npm install rainy-window
```

也可以使用 `cdn` 直接引入：

```
https://unpkg.com/rainy-window@latest/dist/umd/index.js
```
## 使用

如果你在 `webpack`、`vite` 项目中，你可以：

```javascript
import rain from 'rainy-window'

rain('myImage', 'http://pic.zhangshichun.top/pic/20220606-02.jpg')
```

如果你是通过 `cdn` 引入的：

```javascript
window.rain('OutsideTheWindow', 'http://pic.zhangshichun.top/pic/20220606-02.jpg')
```

## 在本项目里调试？

试试以下两个指令：
```shell
# 这是在简单html中通过umd打包的调试
yarn dev:umd
# 这是在vue3项目中通过 esm 打包的调试
yarn dev:esm
```