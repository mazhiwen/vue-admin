import Demo from './demo';
import dateParse from './dateParse';





const getImgUrl=(params)=>{
  return `../../../images/${params}.png`;
}





const filters = {
  Demo,
  ...dateParse,
  getImgUrl
}

const install = function(Vue, opts = {}) {
  if (install.installed) return;
  Object.keys(filters).forEach(filter => Vue.filter(filter, filters[filter]))
}

const API = {
  install,
  ...filters
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports.default = module.exports = API
