 <template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Barcodes</h2>
    </CCol>
  </CRow>

  <CCard class="mb-3">
    <!-- <CCardHeader>
      <CRow>
        <CCol :md="6">
          <strong>Choose atrefacts to print barcodes</strong>
        </CCol>
        <CCol :md="4">
          &nbsp;
        </CCol>
        
      </CRow>
      
    </CCardHeader> -->

   <CCardBody>

      <CRow class="mb-2">
        <CCol :md="5">
          <p class="text-medium-emphasis mb-1">Choose atrefacts to print barcodes</p>
          <CFormSelect class="mb-2" v-model="artefact" v-on:change="this.getAvailableArtefacts($event)" required>
            <option value="">Choose artefact</option>
            <option value="Master">Warehouse</option>
            <option value="Zones">Zone</option>
            <option value="Locations">Locations</option>
            <option value="Shelves">Shelf</option>
            <option value="Trolley">Trolley</option>
            <option value="Bin">Bin</option>
            <option value="Vendor SKUs">Vendor SKUs</option>
          </CFormSelect>
        </CCol>

        <CCol :md="5" v-if="this.selectedArtefact === 'Vendor SKUs'">
          <p class="text-medium-emphasis mb-1">Choose vendor for SKUs</p>
          <CFormSelect v-if="this.allVendors.length > 0" class="mb-2" v-model="artefact" v-on:change="this.getAvailableArtefacts($event)" required>
            <option value="">Choose vendor</option>
            <option v-for="(vendor, counter) in this.allVendors" :value=vendor.vendorId>{{vendor.payload.name}}, {{vendor.address[0].address}}, {{vendor.address[0].city}}, {{vendor.payload.email}}, {{vendor.payload.phone}}</option>
          </CFormSelect>
        </CCol>
      </CRow>


      <CRow class="mb-3">

        <CCol :md="5" v-if="this.availableArtefacts != null && (this.barcodesPrint.length == this.availableArtefacts.length)">
          <p class="text-medium-emphasis mb-1">Filter selection</p>
          <CMultiSelect :options="this.barcodesPrint" :multiple="true" v-on:change="preparePrintURL($event)" />
        </CCol>

        <CCol :md="2" v-if="this.selectedArtefacts.length > 0">
          <p class="text-medium-emphasis mb-1">&nbsp;</p>
          <CNavLink :href="this.printURL" target="_blank" active>
            <CButton color="primary">Print selection</CButton>
          </CNavLink>
        </CCol>
      </CRow>

      <CRow v-if="this.selectedArtefacts.length > 0">
        <CCol :md="12">
          <h4>Selected {{this.friendlyNames[this.artefact]}}</h4>
          <hr>
          <CRow>
            <CCol :md="3" v-for="artefact in this.selectedArtefacts">
              <CCard text-color="dark" class="mb-3 border border-secondary">
                <CCardHeader class="bg-light">
                  {{this.filterArtefactDetails(artefact).qualifiedName}}
                </CCardHeader>
                <CCardBody class="text-center">
                  <CCardImage orientation="top" :src=this.filterArtefactDetails(artefact).barcode />
                  <!-- <CNavLink :href=this.filterArtefactDetails(artefact).barcode target="_blank" active>
                    <CButton color="secondary" size="sm">Print / Download</CButton>
                  </CNavLink> -->
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
      </CRow>

    </CCardBody>
  </CCard>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: "AsnShipmentQC",
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
      friendlyNames: {
        'Master': 'Warehouses',
        'Zones': 'Zones',
        'Locations': 'Locations',
        'Shelves': 'Shelves',
        'Trolley': 'Trolleys',
        'Bin': 'Bins',
        'Vendor SKUs': 'Vendor SKUs',
      },
      artefact: null,
      selectedArtefact: null,
      availableArtefacts: null,

      // vendors
      allVendors: null,
      selectedVendor: null,

      // showArtefacts: null
      selectedArtefacts: [],

      barcodesPrint: [],
      
      printURL: null,
      downloadURL: null,

    }
  },

  methods: {

    getAvailableArtefacts(event) {
      let selectedArtefact = event.target.value
      this.selectedArtefact = selectedArtefact
      this.barcodesPrint = []

      if (selectedArtefact != null && selectedArtefact != undefined && selectedArtefact.length > 0) {

        // if 'Vendor SKUs' is not selected

        if (selectedArtefact !== 'Vendor SKUs') {

          axios.get(this.APIHOST + '/infra/get-all-warehouse-objects/', {
            params: {
              type: selectedArtefact
            },
            headers: this.headers,
          })
          .then(response => {
            if (response.status == 200) {
              this.availableArtefacts = response.data.response
              console.log(response.data.response)

              // prepare multi select options & entire list 
              
                for (let counter = 0; counter<this.availableArtefacts.length; counter++) {
                  // console.log(this.availableArtefacts[counter])
                  let selectOption = {
                    value: this.availableArtefacts[counter].id,
                    text: this.availableArtefacts[counter].qualifiedName,
                  }

                  this.barcodesPrint.push(selectOption)
                }

            }
          })
          .catch(error => {
            alert(JSON.stringify(error.response.data.response))
            console.log(error)
          })

        } // end of if - 'Vendor SKUs' is not selected

        else if (selectedArtefact === 'Vendor SKUs') {

          // get all vendors

          axios.get(this.APIHOST + '/infra/getAllVendors/', {
            headers: this.headers
          })
          .then(response => {
            console.log(response.data.response)
            this.allVendors = response.data.response
          })
          .catch(error => {
            alert(JSON.stringify(error.response.data))
            console.log(error)
          })

        }
        
      }
    },

    preparePrintURL(event) {

      // alert("Hello")
      // console.log(event)

      this.selectedArtefacts = []
      for (let counter = 0; counter < event.length; counter++) {
        this.selectedArtefacts.push(event[counter].value)
      }

      // console.log(this.selectedArtefacts)
      
      this.printURL = "/#/print/artefact-barcode?artefact=" + this.artefact + "&selectedArtefacts=" + this.selectedArtefacts.join("@@") + "&isdownload=false"

      this.downloadURL = "/#/print/artefact-barcode?artefact=" + this.artefact + "&selectedArtefacts=" + this.selectedArtefacts.join("@@") + "&isdownload=true"

      console.log(this.printURL)

    },

    filterArtefactDetails(artefact) {
      return this.availableArtefacts.filter(item => item.id == artefact)[0]
    }

  }, //end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
  }, // end created

}

</script>

<style scoped>

</style>