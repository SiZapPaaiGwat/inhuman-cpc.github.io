

## 设计目的

减少现有代码中的字符串拼接操作，增强代码的可维护性。

## 实现代码

	/*
	 * @description An Easy Template in JavaScript, it is designed to reduce the string concatention work,
	 * to make the gigantic code more readable and maintainable.
	 */
	function Template(tmpl,source){
	    //add all template tasks to this array
	    this.task = [];
	    if(tmpl)
	        this.task.push([tmpl,source]);
	}
	/*
	 * @description core function,hanlde two cases: typeof dataSource is either object or array
	 *  when the type of dataSource is array,you'd better confirm that the fields in every object is the same.
	 */
	Template.format = function(template,dataSource){
	    //default variable flags
	    var start = '{', end = '}';
	    if(dataSource && dataSource.slice && dataSource.length){
	        var retStr = [], formatted, len = dataSource.length, regMap = {};
	        //restore the RegExp,avoid to construct them repeatedly.
	        for(var regKey in dataSource[0]){
	            regMap[regKey] = new RegExp(start + regKey + end,'g');
	        }
	        for(var index in dataSource){
	            formatted = template;
	            for(var key in dataSource[index]){
	                formatted = formatted.replace(regMap[key],String(dataSource[index][key]));
	            }
	            retStr.push(formatted);
	        }
	        return retStr.join('');
	    }else{
	        for(var key in dataSource){
	            template = template.replace(new RegExp(start + key + end,'g'),String(dataSource[index][key]));
	        }
	        return template;
	    }
	};
	Template.prototype.add = function(tmpl,source){
	    //add one template task
	    this.task.push([tmpl,source]);
	};
	/*
	 * @description handle all tasks,and return the final string.
	 *  when this method is invoked,you can reuse the instance.
	 */
	Template.prototype.end = function(){
	    var retStr = [];
	    for(var index in this.task){
	        retStr.push(Template.format(this.task[index][0],this.task[index][1]));    
	    }
	    this.task.length = 0;
	    return retStr.join('');
	}; 


##使用方法

	<!doctype html>
	<html>
	<head>
	    <script src="jTemp.js"></script>
	</head>
	<body>
	        <ul id="MenuItems">
	            <li class="nav"><a href="{href}">{text}</a></li>                
	        </ul>
	        <script>
	            var ul = document.getElementById('MenuItems');
	            var dataSource = [
	                {text:'首页',href:'http://www.oschina.net/'},
	                {text:'开源软件',href:'http://www.oschina.net/'},
	                {text:'讨论区',href:'http://www.oschina.net/'},
	                {text:'代码分享',href:'http://www.oschina.net/'},
	                {text:'资讯',href:'http://www.oschina.net/'},
	                {text:'博客',href:'http://www.oschina.net/'},
	                {text:'Android',href:'http://www.oschina.net/'}
	            ];
	            var tmpl = new Template(ul.innerHTML,dataSource);
	            ul.innerHTML = tmpl.end();
	        </script>
	</body>
	</html>

## 额外说明

上面的例子更加偏向于一个简单的HTML的 `模板引擎` ，如果这是你需要的，不妨看看 `jQuery` 的作者John Resig在几年前的一个 [例子](http://ejohn.org/blog/javascript-micro-templating/)
