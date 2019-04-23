import unmatch from './unmatch';
import login from './login';
import home from './home';
import demo from './demo';
import cost from './cost';
import accesskey from './accesskey';
import weCheck from './we-check';
import riskcheck from './riskcheck';
import creditscore from './creditscore';
import riskreport from './riskreport';
import car from './car';
import ai from './ai';
import consoles from './consoles';

const routers = [
  ...unmatch,
  ...login,
  ...home,
  ...demo,
  ...cost,
  ...accesskey,
  ...weCheck,
  ...riskcheck,
  ...creditscore,
  ...riskreport,
  ...car,
  ...ai,
  ...consoles
]

export default routers;
