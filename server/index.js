'use strict';

import Koa from 'koa';
import serve from 'koa-static';

import middleware from './middleware';
import api from './api';

const app = new Koa();

app.keys = ['secret'];

app.use(middleware());
app.use(serve(__dirname+'/static', {
	maxage: 0
}));
app.use(api());
app.use(ctx => ctx.status = 404);

export default app;
