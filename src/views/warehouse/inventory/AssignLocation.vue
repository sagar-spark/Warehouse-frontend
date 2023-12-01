<template>

  <CRow class="mb-4">
    <CCol :md="12">
      <h2 class="mb-0">Assign Location</h2>
      <p class="text-medium-emphasis mb-0">Assign location for items which have been Quality-checked & sorted after GRN creation</p>
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol :md="12">
      <CAlert color="info" v-if="this.acceptedGrnItems.length >= 0" class="mb-0 p-3">
        <strong>{{this.acceptedGrnItems.length}}</strong> items pending for Location assignment (Stock-in, Transport & Shelving need not be carried out separately now)
      </CAlert>
      <CAlert v-else class="mb-0">
        <CSpinner size="sm" color="primary" /> 
      </CAlert>
    </CCol>
    <CCol :md="12" class="mt-2">
      <CAlert color="warning" class="mb-0 p-3">
        If you have a GRN created / approved recently and items do not appear here, click Refresh below. Items may take up to a minute to appear on Assign Location stage.
      </CAlert>
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol :md="12">
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol :md="9">
              <strong>All items for location assignment</strong>
            </CCol>
            <CCol :md="3" class="text-end">
              <CButton color="primary" size="sm" v-on:click="this.reloadPage()">Refresh</CButton>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          <span v-if="this.acceptedGrnItems.length < 0">
            <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading items...
          </span>
          <CSmartTable
            cleaner
            :columns="this.acceptedGrnItemsTableColumns"
            header
            :items-per-page="50"
            items-per-page-select
            :items="this.acceptedGrnItems"
            pagination
            columnSorter
            table-filter
            :table-props="{
              hover: true,
            }"
            v-if="this.acceptedGrnItems.length >= 0"
          >
            <template #itemDetails="{ item }">
              <td>
                <strong>GRN: </strong>{{item.grnId}}<br>
                <strong>SKU: </strong>{{item.skuNumber}}<br>
                <strong>Desc: </strong>{{item.payload.packageDescription}}<br>
                <strong>Quantity: </strong>{{item.currentQuantity}}
              </td>
            </template>

            <template #actions="{ item }">
              <td>
                <CButton color="primary" size="sm" v-on:click="this.showModalAssignLocation(item)">Assign</CButton>
              </td>
            </template>

          </CSmartTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <!-- Modal for Assign location -->
  <CModal alignment="center" size="lg" backdrop="static" :visible="this.viewModalAssignLocation" @close="this.clearModalAssignLocation()">
    <CModalHeader dismiss color="bg-primary" @close="this.clearModalAssignLocation()">
      <CModalTitle>Assign location</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">
        <CAlert color="primary" class="mb-3">
          <CRow class="mb-1">
            <CCol :sm="ms-auto" class="mb-2">
              SKU<br>
              <span class="h4">{{this.selectedItem.skuNumber}}</span>
            </CCol>
            <CCol :sm="auto" class="mb-2">
              Item name / Description<br>
              <span class="h4">{{this.selectedItem.payload.packageDescription}}</span>
            </CCol>
          </CRow>
          <CRow class="mb-0">
            <CCol :sm="auto" class="mb-2">
              GRN<br>
              <span class="h4">{{this.selectedItem.grnId}}</span>
            </CCol>
            <CCol :sm="auto" class="mb-2">
              Quantity<br>
              <span class="h4">{{this.selectedItem.currentQuantity}}</span>
            </CCol>
          </CRow>
        </CAlert>
        <CCard text-color="dark" class="mb-3 border border-primary">
          <CCardHeader>
            <strong>Scan Shelf location & Bin</strong>
          </CCardHeader>
          <CCardBody>
            <CRow class="mb-2">
              <CCol :md="6">
                <p class="text-medium-emphasis mb-1">Batch number (mandatory)</p>
                <CFormInput class="mb-1" type="input" :value="this.selectedItem.batchNumber" v-model="this.selectedItem.batchNumber" required/>
              </CCol>
              <CCol :md="6">
                <p class="text-medium-emphasis mb-1">Expiry date (optional)</p>
                <CDatePicker class="mb-1" :value="this.selectedItem.payload.packageExpiryDate" v-model="this.selectedItem.payload.packageExpiryDate" footer locale="en-US" />
              </CCol>
            </CRow>

            <CRow>
              <CCol :md="6">
                <p class="text-medium-emphasis mb-1">Shelf location (mandatory)</p>
                  <CInputGroup class="mb-1">
                    <CInputGroupText>
                      <CIcon icon="cil-barcode" />
                    </CInputGroupText>
                    <CFormInput v-model="this.selectedItem.confirmedShelfId" placeholder="Scan shelf location" required />
                  </CInputGroup>
                  <!-- <br><br>
                  <CMultiSelect v-if="this.allShelvesSelectOptions.length > 0" :options="this.allShelvesSelectOptions" :multiple="false" v-model="this.selectedItem.confirmedShelfId" required v-on:change="assignShelfValue($event)" />
                  <span v-if="this.allShelvesSelectOptions.length == 0">
                    <CSpinner size="sm" color="primary" />
                    &nbsp; Loading...
                  </span> -->
              </CCol>
              <CCol :md="6">
                <p class="text-medium-emphasis mb-1">Bin location (optional)</p>
                  <CInputGroup class="mb-1">
                    <CInputGroupText>
                      <CIcon icon="cil-barcode" />
                    </CInputGroupText>
                    <CFormInput v-model="this.selectedItem.confirmedBinId" placeholder="Scan bin location" />
                  </CInputGroup>
                  <!-- <br><br>
                  <CMultiSelect v-if="this.allBinsSelectOptions.length > 0" :options="this.allBinsSelectOptions" :multiple="false" v-model="this.selectedItem.confirmedBinId"  v-on:change="assignBinValue($event)" />
                  <span v-if="this.allBinsSelectOptions.length == 0">
                    <CSpinner size="sm" color="primary" /> 
                    &nbsp; Loading...
                  </span> -->
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CRow>
          <CCol :md="12">
            <CButton color="primary" type="submit">Assign Location</CButton>
          </CCol>
        </CRow>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="this.clearModalAssignLocation()">Close</CButton>
    </CModalFooter>
  </CModal>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'
import {validateSessionEnhanced} from '@/store/session'


export default {
  name: "Inventory Assign Location",
  
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

      // All Grn details area
      allGrn: null,

      // Selected GRN number
      acceptedGrnItems: [],
      acceptedGrnItemsTableColumns: [
        { key: 'itemDetails',  label: 'Item details', },
        // { key: 'grnId',  label: 'GRN', },
        // { key: 'skuNumber',  label: 'SKU', },
        // { key: 'sku_description',  label: 'Description', },
        // { key: 'quantity',  label: 'Quantity', },
        { key: 'actions',  label: 'Assign', },
      ],

      locationTypes: { 
        "GNRL": "General storage",
        "CLDS": "Cold Storage",
        "PLTA": "Pallet area",
        "TMPS": "Temporary storage",
      }, // end location types

      selectedItem: null,

      allShelves: null,
      allShelvesSelectOptions: [],
      allBins: null,
      allBinsSelectOptions: [],

      // modal assign location
      viewModalAssignLocation: false,
    }
  }, //end of Data

  methods: {
    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.confirmShelvingIndividualItems()
      }
      this.validatedCustom01 = true
    },

    clearModalAssignLocation() {
      this.viewModalAssignLocation = false
      this.selectedItem = null
      this.allShelvingItems = null
    },

    showModalAssignLocation(item) {
      this.selectedItem = item
      console.log(this.selectedItem)
      this.viewModalAssignLocation = true
    },

    assignShelfValue(event) {
      this.selectedItem.items[0].confirmedShelfId = event[0].value
      this.selectedItem.items[0].allocatedShelfId = event[0].value
    },

    assignBinValue(event) {
      this.selectedItem.items[0].confirmedBinId = event[0].value
      this.selectedItem.items[0].allocatedBinId = event[0].value
    },

    getAllGrnDetails() {

      axios.get(this.APIHOST + '/inbound/get-all-grn/', {
        params: {
          grnConfirmed: true,
          stageStockIn: 'ToStock',
          // page_seq
          // page_size
        },
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.allGrn = response.data.response.payloads

        // Add GRN Shelving log and total count
        for (let counter=0; counter<this.allGrn.length; counter++) {

          console.log("Loop GRN: " + this.allGrn[counter].grnId)
          
          // prepare shelving payload
          let payloadShelving = {
            step: "Created",
            asnId: this.allGrn[counter].asnId,
            grnId: this.allGrn[counter].grnId,
            vendorId: this.allGrn[counter].vendorId,
            shipmentType: null,
            bar_code: this.allGrn[counter].confirmPayload.payload.barcode,
            items: [],
          }

          let numPallets = this.allGrn[counter].confirmPayload.payload.pallets.length
          for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
            let numPackages = this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages.length

            // loop through items and add only GRN approved items which were accepted / partially accepted
            for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {
              
              let grnConfirm_action = this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex]['grnConfirm'].action
              let qc_action = this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex]['qc'].actionQC
              let acceptQuantity = this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].qc.acceptQuantity

              console.log('grn confirm action: ' + grnConfirm_action)
              console.log('grn action qc: ' + qc_action)
              console.log('acceptQuantity' + acceptQuantity)

              if (grnConfirm_action == 'Approve' && (qc_action == 'Accept complete package' || qc_action == 'Partial accept') && acceptQuantity !== null && acceptQuantity !== "" && acceptQuantity > 0) {

                  let itemToShelve = {
                    skuNumber: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageSKU,
                    currentQuantity: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].qc.acceptQuantity,
                    batchNumber: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageBatchNumber || "",
                    variantId: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].variantId,
                    productId: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].productId,
                    barcode: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].barcode,

                    payload: {
                      packageDescription: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageDescription,
                      packageExpiryDate: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageExpiryDate,
                      packageDimensions: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageDimensions,
                      packageWeight: this.allGrn[counter].confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageWeight,
                    }, 

                    // add boxSeq to handle duplicate SKUs across boxes
                    boxSeq: "".concat(palletIndex, ":", packageIndex, "-1")

                    // locationm shelves and bin details

                    // locationType: null,
                    
                    // // allocate now got shelving
                    // allocatedShelfId: null,  // TODO: array
                    // allocatedBinId: null,  // TODO: array

                    // // transport data - future use for shelving transportation
                    // transportTrolleyId: null,
                    // transportBinId: null,

                    // // confirmed data - future use for shelving confirmation
                    // confirmedShelfId: null,
                    // confirmedBinId: null,

                  }

                  payloadShelving.items.push(itemToShelve)
              }

            } // end of package item loop

          }

          console.log(payloadShelving)

          // Call - Add Shelving Log (Created) API
          // (payloadShelving.items.length == 0) -- this condition is removed to allow GRNs to close which has all rejected items, else they will be dangling

            axios.post(this.APIHOST + '/infra/addShelvingLog/', payloadShelving, { 
              headers: this.headers
            })
            .then(response => {
              console.log(response.data.response)
            })
            .catch(error => {
              alert(JSON.stringify(error.response.data))
              console.log(error)
            })
          
        }

      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

      // get Shelving Logs with Created status
      axios.post(this.APIHOST + '/infra/getShelvingLog/', {
        "steps": ["Created"]
      }, {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.acceptedGrnItems = response.data.response
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
      
    },

    getAllShelvesBins() {
      // Shelves
      axios.get(this.APIHOST + '/infra/get-all-warehouse-objects/', {
        params: {
          type: 'Shelves'
        },
        headers: this.headers,
      })
      .then(response => {
        if (response.status == 200) {
          this.allShelves = response.data.response
          console.log(response.data.response)

          // prepare multi select options & entire list 
          
            for (let counter = 0; counter<this.allShelves.length; counter++) {
              
              let selectOption = {
                value: this.allShelves[counter].id,
                text: this.allShelves[counter].qualifiedName,
              }

              this.allShelvesSelectOptions.push(selectOption)
            }

            console.log(this.allShelvesSelectOptions)
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.response))
        console.log(error)
      })

      // Bins
      axios.get(this.APIHOST + '/infra/get-all-warehouse-objects/', {
        params: {
          type: 'Bin'
        },
        headers: this.headers,
      })
      .then(response => {
        if (response.status == 200) {
          this.allBins = response.data.response
          console.log(response.data.response)

          // prepare multi select options & entire list 
          
            for (let counter = 0; counter<this.allBins.length; counter++) {
              
              let selectOption = {
                value: this.allBins[counter].id,
                text: this.allBins[counter].qualifiedName,
              }

              this.allBinsSelectOptions.push(selectOption)
            }

            console.log(this.allBinsSelectOptions)
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.response))
        console.log(error)
      })
    },

    confirmShelvingIndividualItems() {
      // map allocated and transport shelf / bin ids
      this.selectedItem.allocatedShelfId = this.selectedItem.confirmedShelfId
      this.selectedItem.allocatedBinId = this.selectedItem.confirmedBinId

      // location type
      if (this.selectedItem.confirmedShelfId.search('GNRL') > 1) {
        this.selectedItem.locationType = 'GNRL'
      } else if (this.selectedItem.confirmedShelfId.search('CLDS') > 1) {
        this.selectedItem.locationType = 'CLDS'
      } else if (this.selectedItem.confirmedShelfId.search('PLTA') > 1) {
        this.selectedItem.locationType = 'PLTA'
      } else if (this.selectedItem.confirmedShelfId.search('TMPS') > 1) {
        this.selectedItem.locationType = 'TMPS'
      }

      // add Shelving & update stock (final step: Shelving)
      // prepare payload
      let shelvingItemPayload = {
        step: "Shelving",
        asnId: this.selectedItem.asnId,
        grnId: this.selectedItem.grnId,
        vendorId: this.selectedItem.vendorId,
        warehouseId: this.selectedItem.warehouseId,

        items: [
          {
            logId: this.selectedItem.id,
            skuNumber: this.selectedItem.skuNumber,
            variantId: this.selectedItem.variantId,
            currentQuantity: this.selectedItem.currentQuantity,
            batchNumber: this.selectedItem.batchNumber,

            payload: this.selectedItem.payload,
            locationType: this.selectedItem.locationType,
            
            allocatedBinId: this.selectedItem.allocatedBinId,
            allocatedShelfId: this.selectedItem.allocatedShelfId,

            transportBinId: this.selectedItem.transportBinId,
            transportTrolleyId: this.selectedItem.transportTrolleyId,

            confirmedBinId: this.selectedItem.confirmedBinId,
            confirmedShelfId: this.selectedItem.confirmedShelfId,

          }
        ],
      }
      console.log(shelvingItemPayload)

      axios.post(this.APIHOST + '/infra/addShelvingLog/', 
        shelvingItemPayload, { 
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        if (alert("Location assigned & inventory added")) {} 
        else {
          this.clearModalAssignLocation()
          this.reloadPage() 
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

      this.clearModalAssignLocation()
    },

    reloadPage() {
      location.reload()
    },


  }, // end of methods

  created() {
    this.getAllGrnDetails()
    // this.getAllShelvesBins()
  }, // end created

  beforeCreate() {
    validateSession(this.$router)
    // validateSessionEnhanced(this.$router, this.$route.query.page)
  }, // end beforeCreate

}

</script>


<style scoped>

</style>