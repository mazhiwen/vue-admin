import unmatch from './unmatch';
import login from './login';
import home from './home';
import demo from './demo';
// import cost from './cost';
// import accesskey from './accesskey';
// import weCheck from './we-check';
import merchant from './merchant';

const routers = [
  ...unmatch,
  ...login,
  ...home,
  // ...demo,
  // ...cost,
  // ...accesskey,
  // ...weCheck,
  ...merchant,
]

export default routers;
