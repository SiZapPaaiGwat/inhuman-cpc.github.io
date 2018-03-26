---
title: JavaScript乱弹之（一）：JQuery+CSS入门
date: 2010-01-25
tags: JavaScript
---

一直没有系统的学习JavaScript，因为总感觉花太多时间来学习JS似乎有点浪费。
现实也似乎是如此，太多人执迷于服务器端语言而忽视了最基本的HTML、JavaScript语言。
其中这个**“太多人”**里面自然也包括我在内。

不过本文并不打算去按照一篇HTML语言基础或者JavaScript语言基础教程来介绍这些东西。
即使你和我一样是一个新手，阅读他们也不会有什么困难。
因为我的宗旨就是在应用中掌握他们，正所谓**“书读百遍其义自见”**就是这个道理。

注明：本系列文章是本人学习笔记和知识摘要，错误之处肯定很多，还请指出。

```asp
<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>JS乱弹系列（一）</title>
    <%--这里只例举了2种常用的CSS选择器--%>
    <style type="text/css">
        body
        {
            background-color:Black;
            }
    #div1
    {
        width:300px;
        height:50px;
        background-color:White;
        border-color:Red;
        margin-top:1%;
        margin-bottom:2%;
    }
        #div2
    {
        width:417px;
        height:133px;
        background-color:White;
        margin-bottom:2%;
    }
        #div3
    {
        width:500px;
        height:50px;
        background-color:White;
        margin-bottom:2%;
    }
        #div4
    {
        width:600px;
        height:50px;
        background-color:White;
        margin-bottom:2%;
    }
        #div5
    {
        width:700px;
        height:100px;
        background-color:White;
        text-align:center;
    }
    </style>
    <script src="JS/jquery-1.3.2-vsdoc2.js" type="text/javascript"></script>
    <%--加入此引用后，按Crtl+Shift+J更新智能感知#--%>
    <script language="javascript" type="text/javascript">
        $(document).ready(function() { $("#btn1").bind("click", function() { alert("绑定成功!"); }) })
        $(document).ready(function() {
            $("#btn").bind("click", function() {
                var name = $("#txtname").val();
                var pwd = $("#txtpwd").val();
                if (name=== "" || pwd === "")
                { alert("用户名和密码不能为空！"); return false; }
                else {
                    alert(name + "/" + pwd);
                    return true;
                }
            })
        })
        //假值，按照crockford的建议最好使用===代替==
        $(document).ready(function() {
            var a = (undefined == "");
            var b = (undefined == null);
            var c = (undefined == NaN);
            var d = (undefined === "");
            var e = (undefined === null);
            var f = (undefined === NaN);
            $("#div2").text(String(a) + "\n" + String(b) + "\n" + String(c) + "\n" + String(d) + "\n" + String(e) + "\n" + String(f));
        })
//        是不是很像C#的typeof
        $(document).ready(function() {
            var a =typeof(undefined) ;
            var b =typeof(null) ;
            var c =typeof("") ;
            var d = typeof (NaN);
            $("#div3").text(String(a) + "/" + String(b) + "/" + String(c) + "/" + String(d));
        })
        //存在表单输入时自动聚焦
        $(document).ready(function() { document.form1.txtname.focus(); })
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="divmain">
<div id="div1">
这是div1
</div>
<div id="div2">
这是div2
<br/>
JavaScript的假值，你知道这些结果是true还是false吗？
1.undefined == ""
2.undefined == null
3.undefined == NaN
4.undefined === ""
5.undefined === null
6.undefined === NaN
</div>
<div id="div3">
这是div3
</div>
<div id="div4">
    <input id="btn1" type="button" value="使用JQuery为按钮绑定事件"  title="在ready函数中绑定button的Click函数"/>
</div>
<div id="div5">
这是模拟一个登陆验证
<br />
  <span style="background-color:White"> 账号：</span><asp:TextBox ID="txtname" runat="server"></asp:TextBox>
    <br />
   <span style="background-color:White"> 密码：</span><asp:TextBox ID="txtpwd" runat="server"></asp:TextBox>
    <br />
    <asp:Button ID="btn" runat="server" Text="登陆验证"/>
</div>
</div>
    </form>
</body>
</html>
```
