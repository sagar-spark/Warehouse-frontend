<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Inventory Transport</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :md="12" class="mb-4">
      <CCard class="mb-3">
        <CCardHeader>
          <strong><span v-if="this.allItems" class="h4">{{Number(this.allItems.length)}}</span> Pending Items for Transport</strong>
        </CCardHeader>
        <CCardBody>

          <CRow>
            <CCol :md="4" v-for="(item, counter) in this.allItems">
              <CCard text-color="dark" class="mb-3 border border-secondary">
                <CCardHeader class="bg-light">
                  <CRow>
                    <CCol :md="10">
                      <p class="text-medium-emphasis mb-0">SKU / Description</p>
                      <h5 class="mb-1">{{item.skuNumber}}</h5>
                      <h6>{{item.payload.packageDescription}}</h6>
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol :md="12" class="mb-2">
                      <p class="text-medium-emphasis mb-0">Target Shelf</p>
                      <h5>{{item.allocatedShelfName}}</h5>
                    </CCol>

                    <CCol :md="12" class="mb-2">
                      <p class="text-medium-emphasis mb-0">Quantity</p>
                      <h5>{{item.currentQuantity}}</h5>
                    </CCol>

                    <CCol :md="12" class="mt-2">
                      <CButton v-if="item.step == 'StockIn'" color="primary" size="sm" @click="this.initiateTransport(counter)" class="mb-1">Transport item</CButton>
                    </CCol>

                  </CRow>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <!-- Modal for Transport variant -->
  <CModal 
    alignment="center" 
    scrollable 
    backdrop="static"
    :visible="modalTransportView" 
    @close="this.clearTransport()">

    <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

      <CModalHeader 
        dismiss
        @close="this.clearTransport()">
        <CModalTitle>Transport item</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CAlert color="primary">
          <p class="text-medium-emphasis mb-0">SKU / Description</p>
          <h5 class="mb-1">{{this.selectedItemTransport.skuNumber}}</h5>
          <h6>{{this.selectedItemTransport.payload.packageDescription}}</h6>
        </CAlert>

          <CInputGroup class="mb-3">
            <CInputGroupText>
              <CIcon icon="cil-barcode" />
            </CInputGroupText>
            <CFormInput placeholder="Scan Transport trolley" v-model="this.selectedItemTransport.transportTrolleyId" required/>
          </CInputGroup>

          <CInputGroup class="mb-2">
            <CInputGroupText>
              <CIcon icon="cil-barcode" />
            </CInputGroupText>
            <CFormInput placeholder="Scan Transport bin (optional)" v-model="this.selectedItemTransport.transportBinId"/>
          </CInputGroup>
        
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="this.clearTransport()">Cancel</CButton>
        <CButton color="primary" type="submit">Transport</CButton>
      </CModalFooter>

    </CForm>
  </CModal>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Inventory Shelving",
  
  data: () => {
    return {

      //form validation
      validatedCustom01: null,

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      // models
      allItems: null,

      //Modal views
      modalTransportView: false,
      selectedItemTransport: null,
    }
  }, //end of Data

  methods: {

    initiateTransport(itemIndex) {
      this.modalTransportView = true
      this.selectedItemTransport = this.allItems[itemIndex]
    },

    completeTransport() {

      // prepare payload
      let transportItemPayload = {
        step: "Transport",
        asnId: this.selectedItemTransport.asnId,
        grnId: this.selectedItemTransport.grnId,
        vendorId: this.selectedItemTransport.vendorId,
        warehouseId: this.selectedItemTransport.warehouseId,

        items: [
          {
            logId: this.selectedItemTransport.id,
            skuNumber: this.selectedItemTransport.skuNumber,
            variantId: this.selectedItemTransport.variantId,
            currentQuantity: this.selectedItemTransport.currentQuantity,
            batchNumber: this.selectedItemTransport.batchNumber,

            payload: this.selectedItemTransport.payload,
            locationType: this.selectedItemTransport.locationType,

            allocatedBinId: this.selectedItemTransport.allocatedBinId,
            allocatedShelfId: this.selectedItemTransport.allocatedShelfId,

            transportBinId: this.selectedItemTransport.transportBinId,
            transportTrolleyId: this.selectedItemTransport.transportTrolleyId,

            confirmedBinId: this.selectedItemTransport.confirmedBinId,
            confirmedShelfId: this.selectedItemTransport.confirmedShelfId,

          }
        ],
      }

      console.log(transportItemPayload)
      
      axios.post(this.APIHOST + '/infra/addShelvingLog/', transportItemPayload, {
        headers: this.headers
      })
      .then(response => {
        // console.log(response.data.response)
        if (alert("Item in Transport now. \n\nDo shelve this item, once you reach designated Shelf in warehouse.")) {} 
        else {
          this.clearTransport()
          this.reloadPage() 
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
    },

    clearTransport() {
      this.modalTransportView = false
      this.selectedItemTransport = null
    },

    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.completeTransport()
      }
      this.validatedCustom01 = true
    },

    getStockInItems() {
      axios.post(this.APIHOST + '/infra/getShelvingLog/', {
        "steps": ["StockIn"]
      }, {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.allItems = response.data.response
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
    },

    reloadPage() {
      location.reload()
    },


  }, // end of methods

  created() {
    this.getStockInItems()
  }, // end created

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

}

</script>


<style scoped>

</style>