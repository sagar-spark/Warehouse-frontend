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

          <CRow v-for="(order, orderId) in this.allItemsOrderArranged" class="mb-4" :key=orderId>
            <CCol :md="12">
              <CCard text-color="dark" class="mb-1 border border-light">
                <CCardBody>
                  <CRow>
                    <CCol :md="1">
                      <p class="text-medium-emphasis">Order ID
                        <h5>{{orderId}}</h5>
                      </p>
                      <p class="text-medium-emphasis">Total items
                        <h5>{{order.length}}</h5>
                      </p>
                      <p>
                        <CButton color="primary" size="sm" @click="this.initiatePacking(orderId)">Pack</CButton>
                      </p>
                    </CCol>
                    <CCol :md="11">
                      <CRow>
                        <CCol :md="4" class="mb-3" v-for="(item, itemIndex) in order">
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
  <CModal alignment="center" size="lg" backdrop="static" :visible="this.viewModalPacking" @close="this.clearPacking()">

    <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

      <CModalHeader dismiss color="bg-primary" @close="this.clearPacking()">
        <CModalTitle>
          Pack Item(s)
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        <CRow v-if="this.selectedItemsPacking.length > 0">
          <CCol :md="6" v-for="item in this.selectedItemsPacking" :key="item.id">
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
          <CCol :md="6">
            <CFormCheck v-model="this.packagePayload.invoiceInserted" id="invoiceInserted" label="Have you printed and inserted Invoice?" required/>
          </CCol>
          <CCol :md="6">
            <CFormCheck v-model="this.packagePayload.checkPackageIntegrity" id="checkPackageIntegrity" label="Is package sealed and safe for shipping?" required/>
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="this.clearPacking()">Cancel</CButton>
        <CNavLink v-if="this.invoiceURL" :href=this.invoiceURL target="_blank" active>
          <CButton color="secondary">Print invoice</CButton>
        </CNavLink>
        <CButton color="primary" @click="this.completePacking()">Pack item</CButton>
      </CModalFooter>

    </CForm>

  </CModal>

  <!-- Modal - multi-selection -->
  <CModal alignment="center" size="lg" backdrop="static" :visible="this.viewModalMultiSelection" @close="this.clearMultiSelection()">

    <CModalHeader dismiss color="bg-primary" @close="this.clearMultiSelection()">
      <CModalTitle>
        Choose items from this Order to pack together
      </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CAlert color="warning" v-if="this.multipleOrderItemsSelection.length > 1">
        This order has more than 1 item available in Sort area (total: {{this.multipleOrderItemsSelection.length}})<br>
        <strong>
          Choose appropriate packaging size to pack multiple items from an Order together (as possible), else you can pack individual items also.
        </strong>
        <br><br>
        Choose items to be packed together (else select only one):
        <CMultiSelect :options="this.multipleOrderItemsSelection" :multiple="true" v-on:change="this.captureItemsSelection($event)" />
      </CAlert>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" @click="this.clearMultiSelection()">Cancel</CButton>
      <CButton color="primary" @click="this.continuePacking()">Continue</CButton>
    </CModalFooter>

  </CModal>

  <!-- Modal shipping label -->
  <CModal alignment="center" backdrop="static" :visible="this.viewModalShippingLabel">

    <CModalHeader dismiss color="bg-primary">
      <CModalTitle>
        Print shipping label
      </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CAlert color="warning" v-if="this.shippingLabelData" class="text-center">
        <span class="h4">
          <strong>
            Ensure you've printed and pasted Shipping label on the Package
          </strong>
        </span>
      </CAlert>
      <span class="text-center">
        <p class="text-medium-emphasis small mb-0">AWB Number:</p>
        <h3 class="mb-3">
          {{this.shippingLabelData.awbNumber}}
        </h3>
        <br>
        <CNavLink v-if="this.shippingLabelURL" :href=this.shippingLabelURL target="_blank" active>
          <CButton color="primary">Print shipping label</CButton>
        </CNavLink>
      </span>
    </CModalBody>

    <CModalFooter>
      
      <CButton color="secondary" @click="this.clearShippingLabel()">Close</CButton>
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

      // packing & selection modal
      viewModalPacking: false,
      viewModalMultiSelection: false,

      // packing selection data
      selectedItemsPacking: [],
      selectedOrderId: null,
      selectedOrderIdDetails: null,
      multipleOrderItemsSelection: [],
      multipleItemsSelected: [],
      invoiceURL: null,
      shippingLabelURL: null,

      // payload schema
      packingPayloadSchema: {
        matchSKU: null,
        scannedSKU: null,
        matchSKUVariant: null,
        matchQuantity: null,
        matchPrice: null,
        matchImage: null,
        awbNumber: null,
      },

      // package scheme & data
      packagePayload: null,
      packagePayloadSchema: {
        weight: null,
        dimension: {
          width: null,
          height: null,
          length: null,
        },
        invoiceInserted: null,
        checkPackageIntegrity: null,
      },

      // Shipping label modal
      viewModalShippingLabel: false,

      // shipping label data
      shippingLabelData: null,
      
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

    getSelectedOrderDetails(orderId) {
      axios.get(this.APIHOST + '/infra/getOrderItems/', {
        params: {
          order_id: orderId,
          page_seq: 1,
          page_size: 1000,
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.selectedOrderIdDetails = response.data.response.payloads[0]
      })

    },

    initiatePacking(orderId) {
      this.selectedOrderId = orderId
      this.selectedItemsPacking = []

      // get selected order details
      this.getSelectedOrderDetails(orderId)

      if (this.allItemsOrderArranged[orderId].length == 1) {
        this.selectedItemsPacking = this.allItemsOrderArranged[orderId]
        this.selectedItemsPacking[0]['packingPayload'] = this.packingPayloadSchema
        this.selectedItemsPacking[0]['packingPayload'].matchSKU = this.allItemsOrderArranged[orderId][0].itemPayload.sku
        this.packagePayload = this.packagePayloadSchema
        this.invoiceURL = '/#/print/invoice?orderId=' + orderId + '&items=' + this.selectedItemsPacking[0].id
        this.viewModalPacking = true
      }

      else if (this.allItemsOrderArranged[orderId].length > 1) {
        this.multipleOrderItemsSelection = []
        for (let itemCounter = 0; itemCounter < this.allItemsOrderArranged[orderId].length; itemCounter++) {

          let itemSelectOption = {
            value: this.allItemsOrderArranged[orderId][itemCounter].id,
            text: "SKU: " + this.allItemsOrderArranged[orderId][itemCounter].itemPayload.sku + ", " + this.allItemsOrderArranged[orderId][itemCounter].itemPayload.title + ", " + this.allItemsOrderArranged[orderId][itemCounter].itemPayload.variantTitle + ", Quantity (" + this.allItemsOrderArranged[orderId][itemCounter].itemPayload.quantity + ")"
          }

          this.multipleOrderItemsSelection.push(itemSelectOption)
        }

        this.viewModalMultiSelection = true
        // wait for user to select multiple items
      }
      
    },

    captureItemsSelection(event) {
      this.multipleItemsSelected = []
      for (let selectionIndex = 0; selectionIndex < event.length; selectionIndex++) {
        this.multipleItemsSelected.push(event[selectionIndex].value)
      }

      // console.log(this.multipleItemsSelected)
    },

    continuePacking() {

      if (this.multipleItemsSelected.length < 1) {
        alert("You've not selected any item. Select from drop-down to continue.")
      } else {

        for (let selectedItemCounter = 0; selectedItemCounter < this.multipleItemsSelected.length; selectedItemCounter++) {

          var selectedItem = this.allItemsOrderArranged[this.selectedOrderId].filter(item => item.id == this.multipleItemsSelected[selectedItemCounter])[0]

          var packingPayload = Object.assign({}, this.packingPayloadSchema)
          const sku = selectedItem.itemPayload.sku
          packingPayload.matchSKU = sku

          selectedItem['packingPayload'] = packingPayload

          this.selectedItemsPacking.push(selectedItem)
        }

        this.packagePayload = this.packagePayloadSchema
        this.invoiceURL = '/#/print/invoice?orderId=' + this.selectedOrderId + '&items=' + this.multipleItemsSelected.join("^^")
        this.viewModalMultiSelection = false
        this.viewModalPacking = true
      }

    },

    clearPacking() {
      this.viewModalPacking = false
      this.selectedOrderId = null
      this.selectedOrderIdDetails = null
      this.packagePayload = null
      this.selectedItemsPacking = []
      this.multipleOrderItemsSelection = []
      this.invoiceURL = null
    },

    clearMultiSelection() {
      this.viewModalMultiSelection = false
      this.multipleItemsSelected = []
      this.clearPacking()
    },

    clearShippingLabel() {
      this.viewModalShippingLabel = false
      this.shippingLabelData = null
      this.shippingLabelURL = null
      this.clearMultiSelection()
      this.reloadPage()
    },

    showShippingLabel() {
      this.viewModalShippingLabel = true
    },

    completePacking() {
      console.log(this.selectedItemsPacking)

      let mismatch = false
      let mismatch_sku = ''
      let ship_items = [];

      for (let counter = 0; counter < this.selectedItemsPacking.length; counter++) {
        
        // collate ship items in array for shipping package
        ship_items.push(this.selectedItemsPacking[counter].id)

        if (this.selectedItemsPacking[counter].packingPayload.matchSKU != this.selectedItemsPacking[counter].packingPayload.scannedSKU) {
          mismatch = true
          mismatch_sku = this.selectedItemsPacking[counter].packingPayload.matchSKU
          break 
        } 
      }

      if(mismatch == true) {
        alert('Scanned SKU/Variant does not match. \n\nPlease cross-check SKU/Variant before packing.\n\nReference SKU: ' + mismatch_sku)

      } else {

        // create shipping payload
        let createShippingPayload = {
          orderId: this.selectedOrderId,
          orderItems: ship_items,
          direction: "OUT",
          payload: {
            from: {
              vendor: this.selectedOrderIdDetails.vendor,
            },
            to: this.selectedOrderIdDetails.customer
          }
        }

        axios.post(this.APIHOST + '/infra/createShipping/', createShippingPayload, {
          headers: this.headers
        })
        .then(response => {
          console.log(response.data.response)
          this.shippingLabelData = response.data.response

          // update status packed for each items
          for (let counter = 0; counter < this.selectedItemsPacking.length; counter++) {

            // TODO: attach shipping awb with packing payload?

            let submitPayload = {
              rowId: this.selectedItemsPacking[counter].id,
              newStatus: 'packed',
              payload: this.selectedItemsPacking[counter].packingPayload,
            }

            submitPayload.payload.awbNumber = this.shippingLabelData.awbNumber
            this.shippingLabelURL = '#/print/shipping-label?orderId=' + this.selectedOrderId + '&awb=' + this.shippingLabelData.awbNumber

            console.log(submitPayload)

            axios.post(this.APIHOST + '/infra/updateOrderItemByRowId/', submitPayload, {
              headers: this.headers
            })
            .then(response => {
              // console.log(response.data.response)
              // if (alert("Items packed")) {} 
              // else {
              //   this.clearMultiSelection()
              //   this.reloadPage() 
              // }
            })
            .catch(error => {
              alert(JSON.stringify(error.response.data))
              console.log(error)
            })

          }

          // show shipping label
          this.showShippingLabel()
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })        
        
      }
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
          // console.log(this.allItems[counter])
          let orderId = this.allItems[counter]['orderId'].toString()

          if (this.allItemsOrderArranged[orderId] == undefined) {
            this.allItemsOrderArranged[orderId] = [this.allItems[counter]]
          } else {
            let existing_items = this.allItemsOrderArranged[orderId]
            existing_items.push(this.allItems[counter])
            this.allItemsOrderArranged[orderId] = existing_items
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