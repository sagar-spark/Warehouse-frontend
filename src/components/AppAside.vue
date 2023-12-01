<template>
  <CSidebar
    color-scheme="light"
    size="lg"
    overlaid
    placement="end"
    :visible="asideVisible"
  >
    <CSidebarHeader class="bg-transparent p-0">
      <CNav variant="underline">
        <CNavItem>
          <CNavLink>
            <CIcon icon="cil-bell" alt="CoreUI Icons List" />&nbsp;
            <CBadge v-if="this.countUnreadNotifications > 0" color="primary">{{this.countUnreadNotifications}}</CBadge>
          </CNavLink>
        </CNavItem>
        <CNavItem class="ms-auto me-2 d-flex align-items-center">
          <CCloseButton @click="$store.commit('toggleAside')" />
        </CNavItem>
      </CNav>
    </CSidebarHeader>

        <CListGroup flush>
          <CListGroupItem class="list-group-item list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">NEW Notifications&nbsp;
            <CBadge color="primary">{{this.newNotifications.length}}</CBadge>
            &nbsp;&nbsp;
            <CIcon icon="cil-reload" color="primary" size="sm" @click="this.getNotifications()" />
          </CListGroupItem>

          <CListGroupItem href="#" class="border-start-4" v-if="this.newNotifications.length > 0" v-for="(notification, indexNotification) in this.newNotifications" :class="this.getNotificationColorStatus(notification.statusNew)">
            <CIcon icon="cil-cart" size="lg" class="float-end" />
            
            <div><strong>{{notification.payload.title}}</strong></div>
            <small class="text-medium-emphasis me-3">{{notification.payload.description}}</small>
            <br>
            <small class="text-medium-emphasis me-3">{{notification.created}}</small>
          </CListGroupItem>

          <CListGroupItem class="list-group-item list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">PREVIOUS Notifications&nbsp;
          <CBadge color="primary">{{this.oldNotifications.length}}</CBadge>
          </CListGroupItem>

          <CListGroupItem href="#" class="border-start-4" v-if="this.oldNotifications" v-for="(notification, indexNotification) in this.oldNotifications" :class="this.getNotificationColorStatus(notification.statusNew)">
            <CIcon icon="cil-cart" size="lg" class="float-end" />
            
            <div><strong>{{notification.payload.title}}</strong></div>
            <small class="text-medium-emphasis me-3">{{notification.payload.description}}</small>
            <br>
            <small class="text-medium-emphasis me-3">{{notification.created}}</small>
          </CListGroupItem>
        </CListGroup>

  </CSidebar>

  <div class="alert-fixed">
    <CAlert color="primary" :visible="this.alertShown" dismissible @close="() => { this.alertShown = false }">
      <span @click="$store.commit('toggleAside')">You've new notification(s)</span>
    </CAlert>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import axios from "axios"
import vueCookies from 'vue-cookies'


export default {
  name: 'AppAside',
  setup() {

    const store = useStore()

    // const nativeNotification = useNativeNotifications()
    // nativeNotification.requestsPermission().then(console.log)

    // const notify = function () {
    //   nativeNotification.show(
    //     'Notification',
    //     {
    //       body: 'This is a simple notification',
    //     },
    //     {},
    //   )
    // }

    return {
      store,
      asideVisible: computed(() => store.state.asideVisible),
    }
  },

  data: () => {
    return {
      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      // data
      timer: null,
      allNotifications: null,
      newNotifications: [],
      oldNotifications: [],
      newNotificationsArrived: false,
      countUnreadNotifications: 0,
      alertShown: false,
      lastNotifiedTimestamp: null,
      maxTimestamp: 0,
    }
  },

  methods: {
    getNotifications() {
      this.allNotifications = null
      this.newNotifications = []
      this.oldNotifications = []
      this.countUnreadNotifications = 0

      // get latest notification timestamp from session store
      this.lastNotifiedTimestamp = this.$store.state.lastNotificationTimestamp

      // get new notifications
      axios.get(this.APIHOST + '/infra/getAllNotifications/', {
        params: {},
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.allNotifications = response.data.response

        // check for new notifications
        for (let counter = 0; counter < this.allNotifications.length; counter++) {
          if (this.allNotifications[counter].statusNew == true) {
            this.countUnreadNotifications = this.countUnreadNotifications + 1
          }

          let epoch_created = new Date(this.allNotifications[counter].created).getTime()
          // console.log(this.allNotifications[counter].created, " - ", epoch_created)

          if (epoch_created > this.lastNotifiedTimestamp) {
            this.newNotifications.push(this.allNotifications[counter])
            this.newNotificationsArrived = true
          } else {
            this.oldNotifications.push(this.allNotifications[counter])
          }

          if (epoch_created > this.maxTimestamp) {
            this.maxTimestamp = epoch_created
          }

        }

        console.log(this.newNotifications)
        console.log("Max notification timestamp: " + this.maxTimestamp)        
        console.log("Existing timestamp: " + this.$store.state.lastNotificationTimestamp)
        this.$store.commit('updateNotificationTimestamp', this.maxTimestamp)

        if (this.newNotificationsArrived == true) {
          for (let counter = 0; counter< this.newNotifications.length; counter++) {
            this.nativeNotification(this.newNotifications[counter].payload.title, this.newNotifications[counter].payload.description)
          }
          this.showNotification()
          // this.playNotificationSound() //disabling
        }
      })
      // .catch(error => {
      //   alert(JSON.stringify(error.response.data.response))
      //   console.log(error)
      // })
    },

    playNotificationSound() {
      console.log("New notifications found - playing")
      var audio = new Audio(require('@/assets/sounds/notification.mp3'))
      audio.play()
    },

    showNotification() {
      this.alertShown = true
      setTimeout(this.hideNotification, 20000)
    },

    hideNotification() {
      this.alertShown = false
    },

    getNotificationColorStatus(statusNew) {
      switch (statusNew) {
        case true:
          return 'border-start-primary'
        case false:
          return 'border-start-warning'
        default:
          'border-start-warning'
      } 
    },

    nativeNotification(notificationTitle, notificationBody) {
      this.$notification.show(notificationTitle, { body: notificationBody }, {})
    },

    nativeNotificationPermissionCheck() {
      this.$notification.requestPermission().then(console.log)
    },
  },

  created() {
    // check notification permissions
    console.log("Checking notification permission:")
    this.nativeNotificationPermissionCheck()

    this.getNotifications()
  }, // end created

  mounted: function() {
    console.log("Calling Notification service regularly...")
    this.timer = setInterval(() => {
      this.getNotifications()
    }, 300000)
  },

  beforeDestroy() {
    clearInterval(this.timer)
  }

}
</script>

<style scoped>

  .alert-fixed {
    width: 10rem;
    position:fixed; 
    bottom: 5px; 
    left: 15px; 
    width: 10%;
    z-index:9999; 
    border-radius:0px
  }

</style>
