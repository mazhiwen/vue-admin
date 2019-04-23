import AppHeader from './app-header';
import AppMenu from './app-menu';
import AppView from './app-view';
import AppBreadcrumb from './app-breadcrumb';
import ConfirmButton from './confirm-button';
import UserSetting from './user-setting';
import CheckCard from './check-card';
import SendTextmsg from './send-textmsg';
import BusinessLine from './business-line';
import CountCard from './count-card';
import BatchCheck from './batch-check';
import CountCardUsual from './count-card-usual';
import CustomRsult from './custom-result';
import MainLayout from './main-layout/main-layout.vue';
import CheckResult from './check-result';
import ModalProductEdit from './ModalProductEdit';

import OneSingleCheck from './OneSingleCheck';
import SingleCheckBase from './SingleCheckBase';
import BatchCheckBasic from './BatchCheckBasic/BatchCheckBasic.vue';
import OneSingleCheckResult from './OneSingleCheckResult/OneSingleCheckResult.vue';
import Login from 'views/login';

const components = {
  AppHeader,
  AppMenu,
  AppView,
  AppSidebar: AppView.AppSidebar,
  AppContent: AppView.AppContent,
  AppBreadcrumb,
  ConfirmButton,
  UserSetting,
  CheckCard,
  SendTextmsg,
  BusinessLine,
  CountCard,
  BatchCheck,
  CountCardUsual,
  CustomRsult,
  MainLayout,
  CheckResult,
  ModalProductEdit,
  OneSingleCheck,
  SingleCheckBase,
  BatchCheckBasic,
  OneSingleCheckResult,
  Login
}

const install = function(Vue, opts = {}) {
  if (install.installed) return;
  Object.keys(components).forEach(component => Vue.component(component, components[component]))
}

const API = {
  install,
  ...components
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports.default = module.exports = API
