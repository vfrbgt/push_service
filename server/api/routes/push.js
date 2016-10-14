'use strict';

import Push from '../../models/push';

export default (router) => {
  router.get('/push/:id',
    async ctx => {
      let push = await Push.findOne({
        'token': ctx.params.id
      });
      ctx.body = {
        title: 'Привет',
        body: 'Тварь',
        icon: '',
        tag: '',
        link: ''
      };
    }
  );
};