<template>

  <div v-if="this.orderDetails">
    <CRow class="mt-4">
      <CCol :md="6">
        <p class="text-medium-emphasis small mb-0">Order number</p>
        <h6>{{this.orderDetails.externalOrderId}} / {{this.orderDetails.id}}</h6>
      </CCol>
      <CCol :md="6">
        <p class="text-medium-emphasis small mb-0">Order date</p>
        <h6>{{this.orderDetails.createdDate}}</h6>
      </CCol>
      <hr>
      <CCol :md="12">
        <p class="text-medium-emphasis small mb-0">Customer details</p>
        <h6>{{this.orderDetails.customer.name}}</h6>
        <h6>
          Email: {{this.orderDetails.customer.contact.email}}, 
          Phone: 
            <span v-if="this.orderDetails.customer.contact.phone">{{this.orderDetails.customer.contact.phone}}</span>
            <span v-else-if="this.orderDetails.customer.shipping_address.phone">{{this.orderDetails.customer.shipping_address.phone}}</span>
            <span v-else>Not provided</span>
          </h6>
      </CCol>
      <hr>
      <CCol :md="6">
        <p class="text-medium-emphasis small mb-0">Shipping address</p>
        <h6>
          {{this.orderDetails.customer.shipping_address.addressline}}
          {{this.orderDetails.customer.shipping_address.address1}}, 
          {{this.orderDetails.customer.shipping_address.address2}}
          <br>
          {{this.orderDetails.customer.shipping_address.city}}, 
          {{this.orderDetails.customer.shipping_address.state}},
          {{this.orderDetails.customer.shipping_address.province}}
          <br>
          {{this.orderDetails.customer.shipping_address.country}} - {{this.orderDetails.customer.shipping_address.zip}}
        </h6>
      </CCol>
      <CCol :md="6">
        <p class="text-medium-emphasis small mb-0">Billing address</p>
        <h6>
          {{this.orderDetails.customer.billing_address.addressline}}
          {{this.orderDetails.customer.billing_address.address1}}, 
          {{this.orderDetails.customer.billing_address.address2}}
          <br>
          {{this.orderDetails.customer.billing_address.city}}, 
          {{this.orderDetails.customer.billing_address.state}},
          {{this.orderDetails.customer.billing_address.province}}
          <br>
          {{this.orderDetails.customer.billing_address.country}} - {{this.orderDetails.customer.billing_address.zip}}
        </h6>
      </CCol>
      <hr>
      <CCol :md="12">
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Product Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Unit price</CTableHeaderCell>
              <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
           <CTableBody>
            <CTableRow v-for="(order_item, counter) in this.orderDetails.orderItems">
              <CTableHeaderCell scope="row">{{counter+1}}</CTableHeaderCell>
              <CTableDataCell>{{order_item.itemPayload.title}}, {{order_item.itemPayload.variantTitle}}
                <br>
                <CBadge class="mb-2" :color="getOrderStatusBadge(order_item.recentStatus).color">{{ getOrderStatusBadge(order_item.recentStatus).name }}</CBadge>
              </CTableDataCell>
              <CTableDataCell>{{order_item.itemPayload.price}}</CTableDataCell>
              <CTableDataCell>{{order_item.itemPayload.quantity}}</CTableDataCell>
              <CTableDataCell>KWD {{order_item.itemPayload.price * order_item.itemPayload.quantity}}</CTableDataCell>
            </CTableRow>
           </CTableBody>
        </CTable>
      </CCol>
      <hr>
      <!-- <CCol :md="6">
        <p class="text-medium-emphasis small mb-0">Total amount</p>
        <h6 v-if="this.orderDetailsTotalAmount > 0">KWD {{this.orderDetailsTotalAmount}}</h6>
      </CCol> -->
    </CRow>
  </div>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: "Order view",

  setup() {

    const getFriendlySource = (source) => {
      switch (source) {
        case 'ORDER_FORM': return 'Order Form'
        case 'SHOPIFY': return 'Shopify'
        default: return source
      }
    }

    const getOrderStatusBadge = (order_status) => {
      switch (order_status) {
        case 'created': return {name: 'CREATED', color: 'dark'}
        case 'cancelled': return {name: 'CANCELLED', color: 'danger'}
        case 'packed': return {name: 'PACKED', color: 'info'}
        case 'picked': return {name: 'FULFILLMENT', color: 'info'}
        case 'sortdrop': return {name: 'FULFILLMENT', color: 'info'}
        case 'shipped': return {name: 'SHIPPED', color: 'primary'}
        case 'delivered': return {name: 'DELIVERED', color: 'success'}
        case 'exchange': return {name: 'EXCHANGED', color: 'warning'}
      }
    }

    return {
      getFriendlySource,
      getOrderStatusBadge,
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
	    queryOrder: null,
      orderDetails: null,
      orderDetailsTotalAmount: 0,
    }
  },

  methods: {

    getOrderDetails() {
      this.queryOrder = this.$route.query.order

      if (this.queryOrder == undefined || this.queryOrder == null) {
        alert('Invalid selection - close this window and try again')
      } else {
        axios.get(this.APIHOST + '/infra/getOrderItems/', {
          params: {
            order_id: this.queryOrder,
            includeShippingDetails: true,
          },
          headers: this.headers,
        })
        .then(response => {
          console.log(response.data.response)
          this.orderDetails = response.data.response.payloads[0]

          for (let counter = 0; counter < this.orderDetails.items.length; counter++) {
            this.orderDetailsTotalAmount = this.orderDetailsTotalAmount + (this.orderDetails.items[counter].price * this.orderDetails.items[counter].quantity)
          }

        })
        // .catch(error => {
        //   alert(JSON.stringify(error.response.data))
        //   console.log(error)
        // })
      }

    },
  	

  }, //end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
  	this.getOrderDetails()
  }, // end created

  mounted() {
  	
  },

}
	
</script>

<style scoped>

</style>