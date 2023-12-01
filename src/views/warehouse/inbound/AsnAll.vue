  <template>
	<CRow class="mb-3">
		<CCol :md="12">
			<h2>Advance Shipment Notice (ASN)</h2>
		</CCol>
	</CRow>
  <CCard class="d-print-none hidden-print mb-5">
  	<CCardHeader>
  		<CRow>
  			<CCol :md="9">
  				<strong>All Advance Shipment Notices</strong>
  			</CCol>
  			<CCol :md="3" class="text-end">
  				<CButton color="primary" size="sm" v-on:click="this.$router.push('/inbound/asn-create')">New ASN</CButton>
  			</CCol>

  		</CRow>

  	</CCardHeader>
  	<CCardBody>
  		<CRow>
  			<CCol :md="12">
  				<!--
  					:items-per-page="5"
				    items-per-page-select
				  -->
  				<CSmartTable
				    cleaner
				    :columns="this.allAsnTableColumns"
				    header
				    :items-per-page="5"
				    items-per-page-select
				    :items="this.allAsnTableData"
				    pagination
				    table-filter
				    :table-props="{
				      hover: true,
				    }"
				    v-if="this.allAsnTableData.length > 0"
				  >

				  	<template #asnid="{ item }">
				  		<td class="text-center">
				  			<span>
					  			{{item.asnid.id}}
					  			<span v-if="item.grn_data !== undefined">
					  				<br>
					  				{{item.grn_data.grnId}}
					  			</span>
					  		</span>
				  			<!-- <br>
				  			<CCardImage class="d-block w-200" orientation="top" :src=item.asnid.barcode /> -->
				  		</td>
				  	</template>

				  	<template #ship_from="{ item }">
				  		<td>
				  			<strong>{{item.ship_from.name}}</strong>
				  			<br>
				  			<span class="text-medium-emphasis small">
				  				{{item.ship_from.address.address}},
				  				{{item.ship_from.address.city}},
				  				{{item.ship_from.address.zip}},
				  				{{item.ship_from.address.state}}
				  				{{item.ship_from.address.country}}
					  			<br>
					  			Email: {{item.ship_from.address.email}}
					  			<br>
					  			Phone: {{item.ship_from.address.phone}}
				  			</span>
				  		</td>
				  	</template>

				  	<template #ship_to="{ item }">
				  		<td>
				  			<span v-if="item.ship_to.warehouseDetails">
					  			<strong>{{item.ship_to.warehouseDetails.name}}</strong>
					  			<br>
					  			<span class="text-medium-emphasis small">
					  				{{item.ship_to.warehouseDetails.address.address}},
					  				{{item.ship_to.warehouseDetails.address.city}},
					  				{{item.ship_to.warehouseDetails.address.zip}},
					  				{{item.ship_to.warehouseDetails.address.state}}
					  				{{item.ship_to.warehouseDetails.address.country}}
						  			<br>
						  			Email: {{item.ship_to.warehouseDetails.address.email}}
						  			<br>
						  			Phone: {{item.ship_to.warehouseDetails.address.phone}}
					  			</span>
					  		</span>

					  		<span v-if="item.ship_to.retailerDetails">
					  			<strong>{{item.ship_to.retailerDetails.name}}</strong>
					  			<br>
					  			<span class="text-medium-emphasis small">
					  				{{item.ship_to.retailerDetails.address.address}},
					  				{{item.ship_to.retailerDetails.address.city}},
					  				{{item.ship_to.retailerDetails.address.zip}},
					  				{{item.ship_to.retailerDetails.address.state}}
					  				{{item.ship_to.retailerDetails.address.country}}
						  			<br>
						  			Email: {{item.ship_to.retailerDetails.address.email}}
						  			<br>
						  			Phone: {{item.ship_to.retailerDetails.address.phone}}
					  			</span>
					  		</span>

				  		</td>
				  	</template>

				    <template #status="{ item }">
				      <td>
				      	<CBadge class="mb-2" :color="getBadge(item.status.qc)">QC: {{ getBadgeValue(item.status.qc) }}</CBadge>
				      	<br>
				        <CBadge class="mb-2" :color="getBadge(item.status.grn)">GRN: {{ getBadgeValue(item.status.grn) }}</CBadge>
				        <br>
				        <CBadge class="mb-2" :color="getStage(item.status.stageStockIn)">Inventory: {{ getStageValue(item.status.stageStockIn) }}</CBadge>
				      </td>
				    </template>

				    <template #actions="{ item, index }">
				    	<td class="py-2 text-start">
				    		<CNavLink :href="'/#/print/asn-view?asn=' + item.asnid.id" target="_blank">
					    		<CButton color="dark" class="mb-2" variant="outline" size="sm">
					    			<CIcon icon="cil-folder-open" alt="View ASN details" />
					    		</CButton>
					    	</CNavLink>
				    	</td>
				    </template>

				</CSmartTable>
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
  name: "Advance Shipment Notice (View All)",

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

			totalCount: null,
			allAsn: null,
			selectedFilter: null,

			// headerToken
			APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': vueCookies.get('accessToken')
			},

	  	// table data
	  	allAsnTableData: [],
	  	allAsnTableColumns: [
		  	{
		  		key: 'asnid',
		  		label: 'ASN',
		  		_style: { width: '7%' },
		  	},
		  	{
		  		key: 'created',
		  		label: 'Time',
		  	},
		  	{
		  		key: 'ship_from',
		  		label: 'From',
		  	},
		  	{
		  		key: 'shipment_type',
		  		label: 'Type',
		  	},
		  	{
		  		key: 'ship_to',
		  		label: 'To',
		  	},
		  	{
		  		key: 'courier',
		  		label: 'Courier',
		  	},
		  	{
		  		key: 'pallets',
		  		label: 'Pallets',
		  	},
		  	{
		  		key: 'status',
		  		label: 'Status',
		  	},

		  	// extra for actions
		    {
		    	key: 'actions',
		    	label: 'Actions',
		    	_style: { width: '5%' },
		        filter: false,
		        sorter: false,
		    }
		  ],
    }
  }, //end of Data

  methods: {

  	getAllAsnDetails(params) {

  		//TODO: remove params later

      axios.get(this.APIHOST + '/inbound/get-all-asn/', {
      	params: {
      		page_seq: 1,
        	page_size: 1000,
      	},
      	headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.totalCount = response.data.response.totalCount
        this.allAsn = response.data.response.payloads

        // prepare data for table
        for (let counter = 0; counter < this.allAsn.length; counter++) {
        	let asnTableData = {
        		asnid: {
        			id: this.allAsn[counter].asnId,
        			barcode: this.allAsn[counter].payload.barcode
        		},
        		created: this.allAsn[counter].createddate + " " + this.allAsn[counter].createdtime,
        		ship_from: this.allAsn[counter].payload.shipFromDetails,
        		shipment_type: this.allAsn[counter].payload.shipToDetails.shipmentType,
        		ship_to: this.allAsn[counter].payload.shipToDetails,
        		courier: this.allAsn[counter].payload.shipmentDetails.courierType,
        		pallets: this.allAsn[counter].payload.pallets.length,
        		status: {
        			qc: this.allAsn[counter].grnUpdated,
        			grn: this.allAsn[counter].grnConfirmed,
        			stageStockIn: this.allAsn[counter].stageStockIn,
        		},
        		grn_data: this.allAsn[counter].grn
        	}

        	this.allAsnTableData.push(asnTableData)
        }

        console.log(this.allAsnTableData)

      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    applyFilter(event) {
    	// alert(event.target.value)
    	this.getAllAsnDetails(event.target.value)
    },

    callPrint() {
      window.print()
    },

  },

  created() {
  	this.getAllAsnDetails('')
  }, // end created

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate
}

</script>


<style scoped>

</style>
