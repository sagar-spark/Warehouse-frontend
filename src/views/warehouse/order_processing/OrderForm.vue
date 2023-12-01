 <template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Order Form</h2>
    </CCol>
  </CRow>
  
  <CRow>
  	<CForm class="row needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

      <CCol :md="12" v-if="this.selectedEmail">
        <CAlert color="danger" class="mb-2">
          <h6 class="mb-2">This order is being created from an email. See email content below and add details accordingly.</h6>
          <p class="text-medium-emphasis small mb-0">
            <CNavLink href="/#/order-processing/order-inbox" active>Back to Order Inbox</CNavLink>
          </p>
        </CAlert>
        <CCard text-color="dark" class="mb-4 border border-danger">
          <CCardHeader>
            <CRow>
              <CCol :md="3">
                <p class="text-medium-emphasis mb-0">Date</p>
                <h5>{{this.selectedEmail.created}}</h5>
              </CCol>
              <CCol :md="3">
                <p class="text-medium-emphasis mb-0">Vendor</p>
                <h5>{{this.selectedEmail.vendorId.payload.name}}</h5>
              </CCol>
              <CCol :md="6">
                <p class="text-medium-emphasis mb-0">subject</p>
                <h5>{{this.selectedEmail.subject.subject}}</h5>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <!-- <CFormFloating>
              <CFormTextarea floatingLabel="Email body" style="height: 200px" disabled :placeholder="this.selectedEmail.emailBody.body">
              </CFormTextarea>
            </CFormFloating> -->
            <div>
              <p class="text-medium-emphasis mb-1">Email body (scroll to see entire content)</p>
              <div class="divFixedHeightContent">
                <span v-html="this.selectedEmail.emailBody.body"></span>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

  		<CCol :md="9">

  			<CCard class="mb-4">
  				<CCardHeader>
  					<strong>Vendor details</strong>
  				</CCardHeader>
  				<CCardBody>
  					<div v-if="this.vendors === null">
  						<CSpinner color="primary" size="sm" />
  					</div>
  					<CRow v-if="this.vendors">
  						<CCol :md="12">
  							<CFormSelect v-model="this.order_data.vendorId" required>
                  <option value="">Choose</option>
                  <option v-for="(vendor, counter) in this.vendors" :value=vendor.id>
                    {{vendor.payload.name}}, {{vendor.address[0].address}}, {{vendor.address[0].city}}, {{vendor.payload.email}}, {{vendor.payload.phone}}
                  </option>
                </CFormSelect>
  						</CCol>
  					</CRow>
  				</CCardBody>
  			</CCard>


  			<CCard class="mb-4">
  				<CCardHeader>
  					<strong>Order references from External systems</strong>
  				</CCardHeader>
  				<CCardBody>
  					<CRow>
  						<CCol :md="5">
  							<CFormLabel>Order ID / Reference</CFormLabel>
  							<CFormInput v-model="this.order_data.external.order_id_reference" required />
  						</CCol>
  						<CCol :md="5">
  							<CFormLabel>Original order date</CFormLabel>
  							<CDatePicker v-model="this.order_data.external.order_date" footer locale="en-US" required />
  						</CCol>
  					</CRow>
  				</CCardBody>
  			</CCard>


  			<CCard class="mb-4">
  				<CCardHeader>
  					<CRow>
  						<CCol :md="6">
  							<strong>Order items</strong>
  						</CCol>
  						<CCol :md="6" class="text-end">
  							<CButton color="primary" size="sm" @click="this.addOrderItem()">Add item</CButton>
  						</CCol>
  					</CRow>
		       </CCardHeader>
		       
		       <CCardBody>

		        	<CRow v-if="this.order_data.items.length > 0">
	        			<!-- <CCol :md="2" class="text-center"><strong>Item SKU</strong></CCol> -->
	        			<CCol :md="5"><strong>Name, description</strong></CCol>
	        			<CCol :md="2"><strong>Price, {{this.order_data.billingCurrency}}</strong></CCol>
	        			<CCol :md="2"><strong>Quantity</strong></CCol>
	        			<CCol :md="2"><strong>Amt, {{this.order_data.billingCurrency}}</strong></CCol>
	        		</CRow>

		        	<div v-for="(item, counter) in this.order_data.items" v-bind:key="counter">
		        		<hr class="mb-2">
		        		<CRow class="mb-0">
		        			<!-- <CCol :md="2" class="text-center">
		        				<CCardImage orientation="top" :src=item.barcode />
		        			</CCol> -->
		        			<CCol :md="5">
		        				<strong>{{item.title}}, {{item.variantTitle}}</strong><br>
		        				<span class="text-medium-emphasis" v-html="item.name"></span><br>
		        				<strong class="text-success">Available quantity: </strong>
		        				<span class="text-success">{{item.currentQuantity}}</span>
		        			</CCol>
		        			<CCol :md="2">
			      				<CFormInput placeholder="price" v-model="item.price" class="mb-2" required />
		        			</CCol>
		        			<CCol :md="2">
			      				<CFormInput placeholder="quantity" v-model="item.quantity" class="mb-2" required />
			      				<span v-if="item.quantity > item.currentQuantity" class="text-danger">More than available quantity</span>
		        			</CCol>
		        			<CCol :md="2">
			      				{{this.order_data.billingCurrency}}&nbsp;{{this.total_price_per_item(counter)}}
		        			</CCol>
		        			<CCol :md="1" class="text-center">
		        				<code class="highlighter-rouge">
		        					<CIcon icon="cil-trash" class="" @click="this.deleteOrderItem(counter)" />
		        				</code>
		        			</CCol>
		        		</CRow>
		        	</div>

		        	<CRow v-if="this.order_data.items.length > 0">
		        		<hr class="mb-3 mt-3">
	        			<CCol :md="7">
	        				Total items
	        				<h4>{{this.order_data.items.length}}</h4>
	        			</CCol>
	        			<CCol :md="2">
	        				Total quantity
	        				<h4>{{this.total_order_details().totalOrderQuantity}}</h4>
	        			</CCol>
	        			<CCol :md="3">
	        				Total amount
	        				<h4>{{this.order_data.billingCurrency}}&nbsp;{{this.total_order_details().totalOrderAmount}}</h4>
	        			</CCol>
	        		</CRow>

		        </CCardBody>
		    </CCard>

		    <CButton color="primary" type="submit">Create Order</CButton>
  		</CCol>

  		<CCol :md="3">
  			<CCard class="mb-3">

  				<CCardHeader>
  					<strong>Customer details</strong>
		      </CCardHeader>

	        <CCardBody>
	        	<CRow>
	        		<CCol :md="12" class="mb-2">
	        			<CFormFloating>
                   <CFormInput v-model="this.order_data.customer.name" :placeholder="this.order_data.customer.name" required />
                   <CFormLabel>Name</CFormLabel>
                 </CFormFloating>
	        		</CCol>

	        		<CCol :md="12" class="mb-2">
	        			<CFormFloating>
	        				<CFormInput v-model="this.order_data.customer.contact.phone" :placeholder="this.order_data.customer.contact.phone" required />
	        				<CFormLabel>Phone</CFormLabel>
	        			</CFormFloating>
	        		</CCol>

	        		<CCol :md="12" class="mb-2">
	        			<CFormFloating>
	        				<CFormInput v-model="this.order_data.customer.contact.email" :placeholder="this.order_data.customer.contact.email" required />
	        				<CFormLabel>Email</CFormLabel>
	        			</CFormFloating>
	        		</CCol>
	        	</CRow>
	        </CCardBody>
	      </CCard>

	      <CCard class="mb-3">

  				<CCardHeader>
  					<strong>Shipping address</strong>
		      </CCardHeader>

	        <CCardBody>
	        	<CRow>
      				<CCol :md="12" class="mb-2">
      					<CFormFloating>
	      					<CFormInput v-model="this.order_data.customer.shipping_address.addressline" required />
	      					<CFormLabel>Address Line</CFormLabel>
	      				</CFormFloating>
      				</CCol>

      				<CCol :md="12" class="mb-2">
      					<CFormFloating>
	      					<CFormInput v-model="this.order_data.customer.shipping_address.city" required />
	      					<CFormLabel>City</CFormLabel>
      					</CFormFloating>
      				</CCol>

      				<CCol :md="12" class="mb-2">
      					<CFormFloating>
      						<CFormInput v-model="this.order_data.customer.shipping_address.state" required />
      						<CFormLabel>State</CFormLabel>
      					</CFormFloating>
      				</CCol>

      				<CCol :md="12" class="mb-2">
      					<CFormFloating>
      						<CFormInput v-model="this.order_data.customer.shipping_address.country" required />
      						<CFormLabel>Country</CFormLabel>
      					</CFormFloating>
      				</CCol>

      				<CCol :md="12" class="mb-2">
      					<CFormFloating>
      						<CFormInput v-model="this.order_data.customer.shipping_address.zip" required />
      						<CFormLabel>Zip</CFormLabel>
      					</CFormFloating>
      				</CCol>
      			</CRow>

	        </CCardBody>
	      </CCard>

	      <CCard class="mb-3">

  				<CCardHeader>
  					<strong>Billing address</strong>
		      </CCardHeader>

	        <CCardBody>

      			<CRow>
      				<CCol :md="12" class="mb-2">
      					<CFormCheck v-model="this.order_data.customer.same_shipping_billing_address" id="sameShippingBillingAaddress" label="Same as Shipping address"/>
      				</CCol>

      				<CRow v-if="this.order_data.customer.same_shipping_billing_address != true">

	      				<CCol :md="12" class="mb-2">
	      					<CFormFloating>
	      						<CFormInput v-model="this.order_data.customer.billing_address.addressline" required />
	      						<CFormLabel>Address Line</CFormLabel>
	      					</CFormFloating>
	      				</CCol>
			        			
	      				<CCol :md="12" class="mb-2">
	      					<CFormFloating>
	      						<CFormInput v-model="this.order_data.customer.billing_address.city" required />
	      						<CFormLabel>City</CFormLabel>
	      					</CFormFloating>
	      				</CCol>

	      				<CCol :md="12" class="mb-2">
	      					<CFormFloating>
	      						<CFormInput v-model="this.order_data.customer.billing_address.state" required />
	      						<CFormLabel>State</CFormLabel>
	      					</CFormFloating>
	      				</CCol>

	      				<CCol :md="12" class="mb-2">
	      					<CFormFloating>
	      						<CFormInput v-model="this.order_data.customer.billing_address.country" required />
	      						<CFormLabel>Country</CFormLabel>
	      					</CFormFloating>
	      				</CCol>

	      				<CCol :md="12" class="mb-2">
	      					<CFormFloating>
	      						<CFormInput v-model="this.order_data.customer.billing_address.zip" required />
	      						<CFormLabel>Zip</CFormLabel>
	      					</CFormFloating>
	      				</CCol>

	      			</CRow>

		        </CRow>

		       </CCardBody>
  			</CCard>

  		</CCol>

	</CForm>
  </CRow>

  <!-- Modal for SKU variant -->
  <CModal 
    alignment="center" 
    scrollable 
    size="xl"
    backdrop="static"
    :visible="skuVariantModelView" 
    @close="this.clearVariantSelection()">

    <CModalHeader 
      dismiss
      @close="this.clearVariantSelection()">
      <CModalTitle>
        Choose SKU or Variant
      </CModalTitle>
    </CModalHeader>
    
    <CModalBody>
      <CRow class="mb-3">
        <CCol :md="3">
          <CFormLabel class="text-medium-emphasis small">Item SKU or Name</CFormLabel>
          <CFormInput v-model="skuSearch" required @keyup.enter="this.getSKUbyID()" />
        </CCol>
        <CCol :md="1">
          <CFormLabel class="text-medium-emphasis small">&nbsp;</CFormLabel><br>
          <CButton color="primary" @click="this.getSKUbyID()">
            <CIcon icon="cil-search" class="" />
          </CButton>
        </CCol>
      </CRow>
      <hr>
      <CRow>
        <CCol :xs="12">
          <div v-if="this.skuVariants != null">
            <div v-if="this.skuVariants.length > 0">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Choose</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SKU</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Variant ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Variant Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Current Qty</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Images</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  <CTableRow v-for="(variant, indexVariant) in this.skuVariants">
                    <CTableDataCell scope="col">
                      <CFormCheck 
                        v-if="variant.currentQuantity > 0"
                        type="radio" 
                        name="skuVariantIndexSelected"
                        :id="variant.skuNumber+indexVariant"
                        :value="indexVariant"
                        v-on:input="selectVariantIndex($event)" />
                    </CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">{{variant.skuNumber}}</CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">
                      {{variant.payloadSku.productName}}<br>
                      <span class="text-medium-emphasis" v-html="variant.payloadSku.description"></span>
                    </CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">{{variant.payloadSku.variantId}}</CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">{{variant.payloadSku.variantName}}</CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">
                      <span class="text-danger" v-if="variant.currentQuantity <= 0">{{variant.currentQuantity}}</span>
                      <span class="text-success" v-if="variant.currentQuantity > 0">{{variant.currentQuantity}}</span>
                    </CTableDataCell>
                    <CTableDataCell scope="col">
                      <CNavLink :href="image" target="_new" active v-for="image in variant.payloadSku.images">
                        <CIcon icon="cil-image" alt="View images" />
                      </CNavLink>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>

            <div v-if="this.skuVariants == 0">
              <span class="text-medium-emphasis warning">No SKUs found.</span>
            </div>

          </div>
        </CCol>
      </CRow>
    </CModalBody>
    
    <CModalFooter>
      
      <CButton 
        color="secondary" 
        @click="this.clearVariantSelection()">
        Cancel
      </CButton>

      <CButton 
        color="primary" 
        v-if="this.skuVariantIndexSelected !== null" 
        @click="this.selectSKUVariant()">
        Finish
      </CButton>

    </CModalFooter>

  </CModal>
  
</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Order Form",
  
  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      // models
      validatedCustom01: null,

      // user_role: storeUserRole.getters.currentRole,
      vendors: null,

      //SKU add item modal view
      skuVariantModelView: false,
      skuSearch: null,
      skuVariants: null,
      skuVariantIndexSelected: null,

      order_data: {
        vendorId: null,
        vendorCreated: false,  // false in case of warehouse, true in case of vendor

      	customer: {
      		name: null,
      		contact: {
      			phone: null,
      			email: null,
      		},
      		same_shipping_billing_address: true,
      		shipping_address: {
      			addressline: null,
      			city: null,
      			state: null,
      			country: null,
      			zip: null,
      		},
      		billing_address: {
      			addressline: null,
      			city: null,
      			state: null,
      			country: null,
      			zip: null,
      		},
      	},

      	billingCurrency: "KWD",

      	external: {
          order_id_reference: null,
          order_date: null,
        },

      	items: [],
      }, // end order_data

      // email details
      selectedEmail: null,
      viaEmail: false,

    }
  }, //end of Data

  methods: {

    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.submitOrder()
      }
      this.validatedCustom01 = true
    },

    clearVariantSelection() {
      // clear all
      this.skuSearch = null
      this.skuVariants = null
      this.skuVariantIndexSelected = null
      this.skuVariantModelView = false
    },

    selectVariantIndex(event) {
      this.skuVariantIndexSelected = event.target.value
    },

    selectSKUVariant() {
      if (this.skuVariantIndexSelected == null) {
        alert("Select SKU to proceed.")
      } else {
        // set values in package index and make it visible
        let itemSelected = this.skuVariants[this.skuVariantIndexSelected]

        let new_item = {
    			inventoryId: itemSelected.id,
          sku: itemSelected.payloadSku.skuNumber,
    			title: itemSelected.payloadSku.productName,
          name: itemSelected.payloadSku.description,
  				variantId: itemSelected.payloadSku.variantId,
          variantTitle: itemSelected.payloadSku.variantName, 
          requiresShipping: true,
  				price: null,
  				quantity: null,
          currentQuantity: itemSelected.currentQuantity,
        }

        this.order_data.items.push(new_item)

        // clear everything related to modal
        this.clearVariantSelection()
      }
      
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

    addOrderItem(counter) {
      if (this.order_data.vendorId == null) {
        alert('Select vendor details to proceed')
      } else {
    	 this.skuVariantModelView = true
      }
    },

    deleteOrderItem(counter) {
    	let response = confirm("This will remove current item details. Are you sure?")
    	if (response === true) {
        this.order_data.items.splice(counter, 1)
      }
    },

    getSKUbyID() {

      axios.get(this.APIHOST + '/infra/getVendorSkuFromInventory/', {
        params: {
          vendorId: this.order_data.vendorId,
          query: this.skuSearch,
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.skuVariants = response.data.response
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.response))
        console.log(error)
      })

    },

  	total_price_per_item(itemIndex) {
  		return Math.round((parseFloat(this.order_data.items[itemIndex].price) * parseInt(this.order_data.items[itemIndex].quantity)) || '', 2)
  	},

  	total_order_details() {
  		let totalOrderAmount = 0
  		let totalOrderQuantity = 0

  		for (var counter = 0; counter<this.order_data.items.length; counter++) {

  			totalOrderAmount = Math.round((totalOrderAmount + (parseFloat(this.order_data.items[counter].price) * parseFloat(this.order_data.items[counter].quantity))) || '', 2)

  			totalOrderQuantity = (totalOrderQuantity + parseInt(this.order_data.items[counter].quantity)) || ''
  		}

  		return {totalOrderAmount, totalOrderQuantity}
  	},

    submitOrder() {
    	// manage address
    	if (this.order_data.items.length < 1) {
    		alert('Your order should have atleast 1 item.')

    	} else {
    		
    		if (this.order_data.customer.same_shipping_billing_address == true) {
	    		this.order_data.customer.billing_address = this.order_data.customer.shipping_address
	    	}

        // Parse amount and quantity
        for (var counter = 0; counter<this.order_data.items.length; counter++) {
          this.order_data.items[counter].price = parseFloat(this.order_data.items[counter].price)
          this.order_data.items[counter].quantity = parseInt(this.order_data.items[counter].quantity)
        }

	    	console.log(this.order_data)
    		
        axios.post(this.APIHOST + '/infra/createCustomOrder/', this.order_data, {
          headers: this.headers
        })
        .then(response => {
          console.log(response.data.response)
          alert('Order successfully created.')

          // mark email read if viaEmail = true
          if (this.viaEmail == true) {
            axios.post(this.APIHOST + '/infra/markVendorOrderEmailRead/?emailId=' + this.selectedEmail.id, {}, {
              headers: this.headers
            })
            .then(response => {
              console.log(response.data.response)
              this.$router.push('/order-processing/all-orders')
            })
            .catch(error => {
              alert(JSON.stringify(error.response.data))
              console.log(error)
            })
          } else {
            this.$router.push('/order-processing/all-orders')
          }

        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })

    	}
    	
    }, 

    selectRadio(elementId, indexVariant) {
      document.getElementById(elementId+indexVariant).checked = true
      this.skuVariantIndexSelected = indexVariant // for bug fix: enable Confirm button on selection, mimic function: selectVariantIndex(event) from above
    }, 

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    
    // Check for emailId as param 
    // if present, pull email and specific vendor
    // else, pull all vendors without email

    let urlParams = this.$route.query

    if (urlParams.emailId !== undefined) {
      // fetch email details
      axios.get(this.APIHOST + '/infra/getSpecificEmailFromId/', {
        params: {
          emailId: urlParams.emailId
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.selectedEmail = response.data.response

        if (this.selectedEmail.status == 'NEW') {
          // assign vendor
          this.vendors = [this.selectedEmail.vendorId]
          // set viaEmail
          this.viaEmail = true
        } else {
          alert('Email is already actioned. You will not be able to create an order from this.')
          this.selectedEmail = null
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.response))
        console.log(error)
      })
    }
    else {
      this.getVendorDetails()
    }

  }, // end created

}

</script>


<style scoped>

.divFixedHeightContent {
  border: 1px solid grey;
  height: 280px;
  overflow: auto;
  padding: 10px;
  background: #F8F8F8;
}

</style>