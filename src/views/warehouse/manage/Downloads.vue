<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>ConnectCo+ App Downloads</h2>
      <h6>Scan QR codes from Mobile & download</h6>
    </CCol>
  </CRow>

  <CRow class="mb-3">

    <CCol :md="12" :sm="12" :lg="12">
      <CAlert color="warning">
        <h6>Scan QR codes on Mobile & app will download</h6>
        You may have to allow installation from non-play store sources when prompted on Android.
      </CAlert>
    </CCol>

    <CCol :md="3">
      <CNavLink href="https://wms-s3-assets-bc-rss-hkhaled-prod.s3.ap-south-1.amazonaws.com/Artifacts/delivery-app-qr-code.png" target="_blank">
        <CCard class="mb-3">
          <CCardImage orientation="top" src="https://wms-s3-assets-bc-rss-hkhaled-prod.s3.ap-south-1.amazonaws.com/Artifacts/delivery-app-qr-code.png" />
          <CCardBody>
            <CCardTitle>ConnectCo+ Delivery</CCardTitle>
            <CCardText>
              Manage orders, shipments, delivery - all in one place!
            </CCardText>
          </CCardBody>
        </CCard>
      </CNavLink>
    </CCol>

    <CCol :md="3">
      <CNavLink href="https://wms-s3-assets-bc-rss-hkhaled-prod.s3.ap-south-1.amazonaws.com/Artifacts/warehouse-app-qr-code.png" target="_blank">
        <CCard class="mb-3">
          <CCardImage orientation="top" src="https://wms-s3-assets-bc-rss-hkhaled-prod.s3.ap-south-1.amazonaws.com/Artifacts/warehouse-app-qr-code.png" />
          <CCardBody>
            <CCardTitle>ConnectCo+ Warehouse</CCardTitle>
            <CCardText>
              Assign locations, Pick orders from the convenience of mobile app!
            </CCardText>
          </CCardBody>
        </CCard>
      </CNavLink>
    </CCol>
  </CRow>
  
  
  

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "ConnectCo+ App Downloads",
  
  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      // models
      
    }
  }, //end of Data

  methods: {

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

}

</script>


<style scoped>

</style>