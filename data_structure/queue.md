# 数据结构快览 - 队列

队列和栈一样，是最基本的数据结构之一。

队列是一种对象容器，对象的插入和删除遵循`FIFO`原则（First In First Out）。队列在现实生活中的应用非常广泛，比如排队等候服务。

## 队列ADT（抽象数据类型）

- enqueue
- dequeue
- getSize
- isEmpty
- front

## 时间复杂度

队列的各种操作都是O(1)

## 应用实例

**循环分配器**

按照环形次序反复循环，为共享某一资源的一群客户（比如共享一个CPU的多个应用程序）做资源分配。

```java
e = Q.dequeue();
Serve(e);
Q.enqueue(e);
```

**Josephus环**

已知n个人(以编号1，2，3...n分别表示)围坐在一张圆桌周围。从编号为k的人开始报数，数到m的那个人出列;他的下一个人又从1开始报数，数到m的那个人又出列;依此规律重复下去，直到圆桌周围的人全部出列。

[Wikipedia](https://zh.wikipedia.org/wiki/%E7%BA%A6%E7%91%9F%E5%A4%AB%E6%96%AF%E9%97%AE%E9%A2%98)

## JDK源码

Java中提供了[Queue](http://www.docjar.com/docs/api/java/util/Queue.html)接口，它有如下方法：

- add/offer
- element/peek
- remove/poll

上面三组方法，成对的都是功能类似的，唯一的区别在于当数组为空或者容量超出队列之后的操作处理方式。

Java中的[LinkedList](http://www.docjar.com/docs/api/java/util/LinkedList.html)实现了Queue接口，因而可以当做队列使用。

当然，Java中实现了Queue接口的类非常之多，不同的类应用于不同的场景。
比如[阻塞队列](http://www.infoq.com/cn/articles/java-blocking-queue/)适用于生产者和消费者问题。
