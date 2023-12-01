<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Order Sorting QC, Packing & Labelling</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :md="12">
      <CCard class="mb-2">
        <CCardHeader>
          <strong>
            <span v-if="Object.keys(this.allItemsOrderArranged).length> 0">
              <span class="h4">
                {{Object.keys(this.allItemsOrderArranged).length}}
              </span> orders with
            </span>
            <span class="h4" v-if="this.allItems">{{this.allItems.length}}</span> items pending for processing</strong>
        </CCardHeader>
        <CCardBody>

          <CRow v-for="(order, key) in this.allItemsOrderArranged" :key="key" class="mb-4">
            <CCol :md="12">
              <CCard text-color="dark" class="mb-1 border border-light">
                <CCardBody>
                  <CRow>
                    <CCol :md="1">
                      <p class="text-medium-emphasis">Order ID
                        <h5>{{key}}</h5>
                      </p>
                      <p class="text-medium-emphasis">Total items
                        <h5>{{order.length}}</h5>
                      </p>
                      <p>
                        <CButton color="primary" size="sm" @click="this.initiateSelectionView(key)">Pack</CButton>
                      </p>
                    </CCol>
                    <CCol :md="11">
                      <CRow>
                        <CCol :md="4" class="mb-1" v-for="(item, itemIndex) in order" :key="item.id">
                          <CCard text-color="dark" class="mb-1 border border-secondary">
                            <CCardHeader class="bg-light">
                              <CRow>
                                <CCol :md="9">
                                  <p class="text-medium-emphasis mb-0">SKU / Description</p>
                                  <h5>{{item.itemPayload.sku}}</h5>
                                </CCol>
                                <CCol :md="3">
                                  <p class="text-medium-emphasis mb-0">Quantity</p>
                                  <h5>{{item.itemPayload.quantity}}</h5>
                                </CCol>
                              </CRow>
                            </CCardHeader>
                            <CCardBody>
                              <CRow>
                                <CCol :md="7">
                                  <p class="text-medium-emphasis mb-0">Name, Description</p>
                                  <span class="h6" v-html="item.itemPayload.title"></span>
                                  <br>
                                  <span class="text-medium-emphasis" v-html="item.itemPayload.name"></span>
                                </CCol>
                                <CCol :md="5">
                                  <p class="text-medium-emphasis mb-0">Variant</p>
                                  <span class="h6">{{item.itemPayload.variantTitle}}</span>
                                </CCol>
                              </CRow>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
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

  <!-- Packing Modal -->

  <CModal alignment="center" scrollable size="lg" backdrop="static" :visible="this.modalPackingView" @close="this.clearPacking()">

    <CForm ref="PackingModalForm" class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

      <CModalHeader dismiss color="bg-primary" @close="this.clearPacking()">
          <CModalTitle>
            Pack Item(s)
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          
          <CRow v-if="this.selectedItemsPacking.length > 0">
            <CCol :md="6" v-for="(item, itemIndex) in this.selectedItemsPacking" v-bind:key="item.id">
              <CCard text-color="dark" class="mb-1 border border-secondary">
                <CCardHeader class="bg-light">
                  <CRow>
                    <CCol :md="6" class="mb-2">
                      <p class="text-medium-emphasis small mb-0">SKU</p>
                      <span class="h6">{{item.itemPayload.sku}}</span>
                    </CCol>
                    <CCol :md="6" class="mb-2">
                      <p class="text-medium-emphasis small mb-0">Quantity</p>
                      <span class="h6">{{item.itemPayload.quantity}}</span>
                    </CCol>
                    <CCol :md="6" class="mb-2">
                      <p class="text-medium-emphasis small mb-0">Item</p>
                      <span class="h6">{{item.itemPayload.title}}, {{item.itemPayload.variantTitle}}</span>
                    </CCol>
                    <CCol :md="6" class="mb-2">
                      <p class="text-medium-emphasis small mb-0">Price</p>
                      <span class="h6">{{item.itemPayload.price}}</span> per item
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol :md="12">
                      <p class="text-medium-emphasis mb-1">Confirm Item SKU</p>
                      <CInputGroup class="mb-3">
                        <CInputGroupText>
                          <CIcon icon="cil-barcode" />
                        </CInputGroupText>
                        <CFormInput v-model="item.packingPayload.scannedSKU" placeholder="Scan item SKU" required/>
                      </CInputGroup>
                    </CCol>
                    <CCol :md="12">
                      <CFormCheck v-model="item.packingPayload.matchSKUVariant" label="Have you packed right variant/SKU?" required/>
                      <CFormCheck v-model="item.packingPayload.matchQuantity" label="Have you packed right quantity?" required/>
                      <CFormCheck v-model="item.packingPayload.matchPrice" label="Have you packed right price/batch?" required/>
                    </CCol>
                  </CRow>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <hr>
          <CRow>
            <h6>Packing details</h6>
            <CCol :md="3">
              <CFormLabel class="text-medium-emphasis small">Weight (kgs)</CFormLabel>
              <CFormInput v-model="this.packagePayload.weight" />
            </CCol>

            <CCol :md="3">
              <CFormLabel class="text-medium-emphasis small">Length (mtrs)</CFormLabel>
              <CFormInput v-model="this.packagePayload.dimension.length" />
            </CCol>

            <CCol :md="3">
              <CFormLabel class="text-medium-emphasis small">Width (mtrs)</CFormLabel>
              <CFormInput v-model="this.packagePayload.dimension.width" />
            </CCol>

            <CCol :md="3">
              <CFormLabel class="text-medium-emphasis small">Height (mtrs)</CFormLabel>
              <CFormInput v-model="this.packagePayload.dimension.height" />
            </CCol>
          </CRow>

          <hr>
          <CRow>
            <CCol :md="4">
              <CFormCheck v-model="this.packagePayload.invoiceInserted" id="invoiceInserted" label="Have you printed and inserted Invoice?" required/>
            </CCol>
            <CCol :md="4">
              <CFormCheck v-model="this.packagePayload.shippingLabelPasted" id="shippingLabelPasted" label="Have you printed and pasted Shipping label on Package?" required/>
            </CCol>
            <CCol :md="4">
              <CFormCheck v-model="this.packagePayload.checkPackageIntegrity" id="checkPackageIntegrity" label="Is package sealed and safe for shipping?" required/>
            </CCol>
          </CRow>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="this.clearPacking()">Cancel</CButton>
          <CButton color="secondary">Print Invoice</CButton>
          <CButton color="secondary">Print Label</CButton>
          <CButton color="primary" type="submit">Pack item</CButton>
        </CModalFooter>

      </CForm>

  </CModal>

  <!-- Multiple items Modal -->

  <CModal alignment="center" scrollable size="lg" backdrop="static" :visible="this.modalMultipleItemsView" @close="this.clearMultipleItemsView()">

    <CModalHeader dismiss color="bg-primary" @close="this.clearMultipleItemsView()">
      <CModalTitle>
        Choose items from this Order to pack together
      </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CAlert color="warning" v-if="this.selectedOrderIdPacking && this.allItemsOrderArranged[this.selectedOrderIdPacking].length > 1">
        This order has more than 1 item available in Sort area (total: {{this.allItemsOrderArranged[this.selectedOrderIdPacking].length}})<br>
        <strong>
          Pack multiple items from an Order together (as possible) and choose appropriate packaging
        </strong>
        <br><br>
        Choose items to be packed together:
        <CMultiSelect v-if="this.multipleItemsSelectOptions.length > 1" :options="this.multipleItemsSelectOptions" :multiple="true" v-on:change="this.selectMultipleItems($event)" />
      </CAlert>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" @click="this.clearMultipleItemsView()">Cancel</CButton>
      <CButton color="primary" @click="this.continueMultiItemPacking()">Continue</CButton>
    </CModalFooter>

  </CModal>


</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Sorting QC, Packing & Labelling",
  
  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      // markers
      validatedCustom01: null,

      // models
      allItems: [],
      allItemsOrderArranged: {},

      // modals - multiple items
      modalMultipleItemsView: false,

      // modals - packing
      modalPackingView: false,
      selectedOrderIdPacking: null,
      selectedItemsPacking: [],
      multipleItemsSelectOptions: [],
      multipleItemsSelected: [],

      packingPayloadSchema: {
        matchSKU: null,
        scannedSKU: null,
        matchSKUVariant: null,
        matchQuantity: null,
        matchPrice: null,
        matchImage: null,
      },

      packagePayload: null,
      packagePayloadSchema: {
        weight: null,
        dimension: {
          width: null,
          height: null,
          length: null,
        },
        invoiceInserted: null,
        shippingLabelPasted: null,
        checkPackageIntegrity: null,
      }
      
    }
  }, //end of Data

  methods: {
    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.completePacking()
      }
      this.validatedCustom01 = true
    },

    initiateSelectionView(orderKey) {
      // select order
      this.selectedOrderIdPacking = orderKey
      this.packagePayload = this.packagePayloadSchema
      this.multipleItemsSelectOptions = []

      // has single items
      if (this.allItemsOrderArranged[orderKey].length == 1) {
        this.selectedItemsPacking = this.allItemsOrderArranged[orderKey]
        this.selectedItemsPacking[0]['packingPayload'] = this.packingPayloadSchema
        this.selectedItemsPacking[0]['packingPayload'].matchSKU = this.allItemsOrderArranged[orderKey][0].itemPayload.sku
        this.modalPackingView = true
      }

      // has multiple items
      else if (this.allItemsOrderArranged[orderKey].length > 1) {
        for (let counter = 0; counter < this.allItemsOrderArranged[orderKey].length; counter++) {
          // console.log(this.allItemsOrderArranged[orderKey][counter])
          let selectOption = {
            value: this.allItemsOrderArranged[orderKey][counter].id,
            text: this.allItemsOrderArranged[orderKey][counter].itemPayload.sku + ", " + this.allItemsOrderArranged[orderKey][counter].itemPayload.title + ", " + this.allItemsOrderArranged[orderKey][counter].itemPayload.variantTitle + ", Quantity (" + this.allItemsOrderArranged[orderKey][counter].itemPayload.quantity + ")"
          }
          this.multipleItemsSelectOptions.push(selectOption)
        }
        this.modalMultipleItemsView = true
      }
    },

    clearMultipleItemsView() {
      this.modalMultipleItemsView = false
      this.selectedOrderIdPacking = null
      this.selectedItemsPacking = []
      this.multipleItemsSelectOptions = []
      this.multipleItemsSelected = []
      this.packagePayload = null
    },

    selectMultipleItems(event) {
      this.multipleItemsSelected = []
      for (let counter = 0; counter < event.length; counter++) {
        this.multipleItemsSelected.push(event[counter].value)
      }
      // console.log(this.multipleItemsSelected)
    },

    continueMultiItemPacking() {

      if (this.multipleItemsSelected.length < 1) {
        alert("You've not selected any item. Select from drop-down to continue.")

      } else {
        this.selectedItemsPacking = []
        for (let counter = 0; counter < this.multipleItemsSelected.length; counter++) {

          // let selectedItem = this.allItems.filter(item => item.id == this.multipleItemsSelected[counter])

          let selectedItem = this.allItems.filter(item => item.id == this.multipleItemsSelected[counter])[0]
          console.log(selectedItem)

          let selectedItemCopy = this.allItems.filter(item => item.id == this.multipleItemsSelected[counter])[0]
          console.log(selectedItemCopy)
          
          selectedItem['packingPayload'] = this.packingPayloadSchema
          selectedItem['packingPayload']['matchSKU'] = selectedItemCopy.itemPayload.sku

          console.log(selectedItem)
          // let selectedItem = this.allItemsOrderArranged[this.selectedOrderIdPacking][this.multipleItemsSelected[counter]]
          // selectedItem['packingPayload'] = this.packingPayloadSchema
          // selectedItem['packingPayload'].matchSKU = selectedItem.itemPayload
          // // console.log(selectedItem)
          // this.selectedItemsPacking.push(selectedItem)
        }

        // console.log(this.selectedItemsPacking)
        this.modalMultipleItemsView = false
        this.modalPackingView = true
      }
    },

    clearPacking() {
      this.modalPackingView = false
      this.selectedOrderIdPacking = null
      this.selectedItemsPacking = []
      this.multipleItemsSelectOptions = []
      this.multipleItemsSelected = []
      this.packagePayload = null
      this.reloadPage()
    },

    completePacking() {
      for (let counter = 0; counter < this.selectedItemsPacking.length; counter++) {
        if (this.selectedItemsPacking[counter].packingPayload.matchSKU != this.selectedItemsPacking[counter].packingPayload.scannedSKU) {
          alert('Scanned SKU/Variant does not match. \n\nPlease cross-check SKU/Variant before packing.\n\nReference SKU: ' + this.selectedItemsPacking[counter].packingPayload.matchSKU)
        } else {
          // console.log(this.selectedItemsPacking[counter].packingPayload)
          
        }
      }

      // console.log(this.packagePayload)
      // this.clearPacking()
      // this.reloadPage()
    },

    getItemsForSortingQC() {
      axios.get(this.APIHOST + '/infra/getOrderItemsByOrderId/', {
        params: {
          orderId: 'ALL',
          orderStatus: 'sortdrop'
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.allItems = response.data.response


        // arrange by order id
        for (let counter=0; counter<this.allItems.length; counter++) {          
          // convert to string
          console.log(this.allItems[counter])
          let orderId = this.allItems[counter]['orderId'].toString()

          if (this.allItemsOrderArranged[orderId] == undefined) {
            this.allItemsOrderArranged[orderId] = [this.allItems[counter]]
          } else {
            this.allItemsOrderArranged[orderId].push(this.allItems[counter])
          }
        }

        console.log(this.allItemsOrderArranged)
        
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
    this.getItemsForSortingQC()
  }, // end created

}

</script>


<style scoped>

</style>