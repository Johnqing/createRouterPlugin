# react路由自动生成
## install
```
npm install createrouterplugin --save-dev
```

## use
```
new RouterPlugin({
    filePath: '**/index.js',
    basepath: path.resolve(SRC_PATH, 'pages'),
    output: path.resolve(SRC_PATH, 'routerConfig.js')
})
```
