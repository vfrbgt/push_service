'use strict';

import app from '../server';
import {
  connectDatabase,
} from '../server/db';
import {
  connectRabbit,
} from '../server/rabbit';
import { connectionMongoData } from '../server/db/config';

const port = process.env.PORT || 3000;

(async() => {
  try {
    const info = await connectDatabase(connectionMongoData);
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  } catch (error) {
    console.error('Unable to connect to database');
    process.exit();
  }

  try {
    const rabbitConnection = await connectRabbit();
    console.log(`Connected rabbit`);
  } catch (error) {
    console.log(error);
    console.error('Unable to connect to rabbit');
    process.exit();
  }

  try {
    await app.listen(port);
    console.log(`Server started on port ${port}`);
  } catch (error) {
    console.log(error);
  }
})();
