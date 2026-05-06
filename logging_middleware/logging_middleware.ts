import axios from 'axios';
import process from 'process';

const ALLOWED_STACK = ['frontend'];
const ALLOWED_LEVEL = ['info', 'debug', 'warn', 'error', 'fatal'];
const ALLOWED_PACKAGE = ['api', 'component', 'hook', 'state', 'style', 'page', 'auth', 'config', 'utils', 'middleware'];
export async function sendLog(stack: string, level: string, pkg: string, message: string) {
  const token = process.env.TOKEN;
  await axios.post('http://20.207.122.201/evaluation-service/logs', {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message: message
  }, {
    headers: {
      'Authorization': `${token}`
    }
  });
}