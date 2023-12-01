<template>
	<div class="print-area">

		<table v-if="this.shippingDetails" width="100%">
			<tr>
				<td width="50%" valign="top">
					<h3 class="mb-0">Shipping Label</h3>
					<span class="h5">AWB: <strong>{{this.shippingDetails.awbNumber}}</strong></span>
					<br>
					<br>
					<br>
					<span class="h5">
						<strong>Ship To:</strong>
						<br>
						{{this.shippingDetails.payload.to.name}}
						<br>
						{{this.shippingDetails.payload.to.shipping_address.addressline}}&nbsp;
						{{this.shippingDetails.payload.to.shipping_address.address1}}&nbsp;
						{{this.shippingDetails.payload.to.shipping_address.address2}}
						
						<br>{{this.shippingDetails.payload.to.shipping_address.city}}, {{this.shippingDetails.payload.to.shipping_address.state}} - {{this.shippingDetails.payload.to.shipping_address.zip}}
						<br>{{this.shippingDetails.payload.to.shipping_address.country}}
					</span>
				</td>
				<td width="50%" class="align-items-center align-middle text-center" valign="top">
					<img class="w-100 mt-4" :src=this.shippingDetails.payload.barcode style="margin-top: -30px;" />
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<br>
					<p class="text-medium">
						Customer self declaration: The goods sold are intended for end user consumption. Not for resale.
					</p>
					<hr class="mt-1 mb-1">
				</td>
			</tr>
			<!-- <tr>
				<td colspan="2">
					<hr>
				</td>
			</tr> -->
			<tr>
				<td class="p-2" colspan="2">
					<p class="mb-0"><span class="h5">Fulfilled by:</span></p>
					<img orientation="bottom" class="w-25 mt-2" src='@/assets/images/connectco/connect-co-print-logo.png' alt="ConnectCo" />
				</td>
			</tr>
		</table>

	</div>
</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'
import ccPrintLogo from '@/assets/images/connectco/logo_main_with_tagline.png'

export default {
  name: "Shipping Label",
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
      selectedOrderId: null,
      selectedAwb: null,
      shippingDetails: null,
    }
  },

  methods: {

  	getOrderDetails() {
  		this.selectedOrderId = this.$route.query.orderId
  		this.selectedAwb = this.$route.query.awb

  		if (this.selectedOrderId == undefined || this.selectedOrderId == null || this.selectedAwb == undefined || this.selectedAwb == null) {
  			alert("Invalid selection - close this window and try again")
  		} else {

  			// axios.get(this.APIHOST + '/infra/getOrderItemsByOrderId/', {
	      // 	params: {
	      // 		orderId: this.selectedOrderId,
	      // 		includeShippingDetails: true,
	      // 	},
	      // 	headers: this.headers,
	      // })
	      // .then(response => {
	      // 	console.log(response.data.response)
	      // 	this.orderDetails = response.data.response
	      // })
	      // .catch(error => {
	      // 	alert(JSON.stringify(error.response.data))
        //   console.log(error)
	      // })

	      axios.get(this.APIHOST + '/infra/getShippingByAWB/', {
	      	params: {
	      		awbNumber: this.selectedAwb
	      	},
	      	headers: this.headers,
	      })
	      .then(response => {
	      	console.log(response.data.response)
	      	this.shippingDetails = response.data.response
	      })
	      .catch(error => {
	      	alert(JSON.stringify(error.response.data))
          console.log(error)
	      })

  		}

  	},

  	callPrint() {
    	window.print()
    }

  }, //end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
  	this.getOrderDetails()
  }, // end created

  mounted() {
  	// this.callPrint()
  },

}

</script>

<style scoped>
	.print-area {
	    width: 40rem;
	    position:fixed; 
	    top: 5px; 
	    left: 5px; 
	    border: 1px solid black;
	    padding: 15px;
	    /* z-index:9999; */
  }

  .color-border {
  	color: black;
  }

  @media print {
	  @page { margin: 0; size: auto;}
	  body { margin: 1.6cm; }
	}
</style>
