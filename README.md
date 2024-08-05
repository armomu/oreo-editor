<p align="center">
  <img width="200" src="https://github.com/armomu/oreo-editor/raw/main/public/logo.png">
</p>

<h1 align="center">
    Oreo Editor
<div align="center">

![version](https://img.shields.io/badge/Vue-3.x-blue.svg)
![version](https://img.shields.io/badge/typescript-5.x-red.svg)
![version](https://img.shields.io/badge/Vite-5.x-green.svg)
![stars](https://img.shields.io/github/stars/armomu/oreo-editor.svg?style=social&label=Stars)

</div>

</h1>

🎒 这是一个类似`墨刀`原型图编辑器工具的一个纯前端简单实现，使用纯`CSS`样式构建图层操作对象，支持添加图片、文本、矩形、图标、自定义组件、低代码扩展，支持框选，对齐、对象组合、锁定、隐藏、右键菜单、图层管理等，设计思路是用`Vue3`组合式`Hook Api`实现函数模块化，使用`CSS transform`实现图层拖拽定位，也是因为是用定位图层，所以无法做自动宽比和嵌套图层，目前还有几个快捷键、撤销和流程图没有实现，还有一些对齐等奇奇怪怪的BUG没修🤕

## 👊 计划实现

-   ✅ 矩形样式宽、高、背景颜色、圆角、阴影、🙅旋转
-   ✅ 文本样式颜色、阴影、输入自动宽高、选择字体、🙅加粗、🙅下划线、🙅删除线
-   ✅ 图层组合、解散、对齐
-   ✅ 图片上传
-   ✅ 添加图标 🙅搜索图标
-   ✅ 图层对齐吸附检测
-   ✅ 标尺、区域拖动、缩放
-   ✅ 图层管理
-   ❌ 快捷键、撤销重做
-   ❌ 页面管理
-   ❌ 流程图
-   ❌ 脑图

## 🍭 预览

打不开的同学自行下载项目在本地开发环境预览

https://armomu.github.io/oreo-editor/

<p align="center">
  <img width="100%" src="https://github.com/armomu/oreo-editor/raw/main/public/ezgif-7-1e7feeddac.gif">
</p>

## 主要技术栈

| 名称                 | 版本 | 备注                 |
| -------------------- | ---- | ------------------ |
| typescript           | 5.x  | 🔥                 |
| vue                  | 3.x  | ⚽️                 |
| vite                 | 5.x  | 🛹                 |
| @arco-design/web-vue | 2.x  | 🎨 组件库           |
| vuetify              | 3.x  | 🐦 图标 可以考虑剔除  |
| pixi.js              | 7.x  | 🎮 canvas2D图形引擎 |

## 📑 本地开发

> ⚠️ 本地开发需要 `nodejs 18/20` vite5不支持更低的nodejs版本

```
git clone https://github.com/armomu/oreo-editor

cd oreo-editor

pnpm install

pnpm run dev

```

## 推荐项目 🔥 🔥

-   [基于Vue3 、TypeScript、 Vuetify.js的纯前端中后台管理模板](https://github.com/armomu/vue-material-admin)
-   [Babylonjs Web3D物理角色控制器，已经获得`Babylonjs`官方库推荐 🔥 🔥 👍](https://github.com/armomu/ergoudan)
-   [Babylonjs 马里奥3D场景](https://daisy-kaliman.vercel.app/#/index)
