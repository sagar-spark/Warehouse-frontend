<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Inventory Stock-in</h2>
    </CCol>
  </CRow>

  <CRow v-if="this.allGrn">
    <CCol :xs="12">
      <CCard class="mb-3">
        <CCardHeader>
          <strong><span class="h4">{{Number(this.totalCount)}}</span> Pending GRNs for Stock-in</strong>
        </CCardHeader>
        <CCardBody>
          <CRow class="mb-2">
            <CCol :md="12">
              <CMultiSelect :options="this.allGrnMultiSelectOptions" :multiple="false" v-on:change="getGrnDetails($event)" />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>

    <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

      <CCol :xs="12" class="mb-4" v-if="this.acceptedGrnItems">

        <CCard class="mb-3">
          <CCardHeader>
            <CRow>
              <!-- <CCol :xl="2" :xm="4" :xs="5">
                <CCardImage orientation="top" :src=this.acceptedGrnItems.bar_code />
              </CCol>
              <CCol :xl="1" :xm="1" :xs="1">
              </CCol> -->
              <CCol :md="4">
                <p class="text-medium-emphasis mb-0">Shipment Type</p>
                <h3>{{this.acceptedGrnItems.shipmentType}}</h3>
              </CCol>

              <CCol :md="3">
                <p class="text-medium-emphasis mb-0">Total items</p>
                <h3>{{this.acceptedGrnItems.items.length}}</h3>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>

            <CAlert color="warning">
              <h5 class="mb-1">Shipping / Handling instructions</h5>
              <p class="text-medium-emphasis mb-1">
                {{this.selectedAsnDetails.payload.shippingInstructions}}
              </p>
            </CAlert>

            <!-- <div v-for="pallet in this.selectedGrnDetails.payload.pallets"> -->
              <!-- <div v-for="item in pallet.packages"> -->
              <div v-for="(item, counter) in this.acceptedGrnItems.items">
                
                <CCard text-color="dark" class="mb-3 border border-secondary">
                  <CCardHeader>
                    <CRow>
                      <CCol :xl="4" :xm="4" :xs="12">
                        <p class="text-medium-emphasis mb-0">SKU</p>
                        <h5>{{item.skuNumber}}</h5>
                        <CNavLink :href="'/#/print/sku-barcode?barcodePath=' + item.barcode" target="_blank">
                          <CIcon icon="cil-print" />
                        </CNavLink>
                      </CCol>
                      <CCol :xl="4" :xm="4" :xs="6">
                        <p class="text-medium-emphasis mb-0">Weight</p>
                        <span v-if="item.payload.packageWeight">
                          <h5>{{item.payload.packageWeight}}</h5>
                        </span>
                        <span v-else>
                          Not provided
                        </span>
                      </CCol>
                      <CCol :xl="4" :xm="4" :xs="6">
                        <p class="text-medium-emphasis mb-0">Dimension</p>
                        <span v-if="item.payload.packageDimensions">
                          <h5>{{item.payload.packageDimensions}}</h5>
                        </span>
                        <span v-else>
                          Not provided
                        </span>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol :xl="4" :xm="4" :xs="12" class="mb-3">
                        <p class="text-medium-emphasis mb-0">SKU Description</p>
                        <h5>{{item.payload.packageDescription}}</h5>

                        <p class="text-medium-emphasis mb-0">Quantity</p>
                        <h5>{{item.currentQuantity}}</h5>
                      </CCol>

                      <CCol :xl="4" :xm="4" :xs="12" class="mb-3">
                        <p class="text-medium-emphasis mb-0">Batch Number (Update as needed)</p>
                        <CFormInput class="mb-4" type="input" :value="item.batchNumber" v-model="item.batchNumber" required/>

                        <p class="text-medium-emphasis mb-0">Expiry Date (Update as needed)</p>
                        <CDatePicker :value="item.payload.packageExpiryDate" v-model="item.payload.packageExpiryDate" footer locale="en-US" />
                        <!-- <CFormInput class="mb-4" type="input" :value="item.payload.packageExpiryDate" v-model="item.payload.packageExpiryDate" required/> -->
                      </CCol>

                      <CCol :xl="4" :xm="4" :xs="12">
                        
                        <p class="text-medium-emphasis mb-0">Choose applicable location type</p>
                        <CFormSelect class="mb-4" v-model="item.locationTypeConcatenated" v-on:input="getShelves($event)" required>
                          <option value="">Choose</option>
                          <option v-for="location_code of Object.keys(this.locationTypes)" :value="location_code.concat(';|;', item.skuNumber, ';|;', this.acceptedGrnItems.grnId, ';|;', counter)">{{this.locationTypes[location_code]}} ({{location_code}})</option>
                        </CFormSelect>

                        <p class="text-medium-emphasis mb-0" v-if="item.locationTypeConcatenated">Choose nearest Shelf OR Assign manually</p>

                        <CFormSelect v-model="item.allocatedShelfId" v-if="item.locationTypeConcatenated" required>
                          <option value="">Choose</option>
                          
                          <optgroup label="Enter manually">
                            <option value="manual">Scan during Shelving (Placement)</option>
                          </optgroup>
                          
                          <optgroup :label="'Same SKU shelves ('.concat(item.allShelves.sameSkuLocations.length, ' shelves found)')" v-if="item.allShelves">
                            <option v-for="shelf in item.allShelves.sameSkuLocations" :value=shelf.qualifiedName>{{shelf.qualifiedName}}</option>
                          </optgroup>
                          
                          <optgroup :label="'Same Vendor shelves ('.concat(item.allShelves.sameVendorLocations.length, ' shelves found)')" v-if="item.allShelves">
                            <option v-for="shelf in item.allShelves.sameVendorLocations" :value=shelf.qualifiedName>{{shelf.qualifiedName}}</option>
                          </optgroup>

                          <optgroup :label="'Empty shelves ('.concat(item.allShelves.emptyLocations.length, ' shelves found)')" v-if="item.allShelves">
                            <option v-for="shelf in item.allShelves.emptyLocations" :value=shelf.qualifiedName>{{shelf.qualifiedName}}</option>
                          </optgroup>

                          <optgroup :label="'Partially occupied shelves ('.concat(item.allShelves.partialOccupiedLcoations.length, ' shelves found)')" v-if="item.allShelves">
                            <option v-for="shelf in item.allShelves.partialOccupiedLcoations" :value=shelf.qualifiedName>{{shelf.qualifiedName}}</option>
                          </optgroup>

                        </CFormSelect>

                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

              </div> 
            <!-- </div> -->

            <CButton color="primary" type="submit">Complete Stock-in</CButton>

          </CCardBody>
        </CCard>
      </CCol>

    </CForm>
  </CRow>
</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'
import {validateSessionEnhanced} from '@/store/session'


export default {
  name: "Inventory Stock-in",
  
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
      totalCount: null,
      allGrn: null,
      allGrnMultiSelectOptions: [],

      // Selected GRN number
      selectedGRN: null,
      selectedGrnDetails: null,
      selectedAsnDetails: null,
      acceptedGrnItems: null,

      locationTypes: { 
        "GNRL": "General storage",
        "CLDS": "Cold Storage",
        "PLTA": "Pallet area",
        "TMPS": "Temporary storage",
      }, // end location types

      location: null,

      
    }
  }, //end of Data

  methods: {
    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.confirmStockIn()
      }
      this.validatedCustom01 = true
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
        this.totalCount = response.data.response.totalCount
        this.allGrn = response.data.response.payloads

        // prepare multi select options
        for (let counter=0; counter<this.allGrn.length; counter++) {
          let selectOption = {
            value: this.allGrn[counter].grnId,
            text: this.allGrn[counter].grnId
          }

          this.allGrnMultiSelectOptions.push(selectOption)
        }
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
      
    },

    getGrnDetails(event) {

      let grnId = event[0].value

      axios.get(this.APIHOST + '/inbound/get-grn/', {
        params: {
          id: grnId
        },
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.selectedGrnDetails = response.data.response.grn
        this.selectedAsnDetails = response.data.response.asn

        // Build Accepted GRN items details
        this.acceptedGrnItems = {
          step: "StockIn", // One of: StockIn, Transport, Shelving
          asnId: this.selectedGrnDetails.asnId,
          grnId: this.selectedGrnDetails.grnId,
          shipmentType: this.selectedAsnDetails.payload.shipToDetails.shipmentType,
          bar_code: this.selectedGrnDetails.payload.barcode,
          vendorId: this.selectedGrnDetails.vendorId,
          items: []
        }

        let numPallets = this.selectedGrnDetails.confirmPayload.payload.pallets.length
        for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
          let numPackages = this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages.length
          for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {

            // Check accept quantity
            let acceptQuantity = this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].qc.acceptQuantity
            let grnConfirmAction = this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].grnConfirm.action

            // Do not include any rejects - IMPORTANT
            if (acceptQuantity !== null && acceptQuantity !== "" && grnConfirmAction == "Approve") {
              let package_item = {
                skuNumber: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageSKU,
                currentQuantity: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].qc.acceptQuantity,
                batchNumber: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageBatchNumber,
                variantId: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].variantId,
                productId: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].productId,
                barcode: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].barcode,

                // payload for additional data related to SKU
                payload: {
                  packageDescription: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageDescription,
                  packageExpiryDate: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageExpiryDate,
                  packageDimensions: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageDimensions,
                  packageWeight: this.selectedGrnDetails.confirmPayload.payload.pallets[palletIndex].packages[packageIndex].packageWeight,

                },
                
                // allocated data
                allShelves: null,  // hold plausible shelves from API call
                locationTypeConcatenated: null,
                
                locationType: null,
                
                // allocate now got shelving
                allocatedShelfId: null,  // TODO: array
                allocatedBinId: null,  // TODO: array

                // transport data - future use for shelving transportation
                transportTrolleyId: null,
                transportBinId: null,

                // confirmed data - future use for shelving confirmation
                confirmedShelfId: null,
                confirmedBinId: null,
                

                // add boxSeq to handle duplicate SKUs across boxes
                boxSeq: "".concat(palletIndex, ":", packageIndex, "-1")
              }

              // add this package / item to accepted GRN items to be stocked in
              this.acceptedGrnItems.items.push(package_item)
            }

          }
        }

        console.log(this.acceptedGrnItems)

      })
      .catch(error => {
        console.log(error)
        alert(JSON.stringify(error.response.data))
      })
      
    },

    getShelves(event) {

      let selectedDetails = event.target.value
      if (selectedDetails !== "") {
        let selectedDetailsDelimited = selectedDetails.split(";|;")
        let storageType = selectedDetailsDelimited[0]
        let skuId = selectedDetailsDelimited[1]
        let grnId = selectedDetailsDelimited[2]
        let itemIndex = selectedDetailsDelimited[3]

        axios.post(this.APIHOST + '/infra/getShelvingShelves/', {
          storageType: storageType,
          skuId: skuId,
          grnId: grnId,
        }, {
          headers: this.headers
        })
        .then(response => {
          console.log(response.data.response)
          this.acceptedGrnItems.items[itemIndex].allShelves = response.data.response
          
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })
      }

    },

    confirmStockIn() {

      // modify locationType to exclude comcatenation of SKU Number & GRN for processing of getShelves API

      let numberItems = this.acceptedGrnItems.items.length

      for (var itemIndex=0; itemIndex<numberItems; itemIndex++) {
        let locationTypeDelimited = this.acceptedGrnItems.items[itemIndex].locationTypeConcatenated.split(";|;")
        let storageType = locationTypeDelimited[0]

        // assign locationType back
        this.acceptedGrnItems.items[itemIndex].locationType = storageType

        //delete xtra keys
        delete this.acceptedGrnItems.items[itemIndex].allShelves
        delete this.acceptedGrnItems.items[itemIndex].locationTypeConcatenated
      }

      console.log(this.acceptedGrnItems)
      console.log(JSON.stringify(this.acceptedGrnItems))
      
      axios.post(this.APIHOST + '/infra/addShelvingLog/', this.acceptedGrnItems, { 
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        if (alert("Stock-in of " + this.acceptedGrnItems.grnId + " with " + this.acceptedGrnItems.items.length + " items successful")) {} 
        else {
          this.reloadPage() 
        }
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
    this.getAllGrnDetails()
  }, // end created

  beforeCreate() {
    validateSession(this.$router)
    // validateSessionEnhanced(this.$router, this.$route.query.page)
  }, // end beforeCreate

}

</script>


<style scoped>

</style>