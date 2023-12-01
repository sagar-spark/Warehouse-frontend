<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2 class="mb-0">Create GRN</h2>
      <h6>ASN Sorting & Quality Check</h6>
    </CCol>
  </CRow>

  <CCard class="mb-3">
    <CCardHeader>
      <strong><span v-if="this.totalCount" class="h5">{{Number(this.totalCount)}}</span> ASN pending for QC</strong>
    </CCardHeader>

   <CCardBody>

      <CRow>
          <CCol :md="12">
            <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" width="10%">Bar code</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Created</CTableHeaderCell>
                    <!-- <CTableHeaderCell scope="col">User</CTableHeaderCell> -->
                    <CTableHeaderCell scope="col">Ship From</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shipment Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ship To</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Courier details</CTableHeaderCell>
                    <!-- <CTableHeaderCell scope="col"># Pallets</CTableHeaderCell> -->
                    <CTableHeaderCell scope="col">QC</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  <CTableRow v-for="asn in this.allAsn" @click="this.initiateQcOnClick(asn.asnId)">
                    <CTableDataCell scope="col" class="text-center">
                      {{asn.asnId}}
                      <br>
                      <!-- <CCardImage orientation="top" :src="`data:image/png;base64,${asn.b64Image}`" /> -->
                      <CCardImage orientation="top" :src=asn.payload.barcode />
                    </CTableDataCell>
                    <CTableDataCell scope="col">
                      {{asn.createddate}}<br>
                      {{asn.createdtime}}
                    </CTableDataCell>
                    <!-- <CTableDataCell scope="col">{{asn.vendorUser}}</CTableDataCell> -->
                    <CTableDataCell scope="col">
                      <strong>{{asn.payload.shipFromDetails.name}}</strong><br>
                      <span class="text-medium-emphasis small">
                        {{asn.payload.shipFromDetails.address.address}}, 
                        {{asn.payload.shipFromDetails.address.city}}, 
                        {{asn.payload.shipFromDetails.address.zip}}, 
                        {{asn.payload.shipFromDetails.address.state}}, 
                        {{asn.payload.shipFromDetails.address.country}}
                        <br>
                        Email: {{asn.payload.shipFromDetails.address.email}}
                        <br>
                        Phone: {{asn.payload.shipFromDetails.address.phone}}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell scope="col">{{asn.payload.shipToDetails.shipmentType}}</CTableDataCell>

                    <CTableDataCell scope="col" v-if="asn.payload.shipToDetails.retailerDetails">
                      <strong>{{asn.payload.shipToDetails.retailerDetails.payload.name}}</strong><br>
                      <span class="text-medium-emphasis small">
                        {{asn.payload.shipToDetails.retailerDetails.payload.address.addressline}}, 
                        {{asn.payload.shipToDetails.retailerDetails.payload.address.city}}, 
                        {{asn.payload.shipToDetails.retailerDetails.payload.address.zip}}, 
                        {{asn.payload.shipToDetails.retailerDetails.payload.address.state}}, 
                        {{asn.payload.shipToDetails.retailerDetails.payload.address.country}}
                        <br>
                        Email: {{asn.payload.shipToDetails.retailerDetails.payload.email}}
                        <br>
                        Phone: {{asn.payload.shipToDetails.retailerDetails.payload.phone}}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell scope="col" v-if="asn.payload.shipToDetails.warehouseDetails">
                      <strong>{{asn.payload.shipToDetails.warehouseDetails.name}}</strong><br>
                      <span class="text-medium-emphasis small">
                        {{asn.payload.shipToDetails.warehouseDetails.address.address}}, 
                        {{asn.payload.shipToDetails.warehouseDetails.address.city}}, 
                        {{asn.payload.shipToDetails.warehouseDetails.address.zip}}, 
                        {{asn.payload.shipToDetails.warehouseDetails.address.state}}, 
                        {{asn.payload.shipToDetails.warehouseDetails.address.country}}
                        <br>
                        Email: {{asn.payload.shipToDetails.warehouseDetails.contact.email}}
                        <br>
                        Phone: {{asn.payload.shipToDetails.warehouseDetails.contact.phone}}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell scope="col">
                      {{asn.payload.shipmentDetails.courierType}}
                      <br>
                      <br>
                      <span class="text-medium-emphasis small">
                        <span v-if="asn.payload.shipmentDetails.warehouseCourierPickupDate">
                          Pickup date: {{asn.payload.shipmentDetails.warehouseCourierPickupDate}}
                          <br>
                        </span>
                        <span v-if="asn.payload.shipmentDetails.warehouseCourierPickupSlot">
                          Pickup slot: {{asn.payload.shipmentDetails.warehouseCourierPickupSlot}}
                          <br>
                        </span>
                        <span v-if="asn.payload.shipmentDetails.ownShipmentCarrier">
                          Carrier: {{asn.payload.shipmentDetails.ownShipmentCarrier}}
                          <br>
                        </span>
                        <span v-if="asn.payload.shipmentDetails.ownShipmentTrackingNum">
                          Tracking: {{asn.payload.shipmentDetails.ownShipmentTrackingNum}}
                          <br>
                        </span>
                        <span v-if="asn.payload.shipmentDetails.ownShipmentDate">
                          Shipment date: {{asn.payload.shipmentDetails.ownShipmentDate}}
                          <br>
                        </span>
                      </span>
                    </CTableDataCell>

                    <!-- <CTableDataCell scope="col">{{asn.payload.pallets.length}}</CTableDataCell> -->

                    <CTableDataCell scope="col">
                      <CBadge color="success" v-if="asn.grnUpdated === true">Complete</CBadge>
                      <CBadge color="dark" v-else-if="asn.grnUpdated === false">Incomplete</CBadge>
                      <CBadge color="dark" v-else></CBadge>

                      <br><br>
                      <CButton color="primary" size="sm" @click="this.initiateQcOnClick(asn.asnId)">Create GRN</CButton>

                    </CTableDataCell>

                  </CTableRow>

                </CTableBody>
            </CTable>
          </CCol>
          
        </CRow>
    </CCardBody>
  </CCard>

  <!-- Modal for Creation of GRN -->
  <CModal alignment="center" fullscreen backdrop="static" :visible="this.modalViewCreateASN"  @close="this.clearCreateASNModal()">
    <CModalHeader dismiss color="bg-primary" @close="this.clearCreateASNModal()">
      <CModalTitle>
        Quality Check & Create GRN : {{this.asnNumber}}<br>
        <!-- <CInputGroup class="mt-2">
          <CInputGroupText>
            <CIcon icon="cil-barcode" />
          </CInputGroupText>
          <CFormInput placeholder="Scan Barcode" v-model="this.scanbarcode" @keyup.enter="this.incrementOnScan()" autofocus />
        </CInputGroup> -->
      </CModalTitle>
    </CModalHeader>

    <CModalBody>

      <CForm class="needs-validation" novalidate :validated="validatedCustom02" @submit="handleSubmitCustom02" @submit.prevent=";">

      <CRow class="mb-2" v-if="selectedASN">
        <CCol :md="12">          
                  
            <CCard text-color="dark" class="mb-3 border border-dark" v-for="(pallet, counter) in this.selectedASN.payload.pallets" v-bind:key="counter">
              <CCardHeader class="bg-light"><strong>Pallet</strong>: {{pallet.palletNumber}}, <strong>Contents</strong>: {{pallet.palletContents}}</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol :md="3" v-for="(p_package, counter2) in pallet.packages" v-bind:key="counter2">
                    <CCard text-color="dark" class="mb-1 border border-secondary">
                      <CCardHeader class="bg-light">
                        <CRow>
                          <CCol :md="9">
                            <p class="text-medium-emphasis mb-0">SKU / Description</p>
                            <CNavLink :href="'/#/print/sku-barcode?barcodePath=' + p_package.barcode" target="_blank">
                              <h5 class="mb-1">{{p_package.packageSKU}}</h5>
                            </CNavLink>
                            <h6 class="mb-0">{{p_package.packageDescription}}</h6>
                          </CCol>
                          <CCol :md="3">
                            <div class="float-end">
                              <p class="text-medium-emphasis mb-0">Qty</p> 
                              <h4 class="mb-0">{{p_package.packageQuantity}}</h4>
                            </div>
                          </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <CRow class="mb-3">
                          <CCol :md="4">
                            <p class="text-medium-emphasis mb-0">Weight</p> 
                            <h6>{{p_package.packageWeight}}</h6>
                          </CCol>
                          <CCol :md="4">
                            <p class="text-medium-emphasis mb-0">Batch #</p> 
                            <h6>{{p_package.packageBatchNumber}}</h6>
                          </CCol>
                          <CCol :md="4">
                            <p class="text-medium-emphasis mb-0">Expiry Dt</p> 
                            <h6>{{p_package.packageExpiryDate}}</h6>
                          </CCol>
                        </CRow>

                        <CRow>
                          <CCol :md="12">
                            <CFormSelect class="mb-3" v-model="p_package.qc.actionQC" required>
                              <option value="">Choose Quality Check action</option>
                              <option value="Accept complete package">Accept complete package</option>
                              <option value="Reject complete package">Reject complete package</option>
                              <option value="Partial accept">Partial accept</option>
                            </CFormSelect>

                            <CFormSelect class="mb-3" v-model="p_package.qc.reasonReject" required v-if="p_package.qc.actionQC == 'Reject complete package' || p_package.qc.actionQC == 'Partial accept'">
                              <option value="">Choose Reject reason</option>
                              <option v-for="reason in this.rejectReasons" :value=reason>{{reason}}</option>
                            </CFormSelect>
                          </CCol>
                        </CRow>

                        <CRow class="mb-3">
                          <CCol :md="6">
                            <CFormFloating>
                              <CFormInput type="input" v-model="p_package.qc.acceptQuantity" required />
                              <CFormLabel>Accept quantity</CFormLabel>
                            </CFormFloating>
                          </CCol>
                          <CCol :md="6">
                            <CFormFloating>
                              <CFormFloating>
                                <CFormInput type="input" v-model="p_package.qc.rejectQuantity" required />
                                <CFormLabel>Reject quantity</CFormLabel>
                              </CFormFloating>
                            </CFormFloating>
                          </CCol>
                        </CRow>

                        <CRow class="mb-0">
                          <CCol :md="12">
                            <CFormTextarea v-model="p_package.qc.remarksQC" rows="1" placeholder="Remarks (mandatory)" required></CFormTextarea>
                            <CAlert color="danger" class="mt-3 p-2 mb-0" v-if="(p_package.qc.acceptQuantity !== null || p_package.qc.rejectQuantity !== null) && (Number(p_package.packageQuantity) !== (Number(p_package.qc.acceptQuantity) + Number(p_package.qc.rejectQuantity)))">Sum of accept & reject quantities do not match</CAlert>
                            <CAlert color="success" class="mt-3 p-2 mb-0" v-if="(p_package.qc.acceptQuantity !== null || p_package.qc.rejectQuantity !== null) && (Number(p_package.packageQuantity) === (Number(p_package.qc.acceptQuantity) + Number(p_package.qc.rejectQuantity)))">Quantities match</CAlert>
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
      <CRow>
        <CCol :md="12">
          <hr>
          <CButton color="success" @click="this.acceptAllPackages()">Accept All</CButton>&nbsp;&nbsp;
          <CButton color="danger" @click="this.rejectAllPackages()">Reject All</CButton>&nbsp;&nbsp;
          <CButton color="primary" type="submit">Complete QC</CButton>
        </CCol>
      </CRow>

      </CForm> 

    </CModalBody>
    
    <CModalFooter>
      <CButton color="secondary" @click="this.clearCreateASNModal()">Cancel</CButton>
    </CModalFooter>
    
  </CModal>

  <!-- Modal for qualtity / multiple items -->
  <CModal alignment="center" backdrop="static" :visible="this.modalViewScan"  @close="this.clearModalViewScan()">
    <CModalHeader dismiss color="bg-primary" @close="this.clearModalViewScan()">
      <CModalTitle>
        Provide quantity
      </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm class="needs-validation" novalidate :validated="validatedCustom03" @submit="handleSubmitCustom03" @submit.prevent=";">

        <CRow v-if="this.matchCount > 1" class="mb-3">
          <CCol :md="12">
            <CAlert color="warning" class="text-center mb-3">
              <span class="h6">
                <strong>
                  This SKU is present in multiple Pallets / Boxes
                  <br>
                  Need to choose one
                </strong>
              </span>
            </CAlert>
            <CFormSelect required size="lg" v-model="this.selectedPalletIndexFromMultiple">
              <option value="">Choose {{this.selectedASN.payload.packingType}}</option>
              <option v-for="(index, counter) in this.matchindexes" :value="index.join('-')">
                Pallet number: {{this.selectedASN.payload.pallets[index[0]].palletNumber}}, Contents: {{this.selectedASN.payload.pallets[index[0]].palletContents}}
              </option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow>
          <CCol :md="12">
            <CFormLabel>Specify quantity</CFormLabel>
            <CInputGroup class="mt-0">
              <CInputGroupText>
                <CIcon icon="cil-applications" />
              </CInputGroupText>
              <CFormInput placeholder="Enter quantity" size="lg" v-model="this.qtyAfterScan" autofocus required/>
            </CInputGroup>
          </CCol>
        </CRow> 

      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="this.clearModalViewScan()">Cancel</CButton>&nbsp;&nbsp;
      <CButton color="primary" type="submit" @click="handleSubmitCustom03">Add this Item</CButton>
    </CModalFooter>
  </CModal>
  
</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: "Create GRN",
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
      validatedCustom02: null,
      validatedCustom03: null,

      // models
      totalCount: null,
      allAsn: null,

      // Selected ASN number and modal thereof
      asnNumber: null,
      selectedASN: null,
      modalViewCreateASN: false,

      // reject reasons
      rejectReasons: [
        'Missing items',
        'Missing quantity',
        'Damaged products / packing',
        'Mismatched products / Not present in the list',
      ],

      //QC flag
      qc: {
        actionQC: null,
        remarksQC: null,
        acceptQuantity: null,
        rejectQuantity: null,
        reasonReject: null,
      },

      // barcode
      scanbarcode: null,

      // modal for quantity / multiple barcode scan
      modalViewScan: false,
      qtyAfterScan: 1,
      matchCount: 0,
      matchindexes: [],
      selectedPalletIndexFromMultiple: null,
    }
  },
  methods: {

    handleSubmitCustom02(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.submitData()
      }
      this.validatedCustom02 = true
    },

    handleSubmitCustom03(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.addSKUQuantity()
      }
      this.validatedCustom03 = true
    },

    
    getAllAsnDetails(params) {

      axios.get(this.APIHOST + '/inbound/get-all-asn/', {
        params: {
          grnUpdated: false
        },
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.totalCount = response.data.response.totalCount
        this.allAsn = response.data.response.payloads
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
      
    }, // end get all ASN

    initiateQcOnClick(asnNumber) {
      this.asnNumber = asnNumber
      this.getAsnDetails()
      this.modalViewCreateASN = true
    },

    getAsnDetails() {

      axios.get(this.APIHOST + '/inbound/get-asn/', {
        params: {
          id: this.asnNumber
          //id: 'ASN-27'  // only for testing purposes
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.selectedASN = response.data.response

        // Add QC flags to each pallet
        let numPallets = this.selectedASN.payload.pallets.length
        for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
          let numPackages = this.selectedASN.payload.pallets[palletIndex].packages.length
          for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {
            this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'] = {
              actionQC: null,
              remarksQC: null,
              acceptQuantity: null,
              rejectQuantity: null,
              reasonReject: null,
            }
          }
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
      
    },

    acceptAllPackages() {
      // set action QC and quantity
      let numPallets = this.selectedASN.payload.pallets.length
      for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
        let numPackages = this.selectedASN.payload.pallets[palletIndex].packages.length
        for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {
          this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'].actionQC = "Accept complete package"
          this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'].remarksQC = "Good condition"
          this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'].acceptQuantity = this.selectedASN.payload.pallets[palletIndex].packages[packageIndex].packageQuantity
          this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'].rejectQuantity = 0
        }
      }
    },

    rejectAllPackages() {
      // set action QC and quantity
      let numPallets = this.selectedASN.payload.pallets.length
      for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
        let numPackages = this.selectedASN.payload.pallets[palletIndex].packages.length
        for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {
          this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'].actionQC = "Reject complete package"
          this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'].remarksQC = "Not good condition"
          this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'].acceptQuantity = 0
          this.selectedASN.payload.pallets[palletIndex].packages[packageIndex]['qc'].rejectQuantity = this.selectedASN.payload.pallets[palletIndex].packages[packageIndex].packageQuantity
        }
      }
    },

    incrementOnScan() {
      // let a = this.selectedASN.payload.pallets.map((pallet) => {
      //   return {...pallet, item: pallet.packages.filter((item) => item.packageSKU === this.scanbarcode)}
      // })
      // let a = this.selectedASN.payload.pallets.map((element) => {
      //           return {...element, subElements: element.packages.filter((subElement) => subElement.packageSKU === this.scanbarcode)}
      //         })
      // console.log(this.scanbarcode)
      // console.log(a)

      let matchCount = 0
      let matchindexes = []

      let numPallets = this.selectedASN.payload.pallets.length
      for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
        let numPackages = this.selectedASN.payload.pallets[palletIndex].packages.length
        for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {
          if (this.selectedASN.payload.pallets[palletIndex].packages[packageIndex].packageSKU === this.scanbarcode) {
            matchCount = matchCount + 1
            matchindexes.push([palletIndex, packageIndex])
          }
        }
      }

      if (matchCount > 0) {
        this.matchCount = matchCount
        this.matchindexes = matchindexes
        console.log(this.matchindexes)
        this.showModalViewScan()  
      } else {
        alert("SKU not present")
      }
      
    },

    addSKUQuantity() {
      console.log(this.qtyAfterScan)
      console.log(this.selectedPalletIndexFromMultiple)
      console.log(this.matchindexes)
      if (this.matchCount > 1) {
        let indexes = this.selectedPalletIndexFromMultiple.split('-')
        if (this.selectedASN.payload.pallets[indexes[0]].packages[indexes[1]].qc.acceptQuantity == null) {
          this.selectedASN.payload.pallets[indexes[0]].packages[indexes[1]].qc.acceptQuantity = Number(this.qtyAfterScan)
        } else {
          this.selectedASN.payload.pallets[indexes[0]].packages[indexes[1]].qc.acceptQuantity = Number(this.selectedASN.payload.pallets[indexes[0]].packages[indexes[1]].qc.acceptQuantity) + Number(this.qtyAfterScan)
        }
      } else if (this.matchCount == 1) {
        let indexes = this.matchindexes[0]
        if (this.selectedASN.payload.pallets[indexes[0]].packages[indexes[1]].qc.acceptQuantity == null) {
          this.selectedASN.payload.pallets[indexes[0]].packages[indexes[1]].qc.acceptQuantity = Number(this.qtyAfterScan)
        } else {
          this.selectedASN.payload.pallets[indexes[0]].packages[indexes[1]].qc.acceptQuantity = Number(this.selectedASN.payload.pallets[indexes[0]].packages[indexes[1]].qc.acceptQuantity) + Number(this.qtyAfterScan)
        }
      }

      this.clearModalViewScan()
    },

    showModalViewScan() {
      this.modalViewScan = true
    },

    clearCreateASNModal() {
      this.modalViewCreateASN = false
      this.selectedASN = null
      this.asnNumber = null
    },

    clearModalViewScan() {
      this.modalViewScan = false
      this.qtyAfterScan = 1
      this.matchCount = 0
      this.matchindexes = []
      this.selectedPalletIndexFromMultiple = null
    },

    submitData() {
      let payload = {
        meta: {
            schemaVersion: "0.0.0"
        },

        asnNumber: this.asnNumber,
        pallets: this.selectedASN.payload.pallets,
      }

      // Validity checks
      // Quantity checks
      let validCheckQuantity = true
      let numPallets = this.selectedASN.payload.pallets.length
      for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
        let numPackages = this.selectedASN.payload.pallets[palletIndex].packages.length
        for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {
          let packageQuantity = Number(this.selectedASN.payload.pallets[palletIndex].packages[packageIndex].packageQuantity)
          let qcQuantity = Number(this.selectedASN.payload.pallets[palletIndex].packages[packageIndex].qc.acceptQuantity) + Number(this.selectedASN.payload.pallets[palletIndex].packages[packageIndex].qc.rejectQuantity)
          if (packageQuantity !== qcQuantity) { 
            validCheckQuantity = false
            alert("Sum of accept & reject quantities do not match for Package # " + this.selectedASN.payload.pallets[palletIndex].packages[packageIndex].packageNumber + ", SKU # " + this.selectedASN.payload.pallets[palletIndex].packages[packageIndex].packageSKU + " under Pallet # " + this.selectedASN.payload.pallets[palletIndex].palletNumber)
            break
          }
        }
        if (validCheckQuantity == false) {
          break
        }
      }

      if (validCheckQuantity == true) {
        axios.post(this.APIHOST + '/inbound/add-grn/', {
          payload: payload,
        }, {
          headers: this.headers,
        })
        .then(response => {
          if (response.status == 200) {
            if (alert("QC Complete. GRN Created: " + response.data.response)) {}
            else { this.reloadPage() }
          }
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        });
      }

      console.log(payload)

    }, //end of submitData

    reloadPage() {
      location.reload()
    },

  }, //end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getAllAsnDetails()
    // this.getAsnDetails() // only for testing purposes
  }, // end created

}

</script>

<style scoped>

</style>