# Sephora Web Mobile

## 开发前需要了解的内容

### 关于代码规范，提交规范，和测试

#### Eslint

基础规则参考 @sephora/lints/dist/eslint-with-ts

**注意**
.eslintrc.js 文件中 注释 "以下为计划修复的规则,修复一个，放开一个."。 此行注释以下的规则，理论上应该逐步开启，
开发的同学在开发中如果遇到规则中内容，请尽量修复

```js
{
    ...
    // 以下为计划修复的规则,修复一个，放开一个。
    "react/default-props-match-prop-types": 0,
    "no-useless-escape": 0,
    ...
}
```

#### 提交规范

提交信息规范，依靠 commitlint 做限制。
请按照如下格式编写提交信息

```shell
SEP-xxxx: commit message

Other Message Body # 可省略

Other Message Footer # 可省略
```

##### 提交小技巧

可以使用 git commit -F gitmsg 来提交

gitmsg 是包含提交信息的文本文件

#### 测试代码

##### 测试概述

目前项目框架使用 Jest 配合 enzyme, puppeteer。

相关文档:

- https://www.jestjs.cn/docs/getting-started
- https://enzymejs.github.io/enzyme/
- https://pptr.dev/

测试命令:

```shell
# 普通测试，不包含 puppeteer
yarn test

# 基础测试
yarn test:base

# E2E 测试
# 以下命令是在 puppeteer 的无头浏览器中使用对应环境的页面和接口进行测试
yarn  test-stage:e2e;
yarn  test-prd:e2e;
yarn  test-local:e2e; # 需要本地先使用yarn start 正常启动项目

```

目前项目中已包含一定的测试案例代码，根据必要程度，目前分成如下两类。

##### 必要的测试代码

必要测试的测试代码主要为:

- 基础测试
  - 基础测试代码在 src/tests/basetests 目录下，每次提交前都会进行校验
- Page 快照测试
  - 快照测试 则是投入成本较小的，且容易编写的回归测试代码
  - 快照测试代码在 src/common/containers 目录下
  - **新增路由时，请在 src/common/containers/\_\_tests\_\_/pages.snap.ts 下添加对应路由的快照测试**

##### 可选的测试代码

可选测试代码，是进一步减少 bug 率,保证代码质量,增加项目稳定性的辅助手段。编写自身需求，页面，函数的测试代码，可以增加开发自身的对于开发内容健壮性的信心。

测试脚本编写的基础规则:

- 普通测试命名规范:
  - 已测试内容名称.test.ts
  - 已测试内容名称.test.tsx
  - 已测试内容名称.test.js
- 端到端测试命名规范 (主要为模拟人工交互行为的测试)
  - 已测试内容名称.e2e.ts
  - 已测试内容名称.e2e.tsx
  - 已测试内容名称.e2e.js
- 测试文件可以就近放置，或就近放置在\_\_tests\_\_目录下

可选的单元测试脚本编写:

- 针对函数的测试
- 针对文件内容的测试
- 针对组件输入输出的测试
  - 组件的测试内容可以包括 组件快照测试， 不同 props 输入输出断言测试，等等
  - 本项目 React 组件的测试依赖 Enzyme 库,更多 Enzyme Api 请参考 https://enzymejs.github.io/enzyme/

可选的 E2E 测试脚本编写

- 针对某个真实渲染出的页面，或页面中某部分内容的请求，或模拟人为交互的测试代码
- 具体内容参考 puppeteer 和 jest 的文档

## 开始开发

### 安装依赖

```shell
yarn
```

### 启动

```shell
# 开发启动， 默认使用stage环境接口
yarn start

# 使用qa2环境接口启动
yarn start:qa2

# 使用产线接口启动
yarn start:prd

```
