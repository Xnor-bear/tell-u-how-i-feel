'use strict';

//导入依赖
const Koa = require('koa');
const Router = require('koa-router');
const KoaStatic = require('koa-static');
const config = require('./config');
const routers = require('./router');

const app = new Koa();
const router = new Router();

router.use(routers.routes());

app.use(KoaStatic('./static/'));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port);
console.log(`server listening at port ${config.port}`);
