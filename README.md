#### 我们知道使用webpack打包项目后会生成一个dist文件夹，dist文件夹下有html文件和其他css、js以及图片等，那么打包后的文件该如何正确运行呢？

- 其实可以将生成的dist文件部署到 express 服务器上运行
- 1）、安装express-generator生成器。
  ```npm install express-generator -g // 也可使用cnpm比较快```

- 2）、创建一个express项目。
  ```express expressDemo // expressDemo是项目名```
- 3）、进入项目目录，安装相关项目依赖。
  ```
    cd expressDemo
    npm install // 或cnpm install 
    ```
- 4）、此时生成的项目目录应该是这样的：
![我的目录](https://upload-images.jianshu.io/upload_images/7522654-53faf1aa44107205.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 5）、将dist文件夹下的所有文件复制到express项目的publick文件夹下面，然后运行 npm start 来启动express项目
- 6）、打开浏览器，输入localhost:3000就可以看到效果了。默认是3000，我这里在bin文件夹下里面修改了
![修改了端口](https://upload-images.jianshu.io/upload_images/7522654-2b9aec49bf85a68c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)