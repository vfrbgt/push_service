'use strict';

import importDir from 'import-dir';

export const commands = importDir('./');

export function run(cmdName, params) {
  let parameters = params || [];
  if(commands[cmdName] && cmdName !== 'index') {
  	return commands[cmdName](parameters);
  }
  return [];
}