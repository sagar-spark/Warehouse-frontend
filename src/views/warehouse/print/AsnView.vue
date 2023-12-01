<template>
	<div v-if="this.asnDetails">
    <CRow class="mt-4">
      <CCol :xs="12">
        <CTable>
          <CTableBody>
            <CTableRow>
              <CTableDataCell width="20%">
                <CNavLink :href="'/#/print/sku-barcode?barcodePath=' + this.asnDetails.payload.barcode" target="_blank">
                  <CCardImage orientation="top" width="10rem" style="width: 150px" :src=this.asnDetails.payload.barcode />
                </CNavLink>
              </CTableDataCell>
              <CTableDataCell width="5%">
                &nbsp;&nbsp;
              </CTableDataCell>
              <CTableDataCell>
                <h4>Ship From:</h4>
                <strong>{{this.asnDetails.payload.shipFromDetails.name}}</strong><br>
                <span class="text-medium-emphasis small">
                  {{this.asnDetails.payload.shipFromDetails.address.address}}, 
                  {{this.asnDetails.payload.shipFromDetails.address.city}}, 
                  {{this.asnDetails.payload.shipFromDetails.address.zip}}, 
                  {{this.asnDetails.payload.shipFromDetails.address.state}}, 
                  {{this.asnDetails.payload.shipFromDetails.address.country}}
                  <br>
                  Email: {{this.asnDetails.payload.shipFromDetails.address.email}}
                  <br>
                  Phone: {{this.asnDetails.payload.shipFromDetails.address.phone}}
                </span>
              </CTableDataCell>
              <CTableDataCell>
                <h4>Ship To:</h4>
                <strong>{{this.asnDetails.payload.shipToDetails.warehouseDetails.name}}</strong><br>
                <span class="text-medium-emphasis small">
                  {{this.asnDetails.payload.shipToDetails.warehouseDetails.address.address}}, 
                  {{this.asnDetails.payload.shipToDetails.warehouseDetails.address.city}}, 
                  {{this.asnDetails.payload.shipToDetails.warehouseDetails.address.zip}}, 
                  {{this.asnDetails.payload.shipToDetails.warehouseDetails.address.state}}, 
                  {{this.asnDetails.payload.shipToDetails.warehouseDetails.address.country}}
                  <br>
                  Email: {{this.asnDetails.payload.shipToDetails.warehouseDetails.address.email}}
                  <br>
                  Phone: {{this.asnDetails.payload.shipToDetails.warehouseDetails.address.phone}}
                </span>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
    
    <CRow>
      <CCol :xs="12">
        <CTable>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>
                <h6>Date / Time:</h6>
                {{this.asnDetails.createddate}} /  {{this.asnDetails.createdtime}}
              </CTableDataCell>
              <CTableDataCell>
                <h6>QC / GRN status:</h6>
                <CBadge class="mb-2" :color="getBadge(this.asnDetails.grnUpdated)">QC: {{ getBadgeValue(this.asnDetails.grnUpdated) }}</CBadge>
                <br>
                <CBadge class="mb-2" :color="getBadge(this.asnDetails.grnConfirmed)">GRN: {{ getBadgeValue(this.asnDetails.grnConfirmed) }}</CBadge>
                <br>
                <CBadge class="mb-2" :color="getStage(this.asnDetails.stageStockIn)">Inventory: {{ getStageValue(this.asnDetails.stageStockIn) }}</CBadge>
                <br>
                <span class="mt-4" v-if="this.asnDetails.grn !== undefined">
                  <strong>GRN: </strong>{{this.asnDetails.grn.grnId}}
                </span>
              </CTableDataCell>
              <CTableDataCell>
                <h6>Shipment Type:</h6>
                {{this.asnDetails.payload.shipToDetails.shipmentType}}
              </CTableDataCell>
              <CTableDataCell>
                <h6>Courier details</h6>
                {{this.asnDetails.payload.shipmentDetails.courierType}}
                <br>
                <span class="text-medium-emphasis small">
                  <span v-if="this.asnDetails.payload.shipmentDetails.warehouseCourierPickupDate">
                    Pickup date: {{this.asnDetails.payload.shipmentDetails.warehouseCourierPickupDate}}
                    <br>
                  </span>
                  <span v-if="this.asnDetails.payload.shipmentDetails.warehouseCourierPickupSlot">
                    Pickup slot: {{this.asnDetails.payload.shipmentDetails.warehouseCourierPickupSlot}}
                    <br>
                  </span>
                  <span v-if="this.asnDetails.payload.shipmentDetails.ownShipmentCarrier">
                    Carrier: {{this.asnDetails.payload.shipmentDetails.ownShipmentCarrier}}
                    <br>
                  </span>
                  <span v-if="this.asnDetails.payload.shipmentDetails.ownShipmentTrackingNum">
                    Tracking: {{this.asnDetails.payload.shipmentDetails.ownShipmentTrackingNum}}
                    <br>
                  </span>
                  <span v-if="this.asnDetails.payload.shipmentDetails.ownShipmentDate">
                    Shipment date: {{this.asnDetails.payload.shipmentDetails.ownShipmentDate}}
                    <br>
                  </span>
                </span>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
    
    <CRow>
      <CCol :md="12">
        <CCard class="mb-3 border-top-3" v-for="(pallet, counter) in this.asnDetails.payload.pallets" v-bind:key="counter">
          <CCardHeader class="bg-light">
            <CRow>
              <CCol :xs="12">
                <CTable class="mt-0 mb-0">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>
                        <span class="h6">{{this.asnDetails.payload.packingType}} </span>
                        <br>{{counter+1}}
                      </CTableDataCell>
                      <CTableDataCell>
                        <span class="h6">Number of items</span>
                        <br>{{pallet.packages.length}}
                      </CTableDataCell>
                      <CTableDataCell>
                        <span class="h6">{{this.asnDetails.payload.packingType}} # or barcode</span>
                        <br>{{pallet.palletNumber}}
                      </CTableDataCell>
                      <CTableDataCell>
                        <span class="h6">Contents</span>
                        <br>{{pallet.palletContents}}
                      </CTableDataCell>
                      <CTableDataCell>
                        <span class="h6">Dimensions (LWH)</span>
                        <br>{{pallet.palletLength}} x {{pallet.palletWidth}} x {{pallet.palletHeight}}
                      </CTableDataCell>
                      <CTableDataCell>
                        <span class="h6">Weight</span>
                        <br>{{pallet.palletWeight}}
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          </CCardHeader>
            
          <CCardBody>
            <CRow>
              <CCol :md="12">
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">SKU</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">ASN Quantity</CTableHeaderCell>
                      <CTableHeaderCell scope="col">QC Accept Qty</CTableHeaderCell>
                      <CTableHeaderCell scope="col">QC Reject Qty</CTableHeaderCell>
                      <CTableHeaderCell scope="col">QC Action</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Supplier Remarks</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow v-for="(p_package, counter2) in pallet.packages" v-bind:key="counter2">
                      <CTableDataCell width="10%">
                        <!-- {{p_package.packageSKU}} -->
                        <CNavLink :href="'/#/print/sku-barcode?barcodePath=' + p_package.barcode" target="_blank">
                          <CCardImage orientation="top" :src=p_package.barcode />
                        </CNavLink>
                      </CTableDataCell>
                      <CTableDataCell>
                        {{p_package.packageDescription}}
                        <br><br>
                        <strong>Batch: </strong>{{p_package.packageBatchNumber}}
                        <br>
                        <strong>Expiry Date: </strong>{{p_package.packageBatchNumber}}
                      </CTableDataCell>
                      <CTableDataCell class="text-center">{{p_package.packageQuantity}}</CTableDataCell>
                      <CTableDataCell class="text-center" v-if="p_package.qc">
                        {{p_package.qc.acceptQuantity}}
                      </CTableDataCell>
                      <CTableDataCell class="text-center" v-if="p_package.qc">
                        {{p_package.qc.rejectQuantity}}
                        <span v-if="p_package.qc.reasonReject !== null">
                          <br>
                          <strong>Reason: </strong>
                          {{p_package.qc.reasonReject}}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell v-if="p_package.qc">
                        {{p_package.qc.actionQC}}
                        <br>
                        <strong>Remarks: </strong>{{p_package.qc.remarksQC}}
                      </CTableDataCell>
                      <CTableDataCell v-if="p_package.qc">
                        {{p_package.grnConfirm.action}}
                        <span v-if="p_package.grnConfirm.rejectRemarks !== null">
                          <br>
                          <strong>Remarks: </strong>
                          {{p_package.grnConfirm.rejectRemarks}}
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

  </div>
</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: "PrintSKU",

  setup() {

    const getBadge = (status) => {
      switch (status) {
        case true:
          return 'success'
        case false:
          return 'dark'
        default:
          'dark'
      }
    }

    const getBadgeValue = (status) => {
      switch (status) {
        case true:
          return 'Complete'
        case false:
          return 'Incomplete'
        default:
          'Unknown'
      }
    }

    const getStage = (stage) => {
      if (stage == null || stage == undefined) {
        return 'dark'
      } 
      else {
        return 'success'
      }
    }

    const getStageValue = (stage) => {
      if (stage == null || stage == undefined) {
        return "Pending"
      } 
      else {
        return stage
      }
    }

    return {
      getBadge,
      getBadgeValue,
      getStage,
      getStageValue,
    }
  },

  data: () => {
    return {
      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': vueCookies.get('accessToken')
			},

      // data models
	    queryASN: null,
      asnDetails: null,
    }
  },

  methods: {

    getASNDetails() {
      this.queryASN = this.$route.query.asn

      if (this.queryASN == undefined || this.queryASN == null) {
        alert('Invalid selection - close this window and try again')
      } else {
        axios.get(this.APIHOST + '/inbound/get-asn/', {
          params: {
            id: this.queryASN
          },
          headers: this.headers,
        })
        .then(response => {
          console.log(response.data.response)
          this.asnDetails = response.data.response

          if (this.asnDetails.grn !== undefined) {
            this.asnDetails.payload.pallets = []
            this.asnDetails.payload.pallets = this.asnDetails.grn.confirmPayload.payload.pallets
          }
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })
      }

    },
  	

  }, //end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
  	this.getASNDetails()
  }, // end created

  mounted() {
  	
  },

}
	
</script>

<style scoped>

</style>