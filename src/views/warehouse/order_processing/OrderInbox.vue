<template>
  <CRow>
    <CCol :xs="12" class="mb-2">
      <h2>Order Inbox (via email)</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <span v-if="this.allOrdersEmailData.length > 0" class="h4">{{this.allOrdersEmailData.length}}&nbsp;</span>
          <strong>New emails</strong>
        </CCardHeader>
        <CCardBody>
          <span v-if="this.allOrdersEmail == null">
            <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading...
          </span>
          <CSmartTable cleaner :columns="this.allOrdersEmailColumns" header :items-per-page="20" items-per-page-select :items="this.allOrdersEmailData" pagination columnSorter table-filter :table-props="{
              hover: true,
            }" v-if="this.allOrdersEmailData.length > 0"
          >
            <template #actions="{ item }">
              <td>

                <CDropdown color="primary" direction="dropup-center">
                  <CDropdownToggle color="primary">
                    <CIcon icon="cil-running" class="mt-1" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem v-on:click="this.openEmailViewModal(item)">View Email</CDropdownItem>
                    <CDropdownDivider/>
                    <CDropdownItem v-on:click="this.createManualOrder(item.id)">Create Manual Order from this email</CDropdownItem>
                    <CDropdownItem v-on:click="this.markEmailRead(item.id, 'Ignore (this email is not needed for Manual Order creation)')">Ignore (this email is not needed for Manual Order creation)</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>

                <!-- <CButton color="dark" size="sm" class="mt-1 mb-1" variant="outline" v-on:click="this.openEmailViewModal(item)">
                  <CIcon icon="cil-running" class="mt-1" alt="Show details"/>
                </CButton> -->

              </td>
            </template>
            
          </CSmartTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>


  <!-- Modal for email body view & manual order placement -->
  <CModal alignment="center" scrollable size="xl" backdrop="static" :visible="this.emailViewModal" 
    @close="this.closeEmailViewModal()">

    <CModalHeader dismiss @close="this.closeEmailViewModal()">
      <CModalTitle>Email View</CModalTitle>
    </CModalHeader>
    
    <CModalBody v-if="this.selectedEmail" class="bg-light">
      <CRow>
        <CCol :md="12">
          <CCard text-color="dark" class="mb-4 border">
            <CCardHeader>
              <CRow>
                <CCol :md="3">
                  <p class="text-medium-emphasis mb-0">Date</p>
                  <h5>{{this.selectedEmail.dt_ts}}</h5>
                </CCol>
                <CCol :md="3">
                  <p class="text-medium-emphasis mb-0">Vendor</p>
                  <h5>{{this.selectedEmail.vendor}}</h5>
                </CCol>
                <CCol :md="6">
                  <p class="text-medium-emphasis mb-0">subject</p>
                  <h5>{{this.selectedEmail.subject}}</h5>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <span v-html="this.selectedEmail.body"></span>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CModalBody>
    
    <CModalFooter>
      <CDropdown color="primary" direction="dropup-center">
        <CDropdownToggle color="primary">
          <CIcon icon="cil-running" class="mt-1" />
        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem v-on:click="this.createManualOrder(this.selectedEmail.id)">Create Manual Order from this email</CDropdownItem>
          <CDropdownItem v-on:click="this.markEmailRead(this.selectedEmail.id, 'Ignore (this email is not needed for Manual Order creation)')">Ignore (this email is not needed for Manual Order creation)</CDropdownItem>
          <CDropdownDivider/>
          <CDropdownItem v-on:click="this.closeEmailViewModal()">Close (Without any action)</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

    </CModalFooter>
  </CModal>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Order Inbox",

  
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
      allOrdersEmail: null,
      allOrdersEmailData: [],
      allOrdersEmailColumns: [
        {
          key: 'dt_ts',
          label: 'Date / Time',
        },
        {
          key: 'status',
          label: 'Status',
        },
        {
          key: 'vendor',
          label: 'Vendor',
        },
        {
          key: 'subject',
          label: 'Subject',
        },
        // {
        //   key: 'body',
        //   label: 'Content',
        // },
        {
          key: 'actions',
          label: 'Actions',
        },
      ],

      // modals
      emailViewModal: false,
      selectedEmail: null,

      // manual order form
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
      
    }
  }, //end of Data

  methods: {

    getAllOrderEmails() {
      axios.get(this.APIHOST + '/infra/getVendorOrderEmails/', {
        params: {
          status: "NEW",
          page_seq: 1,
          page_size: 1000,
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.allOrdersEmail = response.data.response.payloads

        // prepare data for Smart table
        for (let counter = 0; counter < this.allOrdersEmail.length; counter++) {
          let email_details = {
            id: this.allOrdersEmail[counter].id,
            emailNum: this.allOrdersEmail[counter].emailNum,
            status: this.allOrdersEmail[counter].status,
            vendor: this.allOrdersEmail[counter].vendorId.payload.name,
            subject: this.allOrdersEmail[counter].subject.subject,
            body: this.allOrdersEmail[counter].emailBody.body,
            dt_ts: this.allOrdersEmail[counter].created,
          }

          this.allOrdersEmailData.push(email_details)

        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.response))
        console.log(error)
      })
    },

    markEmailRead(emailId, action) {

      axios.post(this.APIHOST + '/infra/markVendorOrderEmailRead/?emailId=' + emailId, {}, {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        alert('Email actioned as - ' + action)
        this.reloadPage()
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    createManualOrder(emailId) {
      alert('Will be re-directed to Manual order form')
      this.$router.push('/order-processing/order-form?emailId=' + emailId)
    },

    openEmailViewModal(email) {
      this.emailViewModal = true
      this.selectedEmail = email
    },

    closeEmailViewModal() {
      this.emailViewModal = false 
      this.selectedEmail = null
    },

    reloadPage() {
      location.reload()
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getAllOrderEmails()
  }, // end created

}

</script>


<style scoped>

</style>