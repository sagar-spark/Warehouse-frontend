<template>
  <CRow class="mb-3">
    <CCol :xs="12">
        <h2>Vendor Inventory</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol class :sm="12" :md="12" :lg="12">
      <CAlert color="warning">
        <span class="h5">Note</span>
        <p class="mb-0 text-medium-emphasis">
          <ul class="mb-0">
            <li>Fetching inventory may take time depending on number of SKUs for a Vendor</li>
            <li>Once you've selected a vendor, please be patient while the data is scanned & fetched</li>
          </ul>
        </p>
      </CAlert>
    </CCol>
  </CRow>

  <CCard class="mb-4">
    <CCardHeader>
      <strong>Inventory details</strong>
    </CCardHeader>
    <CCardBody>
      <CRow v-if="this.vendors" class="mb-4">
        <CCol :md="12">
          <CFormSelect v-model="this.vendorId" required @update:modelValue='(vendorId) => {
            this.setVendorId(vendorId)
          }' >
            <option value="">Choose vendor</option>
            <option v-for="(vendor, counter) in this.vendors" :value=vendor.vendorId>
              {{vendor.payload.name}}, {{vendor.address[0].address}}, {{vendor.address[0].city}}, {{vendor.payload.email}}, {{vendor.payload.phone}}
            </option>
          </CFormSelect>
        </CCol>
      </CRow>

      <CRow>
        <CCol :xs="12">

          <p v-if="this.showInvLoader == true"><CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading inventory data...</p>
          <p class="h4 mb-3"><span v-if="this.showInvLoader == false">{{this.records}} inventory items</span></p>

          <CSmartTable
            cleaner
            :columns="this.tableHeader"
            header
            :items-per-page="50"
            items-per-page-select
            :items="this.inventories"
            pagination
            table-filter
            :table-props="{
              hover: true,
            }"
            v-if="this.inventories.length > 0"
          >

            <template #skuNumber="{ item }">
              <td> <b>SKU:</b> {{ item.skuNumber }} <br>
              <b>Batch:</b> {{ item.batchNumber }} </td>
            </template>

            <template #barcode="{ item }">
              <td scope="col" width="12%" class="text-center align-center">
                <CNavLink :href="'/#/print/sku-barcode?barcodePath=' + item.barcode" target="_blank">
                  <CCardImage orientation="top" :src=item.barcode />
                </CNavLink>
              </td>
            </template>

            <template #location="{ item }">
              <td>
                <span v-html=item.location />
              </td>
            </template>

          </CSmartTable>

          <!-- <CSmartTable
            :columns="this.tableHeader"
            :items="this.tableContent"
            :itemsPerPage="itemsPerPage"
            itemsPerPageSelect
            :loading="this.tableContentLoading"
            :pagination="{
              external: true,
            }"
            :paginationProps="{
              activePage: activePage,
              pages: Math.ceil(records / itemsPerPage) || 1,
            }"
            :tableProps="{
              hover: true,
              responsive: true,
            }"
            @active-Page-change="(activePage) => setActivePage(activePage)"

            @items-per-page-change="(itemsPerPage) => {
              setActivePage(1)
              setItemsPerPage(itemsPerPage)
            }"
            table-filter
          >

          <template #skuNumber="{ item }">
            <td> <b>SKU:</b> {{ item.skuNumber }} <br>
            <b>Batch:</b> {{ item.batchNumber }} </td>
          </template>

          <template #productName="{ item }">
            <td> {{ item.payload.packageDescription }} </td>
          </template>

          <template #location="{ item }">
            <td> <b>Shelf Id:</b>  {{ item.shelfId.qualifiedName }} <br>
              <span v-if="item.binId">
                <b>Bin Id:</b> {{ item.binId.qualifiedName }}
              </span>
            </td>
          </template>

          <template #barcode="{ item }">
            <td scope="col" width="12%" class="text-center align-center">
              <CNavLink :href="'/#/print/sku-barcode?barcodePath=' + item.payloadSku.barcode" target="_blank">
                <CCardImage orientation="top" :src=item.payloadSku.barcode />
              </CNavLink>
            </td>
          </template>

          </CSmartTable> -->

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
  name: "Manage Inventories",
  
  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      validatedCustom01: false,
      selectedVendorId: 'a63ec5f1-cdcb-4ead-942c-139d1da5ecec',

      // Smart Table Properties
      activePage: 1,
      itemsPerPage: 50,
      tableContentLoading: false,
      tableHeader: [
        { key: "barcode", label: 'Barcode'},
        { key: "skuNumber", label: 'SKU & Batch'},
        { key: "productName", label: 'Product Name'},
        { key: "currentQuantity", label: 'Current quantity'},
        { key: "location", label: 'Location'},
      ],
      tableContent: [],
      records: null,
      vendors: null,
      vendorId: null,

      inventories: [],
      showInventory: false,
      showInvLoader: null,

    }
  }, //end of Data

  methods: {

    setVendorId(vendorId) {
      this.showInvLoader = true
      this.inventories = []
      console.log("Vendor selected: ", vendorId);
      this.vendorId = vendorId;
      this.getAllInventories()
    },

    getVendorDetails() {

      axios.get(this.APIHOST + '/infra/getAllVendors/', {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.vendors = response.data.response
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    setActivePage(page) {
      this.activePage = page
      this.getAllInventories()
    },

    setItemsPerPage(items) {
      this.itemsPerPage = items
      this.getAllInventories()
    },

    getAllInventories() {

      if (this.vendorId === null)
        return

      this.tableContentLoading = true
      axios.get(
        // this.APIHOST + 
        // "/infra/getInventoryItems/?vendorId=" + this.vendorId +
        // "&page_size=" + this.itemsPerPage +
        // "&page_seq=" + (this.activePage - 1), {headers: this.headers})
        this.APIHOST + 
        "/infra/getInventoryItems/?vendorId=" + this.vendorId +
        "&page_size=100000" +
        "&page_seq=1", {headers: this.headers})

      .then(response => {
        console.log("Inventory Data: ", response.data.response.payloads);
        this.tableContent = response.data.response.payloads;
        this.records = response.data.response.totalCount;
        this.tableContentLoading = false


        // Organize inventory
        this.inventories = []
        for (let counter = 0; counter < this.records; counter++) {

          let inventory = {
            barcode: this.tableContent[counter].payloadSku.barcode,
            skuNumber: this.tableContent[counter].skuNumber,
            batchNumber: this.tableContent[counter].batchNumber,
            currentQuantity: this.tableContent[counter].currentQuantity,
            productName: this.tableContent[counter].payload.packageDescription,
            location: "<strong>Shelf</strong>: " + ((this.tableContent[counter].shelfId == null) ? 'NA' : this.tableContent[counter].shelfId.qualifiedName) + "<br><strong>Bin</strong>: " + ((this.tableContent[counter].binId == null) ? 'NA' : this.tableContent[counter].binId.qualifiedName)
          }
          this.inventories.push(inventory)

        }
        console.log(this.inventories)
        this.showInvLoader = false

      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error.response.data);
        this.tableContentLoading = false
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
    this.getVendorDetails()
    this.getAllInventories()
  }, // end created

}

</script>
<style scoped></style>