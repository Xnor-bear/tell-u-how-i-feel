const koaBody = require('koa-body');
const Router = require('koa-router');
const mysql = require('mysql');
const config = require('../config');

const router = new Router();

var pool = mysql.createPool({
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database: config.database.database,
	port: config.database.port,
});

//api
router.get('/admin/api', async (ctx) => {
	let data = await new Promise((resolve, reject) => {
		pool.query('SELECT * from bbq', function (err, results) {
			if (err) {
				throw err;
			}
			resolve(results);
		});
	});

	ctx.body = {
		code: 0,
		data: data,
		msg: 'ok',
	};
});

//处理提交
router.post('/submit', koaBody(), (ctx) => {
	const name = ctx.request.body.nickname;
	const contact = ctx.request.body.contact;
	const way = ctx.request.body.way;
	const content = ctx.request.body.content;
	const time = new Date();
	const bbqContent = [name, contact, way, content, time];

	pool.query(
		'INSERT INTO bbq(Id,Name,Contact,Way,Content,Time) VALUES(0,?,?,?,?,?)',
		bbqContent,
		function (err, result) {
			if (err) {
				console.log('[INSERT ERROR] - ', err.message);
				return;
			}
			console.log('Record inserted Successfully');
		}
	);

	return ctx.redirect('submit_success.html');
});

router.get('/', (ctx) => {
	ctx.set({
		'Access-control-Allow-Origin': '*',
	});
	return ctx.redirect('index.html');
});

router.get('/admin', (ctx) => {
	ctx.set({
		'Access-control-Allow-Origin': '*',
	});
	return ctx.redirect('admin.html');
});

module.exports = router;
