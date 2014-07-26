---
layout: page
title: 在Mac上重置MySQL的root帐户的密码
category: unix
tags: [mac, unix, mysql]
tagline: 
---

**最近需要用node操作mysql，但是今天忘记mysql的密码了，需要重置。但是一直不清楚MAMP里面的mysql怎么操作，
今天就花了点时间研究了一下。顺便做一点记录，因为不是经常用，很容易遗忘。

## 找到MAMP中MySQL的路径

一般是在这里：/Applications/MAMP/Library/bin，里面有很多的mysql的bin文件，直接在这个目录操作mysql。

## 关闭MySQL进程

	killall -TERM mysqld

## 重新启动MySQL

	./safe_mysqld --skip-grant-tables

如果没有safe_mysqld就使用 mysqld代替

## 进入MySQL操作数据库

	./mysql -uroot -p

这样进入数据库就不需要密码了，或者直接打开phpMyAdmin操作数据库

## 更新root帐户的密码

	update user set password=password("new_pass") where user="root";
	flush privileges;

**这样就完成了密码的更改。不过下次使用MAMP启动MySQL的时候，如果无法启动则先使用上面的命令关闭MySQL进程

**phpMyAdmin的用户名和密码在config.inc.php文件的第85和86行。
