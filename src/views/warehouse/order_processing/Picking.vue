<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Order Picking</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :md="12">
      <CCard class="mb-2">
        <CCardHeader>
          <strong><span class="h4" v-if="this.allItems">{{this.allItems.length}}</span> order items pending for Picking</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol :md="4" class="mb-3" v-for="(item, itemIndex) in this.allItems">
              <CCard text-color="dark" class="mb-1 border border-secondary">
                <CCardHeader class="bg-light">
                  <CRow>
                    <CCol :md="10">
                      <p class="text-medium-emphasis mb-0">SKU / Description</p>
                      <h5 class="mb-1">{{item.itemPayload.sku}}</h5>
                      <h6>
                        <span v-html="item.itemPayload.name"></span><br>
                        <span v-html="item.itemPayload.variantTitle"></span>
                      </h6>
                      <span class="text-medium-emphasis" v-html="item.itemPayload.description"></span>
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol :md="12" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Pick Shelf location</p>
                      <h5>{{item.inventory.shelfId.qualifiedName}}</h5>
                    </CCol>

                    <CCol :md="12" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Pick Bin location</p>
                      <h5 v-if="item.inventory.binId">{{item.inventory.binId.qualifiedName}}</h5>
                      <h5 v-else>Not provided</h5>
                    </CCol>

                    <CCol :md="6" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Quantity</p>
                      <h5>{{item.itemPayload.quantity}}</h5>
                    </CCol>

                    <CCol :md="6" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Order ID</p>
                      <h5>{{item.orderId}}</h5>
                    </CCol>

                    <CCol :md="12" class="mt-2">
                      <CButton color="primary" size="sm" class="align-middle" @click="this.initiatePicking(itemIndex)">Pick item</CButton>
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


  <!-- Picking modal -->

  <CModal alignment="center" size="lg" backdrop="static" :visible="this.modalPickingView" @close="this.clearPicking()">

    <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

      <CModalHeader dismiss color="bg-primary" @close="this.clearPicking()">
        <CModalTitle>
          PICK {{this.selectedItemPicking.itemPayload.quantity}}
          <span v-if="this.selectedItemPicking.itemPayload.quantity == 1">quantity</span>
          <span v-else="this.selectedItemPicking.itemPayload.quantity > 1">quantities</span>
          of {{this.selectedItemPicking.itemPayload.name}} (SKU: {{this.selectedItemPicking.itemPayload.sku}})
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        <CRow>
          <CCol :md="12">
            <CAlert color="primary">
              <CRow>
                <CCol :md="6" class="mb-2">
                  SKU<br><span class="h4">{{this.selectedItemPicking.itemPayload.sku}}</span>
                </CCol>
                <CCol :md="6" class="mb-2">
                  Item name<br>
                  <span class="h4">{{this.selectedItemPicking.itemPayload.name}}</span>
                </CCol>
                <CCol :md="6" class="mb-2">
                  Quantity<br>
                  <span class="h4">{{this.selectedItemPicking.itemPayload.quantity}}</span>
                </CCol>
                <CCol :md="6" class="mb-2">
                  Price<br>
                  <span class="h4">{{this.selectedItemPicking.itemPayload.price}} per item</span>
                </CCol>
              </CRow>
            </CAlert>
          </CCol>

          <CCol :md="6" class="mb-3">
            <CCard>
              <CCardHeader>
                <strong>Locate item & scan</strong>
              </CCardHeader>
              <CCardBody>

                <CRow>
                  <CCol :md="12">
                    <p class="text-medium-emphasis mb-1">Shelf location</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-barcode" />
                      </CInputGroupText>
                      <CFormInput v-model="this.pickingPayload.scannedShelf" placeholder="Scan shelf location" required/>
                    </CInputGroup>
                  </CCol>

                  <CCol :md="12">
                    <p class="text-medium-emphasis mb-1">Bin location (optional)</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-barcode" />
                      </CInputGroupText>
                      <CFormInput v-model="this.pickingPayload.scannedBin" placeholder="Scan bin location"/>
                    </CInputGroup>
                  </CCol>

                  <CCol :md="12">
                    <p class="text-medium-emphasis mb-1">Confirm Item SKU</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-barcode" />
                      </CInputGroupText>
                      <CFormInput v-model="this.pickingPayload.scannedSKU" placeholder="Scan item SKU" required/>
                    </CInputGroup>
                  </CCol>

                </CRow>
              </CCardBody>
            </CCard>

          </CCol>

          <CCol :md="6">
            <CCard>
              <CCardHeader>
                <strong>Transport item</strong>
              </CCardHeader>
              <CCardBody>

                  <CRow>
                    <CCol :md="12">
                      <p class="text-medium-emphasis mb-1">Transport Trolley (optional)</p>
                      <CInputGroup class="mb-3">
                        <CInputGroupText>
                          <CIcon icon="cil-barcode" />
                        </CInputGroupText>
                        <CFormInput v-model="this.pickingPayload.transportTrolley" placeholder="Scan Trolley" />
                      </CInputGroup>                  
                    </CCol>

                    <CCol :md="12">
                      <p class="text-medium-emphasis mb-1">Transport Bin (optional)</p>
                      <CInputGroup class="mb-4">
                        <CInputGroupText>
                          <CIcon icon="cil-barcode" />
                        </CInputGroupText>
                        <CFormInput v-model="this.pickingPayload.transportBin" placeholder="Scan Bin" />
                      </CInputGroup>
                    </CCol>

                    <CCol :md="12" v-if="this.pickingPayload">
                      <CFormCheck v-model="this.pickingPayload.matchSKUVariant" id="matchSKUVariant" label="Have you picked right variant/SKU?" required/>
                      <CFormCheck v-model="this.pickingPayload.matchQuantity" id="matchQuantity" label="Have you picked right quantity?" required/>
                      <CFormCheck v-model="this.pickingPayload.matchPrice" id="matchPrice" label="Have you picked right price/batch?" required/>
                    </CCol>
                  </CRow>

              </CCardBody>
            </CCard>
          </CCol>

        </CRow>
      </CModalBody>
      
      <CModalFooter>
        <CButton color="secondary" @click="this.clearPicking()">Cancel</CButton>
        <CButton color="primary" type="submit">Pick item</CButton>
      </CModalFooter>

    </CForm>

  </CModal>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Order Picking",
  
  data: () => {
    return {

      //form
      validatedCustom01: null,

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      //modals
      modalPickingView: false,
      selectedItemPicking: null,
      pickingPayload: null,
      pickingPayloadSchema: {
        scannedShelf: null,
        matchShelf: null,
        scannedBin: null,
        matchBin: null,
        scannedSKU: null,
        matchSKU: null,
        matchQuantity: null,
        matchPrice: null,
        matchImage: null,
        transportTrolley: null,
        transportBin: null,
      },

      // models
      allItems: [],
      
    }
  }, //end of Data

  methods: {

    initiatePicking(itemIndex) {
      this.modalPickingView = true
      this.selectedItemPicking = this.allItems[itemIndex]
      this.pickingPayload = this.pickingPayloadSchema
      this.pickingPayload.matchShelf = this.selectedItemPicking.inventory.shelfId.qualifiedName
      this.pickingPayload.matchBin = (this.selectedItemPicking.inventory.binId == null ? null : this.selectedItemPicking.inventory.binId.qualifiedName)
      this.pickingPayload.matchSKU = this.selectedItemPicking.itemPayload.sku
    },

    clearPicking() {
      this.modalPickingView = false
      this.selectedItemPicking = null
      this.pickingPayload = null
    },

    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.completePicking()
      }
      this.validatedCustom01 = true
    },

    completePicking() {

      console.log(this.pickingPayload.scannedBin)
      console.log(this.pickingPayload.matchBin)

      if (this.pickingPayload.scannedShelf != this.pickingPayload.matchShelf) {
        alert('Scanned Shelf does not match. \n\nPlease cross-check shelf before picking.')
      }

      else if (this.pickingPayload.scannedBin != this.pickingPayload.matchBin) {
        alert('Scanned Bin does not match. \n\nPlease cross-check bin before picking.')
      }

      else if (this.pickingPayload.scannedSKU != this.pickingPayload.matchSKU) {
        alert('Scanned SKU/Variant does not match. \n\nPlease cross-check SKU/Variant before picking.')
      }

      else {

        let submitPayload = {
          rowId: this.selectedItemPicking.id,
          newStatus: 'picked',
          payload: this.pickingPayload
        }

        console.log(submitPayload)

        axios.post(this.APIHOST + '/infra/updateOrderItemByRowId/', submitPayload, {
          headers: this.headers
        })
        .then(response => {
          // console.log(response.data.response)
          if (alert("Item picked")) {} 
          else {
            this.clearPicking()
            this.reloadPage() 
          }
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })
      }

    },

    getItemsForPicking() {
      axios.get(this.APIHOST + '/infra/getOrderItemsByOrderId/', {
        params: {
          orderId: 'ALL',
          orderStatus: 'created'
        },
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

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getItemsForPicking()
  }, // end created

}

</script>


<style scoped>

</style>
