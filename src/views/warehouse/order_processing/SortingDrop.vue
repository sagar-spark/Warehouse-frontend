<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Sorting Drop of Order items</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :md="12">
      <CCard class="mb-2">
        <CCardHeader>
          <strong><span class="h4" v-if="this.allItems">{{this.allItems.length}}</span> order items pending sorting drop</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol :md="4" class="mb-3"  v-for="(item, itemIndex) in this.allItems">
              <CCard text-color="dark" class="mb-1 border border-secondary">
                <CCardHeader class="bg-light">
                  <CRow>
                    <CCol :md="10">
                      <p class="text-medium-emphasis mb-0">SKU / Description</p>
                      <h5 class="mb-1">{{item.itemPayload.sku}}</h5>
                      <h6>{{item.itemPayload.name}}, {{item.itemPayload.variantTitle}}</h6>
                      <span class="text-medium-emphasis" v-html="item.itemPayload.description"></span>
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol :md="6" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Transport trolley</p>
                      <h5>
                        <span v-if="item.itemStatus.picked.payload.transportTrolley">
                          {{item.itemStatus.picked.payload.transportTrolley}}
                        </span>
                        <span v-else>Not used</span>
                      </h5>
                    </CCol>

                    <CCol :md="6" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Transport bin</p>
                      <h5>
                        <span v-if="item.itemStatus.picked.payload.transportBin">
                          {{item.itemStatus.picked.payload.transportBin}}
                        </span>
                        <span v-else>Not used</span>
                      </h5>
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
                      <CButton color="primary" size="sm" class="align-middle" @click="this.initiateSortingDrop(itemIndex)">Sort drop</CButton>
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


  <!-- Sort drop modal -->

  <CModal alignment="center" size="lg" backdrop="static" :visible="this.modalSortingDropView" @close="this.clearSortingDrop()">

    <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

      <CModalHeader dismiss color="bg-warning" @close="this.clearSortingDrop()">
        <CModalTitle>
          DROP at Sort area {{this.selectedItemSortingDrop.itemPayload.quantity}}
          <span v-if="this.selectedItemSortingDrop.itemPayload.quantity == 1">quantity</span>
          <span v-else="this.selectedItemSortingDrop.itemPayload.quantity > 1">quantities</span>
          of {{this.selectedItemSortingDrop.itemPayload.name}} (SKU: {{this.selectedItemSortingDrop.itemPayload.sku}})
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        <CRow>
          <CCol :md="12">
            <CAlert color="warning">
              <CRow>
                <CCol :md="6" class="mb-2">
                  SKU<br><span class="h4">{{this.selectedItemSortingDrop.itemPayload.sku}}</span>
                </CCol>
                <CCol :md="6" class="mb-2">
                  Item name<br>
                  <span class="h4">{{this.selectedItemSortingDrop.itemPayload.name}}</span>
                </CCol>
                <CCol :md="6" class="mb-2">
                  Quantity<br>
                  <span class="h4">{{this.selectedItemSortingDrop.itemPayload.quantity}}</span>
                </CCol>
                <CCol :md="6" class="mb-2">
                  Price<br>
                  <span class="h4">{{this.selectedItemSortingDrop.itemPayload.price}} per item</span>
                </CCol>
              </CRow>
            </CAlert>
          </CCol>

          <CCol :md="6" class="mb-3">
            <CCard>
              <CCardHeader>
                <strong>Transport</strong>
              </CCardHeader>
              <CCardBody>

                <CRow>
                  <CCol :md="12">
                    <p class="text-medium-emphasis mb-1">Transport Trolley</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-barcode" />
                      </CInputGroupText>
                      <CFormInput v-if="this.selectedItemSortingDrop.itemStatus.picked.payload.transportTrolley" :placeholder="this.selectedItemSortingDrop.itemStatus.picked.payload.transportTrolley" disabled/>
                      <CFormInput v-else placeholder="Not used" disabled/>
                    </CInputGroup>
                  </CCol>

                  <CCol :md="12">
                    <p class="text-medium-emphasis mb-1">Transport Bin</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-barcode" />
                      </CInputGroupText>
                      <CFormInput v-if="this.selectedItemSortingDrop.itemStatus.picked.payload.transportBin" :placeholder="this.selectedItemSortingDrop.itemStatus.picked.payload.transportBin" disabled/>
                      <CFormInput v-else placeholder="Not used" disabled/>
                    </CInputGroup>
                  </CCol>

                  

                </CRow>
              </CCardBody>
            </CCard>

          </CCol>

          <CCol :md="6">
            <CCard>
              <CCardHeader>
                <strong>Sort area</strong>
              </CCardHeader>
              <CCardBody>

                  <CRow>
                    <CCol :md="12">
                      <p class="text-medium-emphasis mb-1">Confirm Item SKU</p>
                      <CInputGroup class="mb-3">
                        <CInputGroupText>
                          <CIcon icon="cil-barcode" />
                        </CInputGroupText>
                        <CFormInput v-model="this.sortingDropPayload.scannedSKU" placeholder="Scan item SKU" required/>
                      </CInputGroup>
                    </CCol>

                    <CCol :md="12">
                      <p class="text-medium-emphasis mb-1">Sort area Bin</p>
                      <CInputGroup class="mb-4">
                        <CInputGroupText>
                          <CIcon icon="cil-barcode" />
                        </CInputGroupText>
                        <CFormInput v-model="this.sortingDropPayload.sortAreaBin" placeholder="Scan Bin" />
                      </CInputGroup>
                    </CCol>

                    <CCol :md="12" v-if="this.sortingDropPayload">
                      <CFormCheck v-model="this.sortingDropPayload.matchSKUVariant" id="matchSKUVariant" label="Have you picked right variant/SKU?" required/>
                      <CFormCheck v-model="this.sortingDropPayload.matchQuantity" id="matchQuantity" label="Have you picked right quantity?" required/>
                      <CFormCheck v-model="this.sortingDropPayload.matchPrice" id="matchPrice" label="Have you picked right price/batch?" required/>
                    </CCol>
                  </CRow>

              </CCardBody>
            </CCard>
          </CCol>

        </CRow>
      </CModalBody>
      
      <CModalFooter>
        <CButton color="secondary" @click="this.clearSortingDrop()">Cancel</CButton>
        <CButton color="primary" type="submit">Sort drop</CButton>
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
      modalSortingDropView: false,
      selectedItemSortingDrop: null,
      sortingDropPayload: null,
      sortingDropPayloadSchema: {
        scannedSKU: null,
        matchSKU: null,
        sortAreaBin: null,
        matchSKUVariant: null,
        matchQuantity: null,
        matchPrice: null,
        matchImage: null,
      },

      // models
      allItems: [],
      
    }
  }, //end of Data

  methods: {

    initiateSortingDrop(itemIndex) {
      this.modalSortingDropView = true
      this.selectedItemSortingDrop = this.allItems[itemIndex]
      this.sortingDropPayload = this.sortingDropPayloadSchema
      this.sortingDropPayload.matchSKU = this.selectedItemSortingDrop.itemPayload.sku
    },

    clearSortingDrop() {
      this.modalSortingDropView = false
      this.selectedItemSortingDrop = null
      this.sortingDropPayload = null
    },

    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.completeSortingDrop()
      }
      this.validatedCustom01 = true
    },

    completeSortingDrop() {

      if (this.sortingDropPayload.scannedSKU != this.sortingDropPayload.matchSKU) {
        alert('Scanned SKU/Variant does not match. \n\nPlease cross-check SKU/Variant before picking.')
      }

      else {

        let submitPayload = {
          rowId: this.selectedItemSortingDrop.id,
          newStatus: 'sortdrop',
          payload: this.sortingDropPayload
        }

        console.log(submitPayload)

        axios.post(this.APIHOST + '/infra/updateOrderItemByRowId/', submitPayload, {
          headers: this.headers
        })
        .then(response => {
          // console.log(response.data.response)
          if (alert("Item dropped for Sorting")) {} 
          else {
            this.clearSortingDrop()
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
          orderStatus: 'picked'
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
