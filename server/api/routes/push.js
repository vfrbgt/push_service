'use strict';

import Push from '../../models/push';

export default (router) => {
  router.get('/push/:id',
    async ctx => {
      let push = await Push.findOne({
        'token': ctx.params.id
      });
      ctx.body = {
        title: push.title,
        body: push.body,
        icon: push.icon,
        tag: push.tag,
        link: push.link
      };
    }
  );
};