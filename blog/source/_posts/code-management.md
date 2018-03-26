---
title: 代码管理
date: 2016-06-26
tags: 代码管理
---

> 本文基本总结了我在DataEye前端项目代码管理方面的一些尝试。分享PPT在 [slides.com](http://slides.com/reduxis/deck-1/fullscreen) 可能需要翻墙。
## Virtuality & Reality

> 借助于当下流行的VR，代码管理也从两个方面来讲解：虚（文件内容相关的管理）/实（文件的物理存储相关的管理）
## Version Control

> Git与SVN：Git是分布式版本管理，SVN是中心化。

无需中心服务器，本地自用

> git init
## Multiple Projects

> 实际工作中开发人员每天都要与多个项目打交道，如何在多项目中开发中提高工作效率值得思考与学习
>
> 20,0000,0000
## All in one

> 和Windows的基础代码很像，Google的20亿行代码是用来驱动整个Google服务的，他们是一个整体！

[谷歌代码库已超过 20 亿行代码，他们是如何管理的？](http://blog.jobbole.com/91648/)
## All in two indeed

> 将业务代码(static)和可复用的代码(DataEye/dejs)分离
## Static

> 所有的前端业务代码
## DataEye/dejs

> 所有复用的组件代码，基于npm进行包管理
## npm

> node package manager  → package manager for javascript
>
> 30,1298
## Branches

> 分支管理已经成为日常工作的一部分（迭代新特性开发/临时BUG修复等）
## Under Control

> 分支管理不是复制粘贴，需要微观宏观同时把控。
>
> 提交/文件/修改历史都需要记录在案
## SVN

> 你打算签出十个分支的所有代码吗？
## Workflow

> 工作流管理将版本库分为稳定分支和临时分支
## Stable Branches

> master用于管理已发布的线上代码，development用于日常开发
## Temporary Branches

> feature / bug / release

临时分支需要在适当的时机合并到所有稳定分支。
## Code Review

> 发现BUG，提高代码质量，促进知识共享，提升团队技术水平
## Continuous Integration

> 提高软件质量，降低项目风险
## Unit Test

> 隔离程序最小单元对其进行正确性测试，避免意外惊喜

单元测试能够反哺程序自身的架构和设计。
## Coverage

> 没有明显错误的代码 vs 明显没有错误的代码

难以想象一行完全没有运行过的代码发布到生产环境会造成什么后果。
## Advice on Commits

> 尽快提交/尽早提交/经常提交
## Advice on Coding

> Be social and better
- GitHub
- npm
- Upsource
- codecov
- Semaphoreci

---

本文使用软件 [violet](https://github.com/simongfxu/violet)一键发布到知乎/简书/Medium/GitHub等多个平台。
