'use strict';

import Subscribe from '../../models/subscribe';

export default (router) => {
  router.post('/subscribe', async ctx => {
    ctx.body = await Subscribe.create({
      project: ctx.request.body.project,
      token: ctx.request.body.token,
      group: ctx.request.body.group,
    });
  }).delete('/subscribe', async ctx => {
  	ctx.body = await Subscribe.find({ token: ctx.request.body.token }).remove().exec();
  });
};