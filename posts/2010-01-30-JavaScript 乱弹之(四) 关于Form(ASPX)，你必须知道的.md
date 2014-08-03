# JavaScript 乱弹之(四) 关于Form(ASPX)，你必须知道的

在aspx页面中，可以使用**Request.Form["controlname"]**来得到控件value属性。

那么这些控件必须是哪些类型的控件呢？

所有HTML元素里面的input元素，但是还需要另外一个条件就是这个input元素必须要有name属性，id属性可有可无。

可能你问如果多个元素的name属性相同怎么办？

如果name相同则这些元素的value以逗号分隔，形如“value1,value2”。如果你使用的是服务器控件那么在生成的aspx页面中会自动给所有服务器控件加上name属性，这个name和id的值是相同的。不过当存在母板页时可能会要加上形如“ctl00_ContentPlaceHolder_”的标记，这些只要看看aspx源码就知道了。

另外在Request.Form这是一个NameValueCollection，你可以使用如下代码看看本页面中的表单请求：

```csharp
   For(int i=0;i<Request.Form.Count;i++){
	textbox1.Text+=Request.Form[i]+",";
  }
```

你会发现多了最后textbox1呈现的结果比你vs编辑器里的input元素总是多2个，而且这两个都是很长的“乱码”。其实这些就是ViewState，你可以去MSDN查看相关介绍。
另外所有的服务器控件最后都是转化为HTML控件的，这个转化因控件不同复杂性也不同，比如TreeView转化为HTML控件之后就是DIV嵌套TABLE形成的，这里不详述，自己拖一个看看就知道关系了。

另外你有可能需要通过脚本来操作隐藏的控件，这个时候你需要注意这个控件是服务器控件还是HTML控件以及你如何隐藏这些控件。

服务器控件可以简单的设置Visible="false"来隐藏控件，但是一旦这样隐藏，在页面源码中你就找不到该控件的HTML代码了。也就是说，你通过脚本是无法找到该控件的，只有在后台编码中可以使用该控件。

但是如果你是通过css来控制的，通过脚本就可以找到。虽然如此你仍然需要掌握css两种不同的隐藏元素的方法：display:none和visibility:hidden,区别在于后者在页面中仍然占据物理空间，前者则通过其他文本流或控件元素自动填补。你拖两个这样的控件，去尝试一下在页面上右键复制这两个控件。

html控件的只能通过css来设置其显隐，虽然在vs编辑器里有一个visible属性但是那只有当该控件加上runat="server"才有效。一旦如此它就是HTML服务器控件了。 

暂时到这吧，以后继续更新。