import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vue3NativeNotification from 'vue3-native-notification'

import CoreuiVue from '@coreui/vue-pro'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(Vue3NativeNotification, {requestOnNotify: true})
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)

app.mount('#app')