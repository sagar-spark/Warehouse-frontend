<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Stock Transfer</h2>
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol :md="12" :sm="12" :lg="12">
      <CAccordion>
        <CAccordionItem :item-key="1">
          <CAccordionHeader>
            <span class="h4">New Transfer</span>
          </CAccordionHeader>
          <CAccordionBody class="m-0 p-0">

            <CRow>
              <CCol class :sm="12" :md="12" :lg="12">
                <CAlert color="dark">
                  <span class="h5">How Stock Transfer works</span>
                  <p class="mb-0 text-medium-emphasis">
                    <ul class="mb-0">
                      <li>Scan / enter the SKU which you want to transfer and press enter / click search</li>
                      <li>You will get list of all inventories for the stock entered by batch & shelf</li>
                      <li>You can transfer entire quantity of the inventory by clicking Transfer and providing movement Trolley/Bin. Partial transfer is not possible now</li>
                      <li>Once Transfer is initiated, the SKU inventory will appear on Queued transfer which can be shelved back to new Shelf</li>
                      <li>You can see all completed transfers in the last section below</li>
                    </ul>
                  </p>
                </CAlert>
              </CCol>
            </CRow>

            <CRow class="mb-3">
              <CCol class :sm="6" :md="3" :lg="3">
                <CFormLabel class="text-medium-emphasis small">Scan / Input SKU</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon="cil-barcode" />
                  </CInputGroupText>
                  <CFormInput placeholder="SKU" v-model="this.skuSearch" required @keyup.enter="this.getInventoryItemsBySKU()" />
                </CInputGroup>
              </CCol>

              <CCol class :sm="1" :md="1" :lg="1">
                <CFormLabel class="text-medium-emphasis small">&nbsp;</CFormLabel><br>
                <CButton color="primary" @click="this.getInventoryItemsBySKU()">
                  <CIcon icon="cil-search" class="" />
                </CButton>
              </CCol>
            </CRow>

            <CRow v-if="this.skuInventories.length > 0">

              <CCol :sm="12" :md="4" :lg="4" v-for="inventory in this.skuInventories">
                <CCard text-color="dark" class="mb-3 border border-secondary">
                  <CCardHeader class="bg-light">
                    <CCardTitle>
                      {{inventory.skuNumber}} / 
                      {{inventory.payloadSku.productName}}
                    </CCardTitle>
                  </CCardHeader>
                  <CCardBody class="pb-0 bg-light">
                    <CCardText>
                      <CRow>
                        <CCol :xs="4" :md="4" :lg="4" class="mb-2">
                          <p class="text-medium-emphasis small mb-0">Quantity</p>
                          <span class="h5">{{inventory.currentQuantity}}</span>
                        </CCol>
                        <CCol :xs="8" :md="8" :lg="8" class="mb-2">
                          <p class="text-medium-emphasis small mb-0">Batch</p>
                          <span class="h5">{{inventory.batchNumber}}</span>
                        </CCol>
                        <CCol :xs="12" :md="12" :lg="12" class="mb-2">
                          <p class="text-medium-emphasis small mb-0">Shelf</p>
                          <span class="h5">{{inventory.shelfId.qualifiedName}}</span>
                        </CCol>
                        <CCol :xs="6" :md="6" :lg="6" class="mb-2">
                          <p class="text-medium-emphasis small mb-0">Bin</p>
                          <span class="h5" v-if="inventory.binId != null">{{inventory.binId.qualifiedName}}</span>
                          <span class="h5"  v-else>Not used</span>
                        </CCol>
                        <CCol :xs="12" :md="12" :lg="12" class="mb-2">
                          <span v-if="inventory.moveQInitiated == true">
                            <CBadge color="primary" class="me-2">Under Transfer</CBadge>
                          </span>
                          <span v-if="inventory.alteredWithMoveQ == true">
                            <CBadge color="primary" class="me-2">Transferred before</CBadge>
                          </span>
                        </CCol>
                        <CCol :xs="12" :md="12" :lg="12" class="mb-3">
                          <span v-if="inventory.moveQInitiated == false">
                            <CButton color="primary" size="sm" v-on:click="this.showTransferModal(inventory)">Transfer</CButton>
                          </span>
                          <span v-else>
                            <CButton disabled color="secondary" size="sm">Cannot Transfer</CButton>
                          </span>
                        </CCol>
                      </CRow>
                    </CCardText>
                  </CCardBody>
                </CCard>

              </CCol>

            </CRow>

          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol :md="12" :sm="12" :lg="12">
      <CAccordion :active-item-key="1" flush always-open>
        <CAccordionItem :item-key="1">
          <CAccordionHeader>
            <span class="h4">Queued Transfers</span>
          </CAccordionHeader>
          <CAccordionBody class="m-0 p-0">

            <CRow v-if="this.transferQueue != null">
              <CCol>
                <div class="divFixedWidthContent">
                  <CSmartTable
                    header
                    :items-per-page="10"
                    items-per-page-select
                    :columns="this.transferQueueTableColumns"
                    :items="this.transferQueueTableData"
                    pagination
                    columnSorter
                    :table-props="{
                      hover: true,
                    }"
                  >
                    <template #inventory_name="{ item }">
                      <td>
                        <strong>SKU: </strong>{{item.inventory_skuNumber}}
                        <br>
                        <strong>Name: </strong>{{item.inventory_name}}
                        <br>
                        <strong>Quantity: </strong>{{item.inventory_quantity}}
                        <br>
                        <strong>Batch: </strong>{{item.inventory_batchNumber}}
                      </td>
                    </template>
                    <template #current_location="{ item }">
                      <td>
                        <strong>Shelf: </strong>{{item.current_location.shelfId}}
                        <br>
                        <strong>Bin: </strong>{{item.current_location.binId}}
                      </td>
                    </template>
                    <template #movePayload="{ item }">
                      <td>
                        <strong>Trolley: </strong>{{item.movePayload.trolleyId}}
                        <br>
                        <strong>Bin: </strong>{{item.movePayload.binId}}
                        <br>
                        <strong>Date: </strong>{{item.createdDate}}
                      </td>
                    </template>
                    <!-- <template #target_location="{ item }">
                      <td>
                        <strong>Shelf: </strong>{{item.target_location.shelfId}}
                        <br>
                        <strong>Bin: </strong>{{item.target_location.binId}}
                      </td>
                    </template> -->
                    <template #status="{ item }">
                      <td>
                        <span v-if="item.shelvedBack == true">
                          <CBadge color="success">
                            COMPLETE
                          </CBadge>
                        </span>
                        <span v-else>
                          <CButton color="primary" size="sm" @click="this.showShelveModal(item)">Shelve</CButton>
                        </span>
                      </td>
                    </template>

                  </CSmartTable>
                </div>

              </CCol>
            </CRow>
            
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CCol>
  </CRow>


  <CRow class="mb-3">
    <CCol :md="12" :sm="12" :lg="12">
      <CAccordion :active-item-key="1" flush always-open>
        <CAccordionItem :item-key="1">
          <CAccordionHeader>
            <span class="h4">Complete Transfers</span>
          </CAccordionHeader>
          <CAccordionBody class="m-0 p-0">

            <CRow v-if="this.completeQueue != null">
              <CCol>
                <div class="divFixedWidthContent">
                  <CSmartTable
                    header
                    :items-per-page="10"
                    items-per-page-select
                    :columns="this.completeQueueTableColumns"
                    :items="this.completeQueueTableData"
                    pagination
                    columnSorter
                    :table-props="{
                      hover: true,
                    }"
                  >
                    <template #inventory_name="{ item }">
                      <td>
                        <strong>SKU: </strong>{{item.inventory_skuNumber}}
                        <br>
                        <strong>Name: </strong>{{item.inventory_name}}
                        <br>
                        <strong>Quantity: </strong>{{item.inventory_quantity}}
                        <br>
                        <strong>Batch: </strong>{{item.inventory_batchNumber}}
                      </td>
                    </template>
                    <template #current_location="{ item }">
                      <td>
                        <strong>Shelf: </strong>{{item.current_location.shelfId}}
                        <br>
                        <strong>Bin: </strong>{{item.current_location.binId}}
                      </td>
                    </template>
                    <template #movePayload="{ item }">
                      <td>
                        <strong>Trolley: </strong>{{item.movePayload.trolleyId}}
                        <br>
                        <strong>Bin: </strong>{{item.movePayload.binId}}
                        <br>
                        <strong>Date: </strong>{{item.createdDate}}
                      </td>
                    </template>
                    <template #target_location="{ item }">
                      <td>
                        <strong>Shelf: </strong>{{item.target_location.shelfId}}
                        <br>
                        <strong>Bin: </strong>{{item.target_location.binId}}
                      </td>
                    </template>
                    <template #status="{ item }">
                      <td>
                        <CBadge color="success">COMPLETE</CBadge>
                      </td>
                    </template>

                  </CSmartTable>
                </div>

              </CCol>
            </CRow>
            
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CCol>
  </CRow>


  <CModal 
    alignment="center" 
    scrollable 
    size="sm"
    backdrop="static"
    :visible="viewTransferModal" 
    @close="this.clearTransferModal()">

    <CModalHeader 
      dismiss
      @close="this.clearTransferModal()">
      <CModalTitle>
        Transfer
      </CModalTitle>
    </CModalHeader>
    
    <CModalBody>

      <CRow>
        <CCol :xs="12" :md="12" :lg="12" class="mb-2">
          <CFormLabel class="text-medium-emphasis small">Transfer Trolley (mandatory)</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon="cil-barcode" />
            </CInputGroupText>
            <CFormInput placeholder="Scan Trolley" v-model="this.newTransferData.movePayload.trolleyId" required />
          </CInputGroup>
        </CCol>
        <CCol :xs="12" :md="12" :lg="12" class="mb-2">
          <CFormLabel class="text-medium-emphasis small">Transfer Bin (optional)</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon="cil-barcode" />
            </CInputGroupText>
            <CFormInput placeholder="Scan Bin" v-model="this.newTransferData.movePayload.binId" />
          </CInputGroup>
        </CCol>
      </CRow>
      
    </CModalBody>
    
    <CModalFooter>    
      <CButton color="secondary" @click="this.clearTransferModal()">Cancel</CButton>
      <CButton color="primary" @click="this.initiateTransfer()">Finish</CButton>
    </CModalFooter>

  </CModal>

  <CModal 
    alignment="center" 
    scrollable 
    size="sm"
    backdrop="static"
    :visible="viewShelveModal" 
    @close="this.clearShelveModal()">

    <CModalHeader 
      dismiss
      @close="this.clearShelveModal()">
      <CModalTitle>
        Shelve back
      </CModalTitle>
    </CModalHeader>
    
    <CModalBody>

      <CRow>
        <CCol :xs="12" :md="12" :lg="12" class="mb-2">
          <CFormLabel class="text-medium-emphasis small">Shelf</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon="cil-barcode" />
            </CInputGroupText>
            <CFormInput placeholder="Scan Shelf" v-model="this.newShelveData.targetShelfId" required />
          </CInputGroup>
        </CCol>
        <CCol :xs="12" :md="12" :lg="12" class="mb-2">
          <CFormLabel class="text-medium-emphasis small">Bin (optional)</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon="cil-barcode" />
            </CInputGroupText>
            <CFormInput placeholder="Scan Bin" v-model="this.newShelveData.targetBinId" />
          </CInputGroup>
        </CCol>
      </CRow>
      
    </CModalBody>
    
    <CModalFooter>    
      <CButton color="secondary" @click="this.clearShelveModal()">Cancel</CButton>
      <CButton color="primary" @click="this.completeTransfer()">Finish</CButton>
    </CModalFooter>

  </CModal>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Stock Transfer",
  
  data: () => {
    return {

      //form validation
      validatedCustom01: null,

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      skuSearch: null,
      skuInventories: [],
      skuInventoriesColumns: [
        { key: 'skuNumber', label: 'SKU', },
        { key: 'productName', label: 'Product', },
        { key: 'currentQuantity', label: 'Current Qty', },
        { key: 'batchNumber', label: 'Batch', },
        { key: 'shelfId', label: 'Shelf', },
        { key: 'binId', label: 'Bin', },
        { key: 'history', label: 'History', },
        { key: 'action', label: 'Action', },
      ],

      //Modal & data
      viewTransferModal: false,
      viewShelveModal: false,
      
      newTransfer: {
        inventoryId: null,
        quantity: null,
        movePayload: { 
          trolleyId: null,
          binId: null,
        },
      },
      newTransferData: null,
      
      newShelve: {
        id: null,
        targetShelfId: null,
        targetBinId: null,
      },
      newShelveData: {

      },

      transferQueue: null,
      transferQueueTableData: [],
      transferQueueTableColumns: [
        // { key: 'createdDate', label: 'Date', },
        // { key: 'inventory_skuNumber', label: 'SKU', },
        { key: 'inventory_name', label: 'SKU', },
        // { key: 'inventory_quantity', label: 'Qty', },
        // { key: 'inventory_batchNumber', label: 'Batch', },
        { key: 'current_location', label: 'Prev location', },
        { key: 'movePayload', label: 'Movement', },
        // { key: 'target_location', label: 'New location', },
        { key: 'status', label: 'Status', },
      ],

      completeQueue: null,
      completeQueueTableData: [],
      completeQueueTableColumns: [
        { key: 'inventory_name', label: 'SKU', },
        { key: 'current_location', label: 'Prev location', },
        { key: 'movePayload', label: 'Movement', },
        { key: 'target_location', label: 'New location', },
        { key: 'status', label: 'Status', },
      ],
      
    }
  }, //end of Data

  methods: {

    getInventoryItemsBySKU() {

      if (this.skuSearch == null || this.skuSearch.length < 1) {
        alert('Enter SKU to search shelved inventories')
      } else {

        axios.get(this.APIHOST + '/infra/getInventoryItems/', {
          params: {
            page_seq: 1,
            page_size: 1000,
            skuNumber: this.skuSearch
          },
          headers: this.headers,
        })
        .then(response => {
          console.log(response.data.response)
          this.skuInventories = response.data.response.payloads
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })

      }

    },

    clearTransferModal() {
      this.viewTransferModal = false
      this.newTransferData = null
    },

    showTransferModal(inventory) {
      this.viewTransferModal = true
      this.newTransferData = this.newTransfer
      this.newTransferData.inventoryId = inventory.id
      this.newTransferData.quantity = inventory.currentQuantity
    },

    initiateTransfer() {
      if (this.newTransferData.movePayload.trolleyId == null || this.newTransferData.movePayload.trolleyId.length < 1) {
        alert('Trolley is not populated')
      } else {

        axios.post(this.APIHOST + '/infra/putStocksInMoveQ/', this.newTransferData, {
          headers: this.headers
        })
        .then(response => {
          console.log(response.data.response)
          alert('Transfer initiated. See queued transfer below. \n\nShelve it back to complete transfer.')
          this.reloadPage()
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })

      }
    },

    clearShelveModal() {
      this.viewShelveModal = false
      this.newShelveData = null
    },

    showShelveModal(item) {
      this.viewShelveModal = true
      this.newShelveData = this.newShelve
      this.newShelveData.id = item.id
    },

    completeTransfer() {

      if (this.newShelveData.targetShelfId == null || this.newShelveData.targetShelfId.length < 1) {
        alert('Shelf is not populated')

      } else {

        axios.post(this.APIHOST + '/infra/removeStocksInMoveQ/', this.newShelveData, {
          headers: this.headers
        })
        .then(response => {
          console.log(response.data.response)
          alert('Transfer complete. New item shelved. See completed queue below.')
          this.reloadPage()
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })
      }   
      
    },

    getTransferQueue() {

      axios.get(this.APIHOST + '/infra/getLogsStocksInMoveQ/', {
        headers: this.headers,
        params: {
          shelved: 0, // queued items
        }
      })
      .then(response => {
        console.log(response.data.response)
        this.transferQueue = response.data.response

        for (let counter = 0; counter < this.transferQueue.length; counter ++) {
          let queue = {
            id: this.transferQueue[counter].id,
            createdDate: this.transferQueue[counter].createdDate,
            inventory_skuNumber: this.transferQueue[counter].inventoryId.skuNumber,
            inventory_name: this.transferQueue[counter].inventoryId.payloadSku.productName,
            inventory_quantity: this.transferQueue[counter].inventoryId.currentQuantity,
            inventory_batchNumber: this.transferQueue[counter].inventoryId.batchNumber,
            current_location: {
              shelfId: this.transferQueue[counter].inventoryId.shelfId.qualifiedName,
              binId: this.transferQueue[counter].inventoryId.binId != null ? this.transferQueue[counter].inventoryId.binId.qualifiedName : null,  
            },
            movePayload: this.transferQueue[counter].movePayload,
            target_location: {
              shelfId: this.transferQueue[counter].targetBinId !== null ? this.transferQueue[counter].targetBinId.qualifiedName : null,
              binId: this.transferQueue[counter].targetBinId != null ? this.transferQueue[counter].targetBinId.qualifiedName : null, 
            },
            shelvedBack: this.transferQueue[counter].shelvedBack,
          }

          this.transferQueueTableData.push(queue)
          // console.log(queue)
        }

        console.log(this.transferQueueTableData)

      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    getCompletedQueue() {
      axios.get(this.APIHOST + '/infra/getLogsStocksInMoveQ/', {
        headers: this.headers,
        params: {
          shelved: 1, // complete items
        }
      })
      .then(response => {
        console.log(response.data.response)
        this.completeQueue = response.data.response

        for (let counter = 0; counter < this.completeQueue.length; counter ++) {
          let queue = {
            id: this.completeQueue[counter].id,
            createdDate: this.completeQueue[counter].createdDate,
            inventory_skuNumber: this.completeQueue[counter].inventoryId.skuNumber,
            inventory_name: this.completeQueue[counter].inventoryId.payloadSku.productName,
            inventory_quantity: this.completeQueue[counter].inventoryId.currentQuantity,
            inventory_batchNumber: this.completeQueue[counter].inventoryId.batchNumber,
            current_location: {
              shelfId: this.completeQueue[counter].inventoryId.shelfId.qualifiedName,
              binId: this.completeQueue[counter].inventoryId.binId != null ? this.completeQueue[counter].inventoryId.binId.qualifiedName : null,  
            },
            movePayload: this.completeQueue[counter].movePayload,
            target_location: {
              shelfId: this.completeQueue[counter].targetBinId !== null ? this.completeQueue[counter].targetBinId.qualifiedName : null,
              binId: this.completeQueue[counter].targetBinId != null ? this.completeQueue[counter].targetBinId.qualifiedName : null, 
            },
            shelvedBack: this.completeQueue[counter].shelvedBack,
          }

          this.completeQueueTableData.push(queue)
          // console.log(queue)
        }

        console.log(this.completeQueueTableData)

      })
      // .catch(error => {
      //   alert(JSON.stringify(error.response.data))
      //   console.log(error)
      // })
    },

    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        //
      }
      this.validatedCustom01 = true
    },

    reloadPage() {
      location.reload()
    },


  }, // end of methods

  created() {
    this.getTransferQueue()
    this.getCompletedQueue()
  }, // end created

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

}

</script>


<style scoped>
  .divFixedWidthContent {
    width: 100%;
    overflow: auto;
    padding: 5px;
  }
</style>