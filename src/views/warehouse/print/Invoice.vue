<template>
	<div class="print-area">
		<table v-if="this.orderDetails" width="100%">
			<tr>
				<td colspan="2">
					<h3 class="mb-0">Invoice</h3>
					<p class="mb-3">(Original for receipt)</p>
				</td>
			</tr>

			<tr>
				<td width="50%" valign="top">
					<strong>Sold by:</strong>
					<br>{{this.orderDetails.vendorId.name}}
					<br>{{this.orderDetails.vendorId.email}}
					<br>{{this.orderDetails.vendorId.phone}}
				</td>

				<td width="50%" valign="top">
					<strong>Shipping address:</strong>
					<br>{{this.orderDetails.customer.name}}
					<br>{{this.orderDetails.customer.shipping_address.address1}},
					<br>{{this.orderDetails.customer.shipping_address.address2}},
					<br>{{this.orderDetails.customer.shipping_address.city}}, {{this.orderDetails.customer.shipping_address.state}} - {{this.orderDetails.customer.shipping_address.zip}}
					<br>{{this.orderDetails.customer.shipping_address.country}}
					<br>Email: {{this.orderDetails.customer.contact.email}}
					<br>Phone: {{this.orderDetails.customer.phone}}
					<br>
					<br><strong>Billing address:</strong>
					<br>{{this.orderDetails.customer.billing_address.address1}},
					<br>{{this.orderDetails.customer.billing_address.address2}},
					<br>{{this.orderDetails.customer.billing_address.city}}, {{this.orderDetails.customer.billing_address.state}} - {{this.orderDetails.customer.billing_address.zip}}
					<br>{{this.orderDetails.customer.billing_address.country}}
				</td>
			</tr>
			
			<tr>
				<td colspan="2">
					<hr>
				</td>
			</tr>

			<tr>
				<td width="50%" valign="top">
					<strong>Order number: </strong> {{this.orderDetails.externalOrderId}} / {{this.orderDetails.id}}
				</td>
				<td width="50%" valign="top">
					<strong>Order date: </strong> {{this.orderDetails.createdDate}}
				</td>
			</tr>
		</table>
		<br>

		<table v-if="this.orderDetails" width="100%" class="tableBorderColor">
			<tr class="tableBorderColor tableBackgroundFill">
				<td width="5%" class="p-2 tableBorderColor"><strong>#</strong></td>
				<td class="p-2 tableBorderColor"><strong>Description</strong></td>
				<td width="15%" class="text-end p-2 tableBorderColor"><strong>Unit price</strong></td>
				<td width="10%" class="text-end p-2 tableBorderColor"><strong>Quantity</strong></td>
				<td width="15%" class="text-end p-2 tableBorderColor"><strong>Amount</strong></td>
			</tr>
			
			<tr v-if="this.filteredOrderItems" v-for="(order_item, counter) in this.filteredOrderItems" class="tableBorderColor">
				<td class="p-2 tableBorderColor">{{counter+1}}</td>
				<td class="p-2 tableBorderColor">{{order_item.itemPayload.title}}, {{order_item.itemPayload.variantTitle}}</td>
				<td class="p-2 text-end tableBorderColor">{{order_item.itemPayload.price}}</td>
				<td class="p-2 text-end tableBorderColor">{{order_item.itemPayload.quantity}}</td>
				<td class="p-2 text-end tableBorderColor">{{order_item.itemPayload.price * order_item.itemPayload.quantity}}</td>
			</tr>

			<tr class="tableBorderColor">
				<td colspan="3" class="p-2 tableBorderColor">
					<strong>Total</strong>
				</td>
				<td class="p-2 tableBorderColor tableBackgroundFill text-end">
					<strong>{{this.totalItemsCount}}</strong>
				</td>
				<td class="p-2 tableBorderColor tableBackgroundFill text-end">
					<strong>{{this.totalItemsAmount}}</strong>
				</td>
			</tr>

			<!-- <tr class="tableBorderColor">
				<td colspan="5" class="p-2 tableBorderColor">
					<strong>Amount in words:</strong>
					<br>some amount in words
				</td>
			</tr> -->
			
		</table>
		<br>

		<table width="100%">
			<tr>
				<td class="p-2">
					<strong>Fulfilled by:</strong>
					<br>ConnectCo Warehouse, Amghara Industrial Area, Amghara, Jahra, Kuwait, 13085
					<br>
					<img orientation="bottom" class="w-25 mt-4" src='@/assets/images/connectco/connect-co-print-logo.png' alt="ConnectCo" />
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
  name: "Print invoice",
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
      orderId: null,
      orderItems: null,
      orderDetails: null,
      filteredOrderItems: [],
      totalItemsCount: 0,
      totalItemsAmount: 0,
    }
  },

  methods: {

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
        this.orderDetails = response.data.response.payloads[0]

        for (let counter = 0; counter < this.orderDetails.orderItems.length; counter++) {
        	console.log(this.orderItems)
        	console.log(this.orderDetails.orderItems[counter].id)
        	if (this.orderItems.includes(this.orderDetails.orderItems[counter].id.toString())) {
        		this.filteredOrderItems.push(this.orderDetails.orderItems[counter])
        		this.totalItemsCount = this.totalItemsCount + this.orderDetails.orderItems[counter].itemPayload.quantity
        		this.totalItemsAmount = this.totalItemsAmount + (this.orderDetails.orderItems[counter].itemPayload.price * this.orderDetails.orderItems[counter].itemPayload.quantity)
        	}
        }

      })

    },

  	getSelections() {
  		this.orderId = this.$route.query.orderId
  		let orderItemsCombined = this.$route.query.items

  		if (this.orderId == undefined || this.orderId == null || orderItemsCombined == undefined || orderItemsCombined == null) {
  			alert('Invalid parameters - close this window and try again')
  		} else {
  			this.orderItems = orderItemsCombined.split("^^")

  			if (this.orderItems == undefined || this.orderItems == null || this.orderItems.length < 1) {
  				alert('Invalid parameters - close this window and try again')
  			} else {
  				// call APIs to get details

  				this.getSelectedOrderDetails(this.orderId)
  				
  			}
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
  	this.getSelections()
  }, // end created

  mounted() {
  	// this.callPrint()
  },

}

</script>

<style scoped>
	.tableBorderColor {
		border: 1px #d5d6d9 solid;
	}

	.tableBackgroundFill {
		background: #f1f4f7;
	}

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
