<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Inventory Shelving</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :md="12" class="mb-4">
      <CCard class="mb-3">
        <CCardHeader>
          <strong><span v-if="this.allItems" class="h4">{{Number(this.allItems.length)}}</span> Pending Items for Shelving</strong>
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
                      <CButton v-if="item.step == 'Transport'" color="primary" size="sm" @click="this.initiateShelving(counter)" class="mb-1">Shelve item</CButton>
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

  <!-- Modal for Shelving variant -->
  <CModal 
    alignment="center" 
    scrollable 
    backdrop="static"
    :visible="modalShelvingView" 
    @close="this.clearShelving()">

    <CForm class="needs-validation" novalidate :validated="validatedCustom02" @submit="handleSubmitCustom02" @submit.prevent=";">

      <CModalHeader 
        dismiss
        @close="this.clearShelving()">
        <CModalTitle>Shelve item</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CAlert color="info">
          <p class="text-medium-emphasis mb-0">SKU / Description</p>
          <h5 class="mb-1">{{this.selectedItemShelving.skuNumber}}</h5>
          <h6>{{this.selectedItemShelving.payload.packageDescription}}</h6>
        </CAlert>

          <CInputGroup class="mb-3">
            <CInputGroupText>
              <CIcon icon="cil-barcode" />
            </CInputGroupText>
            <CFormInput placeholder="Scan placement shelf" v-model="this.selectedItemShelving.confirmedShelfId" required/>
          </CInputGroup>

          <CInputGroup class="mb-2">
            <CInputGroupText>
              <CIcon icon="cil-barcode" />
            </CInputGroupText>
            <CFormInput placeholder="Scan placement bin (optional)" v-model="this.selectedItemShelving.confirmedBinId"/>
          </CInputGroup>
        
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="this.clearShelving()">Cancel</CButton>
        <CButton color="primary" type="submit">Shelve</CButton>
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
      validatedCustom02: null,

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
      modalShelvingView: false,
      selectedItemShelving: null,      
      
    }
  }, //end of Data

  methods: {

    initiateShelving(itemIndex) {
      this.modalShelvingView = true
      this.selectedItemShelving = this.allItems[itemIndex]
    },

    completeShelving() {

      // prepare payload
      let shelvingItemPayload = {
        step: "Shelving",
        asnId: this.selectedItemShelving.asnId,
        grnId: this.selectedItemShelving.grnId,
        vendorId: this.selectedItemShelving.vendorId,
        warehouseId: this.selectedItemShelving.warehouseId,

        items: [
          {
            logId: this.selectedItemShelving.id,
            skuNumber: this.selectedItemShelving.skuNumber,
            variantId: this.selectedItemShelving.variantId,
            currentQuantity: this.selectedItemShelving.currentQuantity,
            batchNumber: this.selectedItemShelving.batchNumber,

            payload: this.selectedItemShelving.payload,
            locationType: this.selectedItemShelving.locationType,
            
            allocatedBinId: this.selectedItemShelving.allocatedBinId,
            allocatedShelfId: this.selectedItemShelving.allocatedShelfId,

            transportBinId: this.selectedItemShelving.transportBinId,
            transportTrolleyId: this.selectedItemShelving.transportTrolleyId,

            confirmedBinId: this.selectedItemShelving.confirmedBinId,
            confirmedShelfId: this.selectedItemShelving.confirmedShelfId,

          }
        ],
      }

      console.log(shelvingItemPayload)

      if (shelvingItemPayload.confirmedShelfId != shelvingItemPayload.allocatedShelfId) {
        alert('Placement Shelf does not match. \n\nAre you on right Shelf?')
      } 
      else {
        axios.post(this.APIHOST + '/infra/addShelvingLog/', shelvingItemPayload, {
          headers: this.headers
        })
        .then(response => {
          // console.log(response.data.response)
          if (alert("Item shelved.")) {} 
          else {
            this.clearShelving()
            this.reloadPage() 
          }
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })
      }
    },

    clearShelving() {
      this.modalShelvingView = false
      this.selectedItemShelving = null
    },

    handleSubmitCustom02(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.completeShelving()
      }
      this.validatedCustom02 = true
    },

    getStockInItems() {
      axios.post(this.APIHOST + '/infra/getShelvingLog/', {
        "steps": ["Transport"]
      }, {
        headers: this.headers,
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
  },

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

}

</script>


<style scoped>

</style>