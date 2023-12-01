<template>

  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Shipping & Delivery assignment</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :md="12">
      <CCard class="mb-2">
        <CCardHeader>
          <span v-if="this.allShippedPackages.length > 0">
            <span class="h4">{{Object.keys(this.allShippedPackages).length}}</span> 
            <strong> packages are in-progress for delivery</strong>
          </span>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol :md="4" class="mb-3" v-for="(awb, awbIndex) in this.allShippedPackages">
              <CCard text-color="dark" class="mb-1 border border-secondary">
                <CCardHeader class="bg-light">
                  <CLink class="btn btn-primary btn-sm me-1 float-end" :href="'#/print/shipping-label?orderId=' + awb.orderId + '&awb=' + awb.awbNumber" target="_blank">
                    <CIcon icon="cil-print" size="sm" />
                  </CLink>
                  <span class="text-medium-emphasis mb-0">AWB<br>
                    <span class="h5 mb-1">{{awb.awbNumber}}</span>
                  </span>
                  <!-- <CNavLink class="me-1 float-end" :href="'#/print/shipping-label?orderId=' + awb.orderId + '&awb=' + awb.awbNumber" target="_blank" active>
                    <CButton color="primary" size="sm"><CIcon icon="cil-print" /></CButton>
                  </CNavLink> -->
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol :md="6" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Direction</p>
                      <h5>{{awb.direction}}</h5>
                    </CCol>
                    <CCol :md="6" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Order #</p>
                      <h5>{{awb.orderId}}</h5>
                    </CCol>
                    <CCol :md="6" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Items in box</p>
                      <h5>{{awb.orderItems.length}}</h5>
                    </CCol>
                    <CCol :md="6" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Expected delivery date</p>
                      <h5></h5>
                    </CCol>
                    <CCol :md="12" class="mb-1">
                      <p class="text-medium-emphasis mb-0">Delivery area</p>
                      <h6>{{awb.payload.to.shipping_address.addressline}}, {{awb.payload.to.shipping_address.city}}, {{awb.payload.to.shipping_address.zip}}<br>
                        {{awb.payload.to.shipping_address.state}}, {{awb.payload.to.shipping_address.country}}
                      </h6>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CModal alignment="center" backdrop="static" :visible="this.viewModalDeliveryAssign" @close="this.clearDeliveryAgentModal()">
    <CModalHeader dismiss color="bg-primary" @close="this.clearDeliveryAgentModal()">
      <CModalTitle>
        Assign Delivery executive
      </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <span class="text-center">
        <p class="text-medium-emphasis small mb-0">AWB Number:</p>
        <h3 class="mb-3">
          {{this.selectedAWBForAssignment.awbNumber}}
        </h3>

        <p class="text-medium-emphasis mb-0">Delivery area</p>
        <h5 class="mb-3">
          {{this.selectedAWBForAssignment.payload.to.shipping_address.addressline}}, {{this.selectedAWBForAssignment.payload.to.shipping_address.city}}, {{this.selectedAWBForAssignment.payload.to.shipping_address.zip}}<br>
          {{this.selectedAWBForAssignment.payload.to.shipping_address.state}}, {{this.selectedAWBForAssignment.payload.to.shipping_address.country}}
        </h5>
        
        <CFormSelect v-on:input="setDeliveryAgent($event)" required v-if="this.allDeliveryAgents.length > 0">
          <option value="">Choose executive</option>
          <option v-for="(executive, counter) in this.allDeliveryAgents" :value="counter">
            {{executive.name}}, Warehouse ({{executive.wId}}), {{executive.email}}, {{executive.phone}}
          </option>
        </CFormSelect>
      </span>
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" v-on:click="this.clearDeliveryAgentModal()">Cancel</CButton>
      <CButton color="primary" v-on:click="this.assignDeliveryAgent()">Assign</CButton>
    </CModalFooter>
  </CModal>

  <CModal alignment="center" backdrop="static" fullscreen size="xl" :visible="this.viewModalExecutiveWorkloadModal" @close="this.clearWorkloadModal()">
    <CModalHeader dismiss color="bg-primary" @close="this.clearWorkloadModal()">
      <CModalTitle>
        View Workload by Delivery agent
      </CModalTitle>
    </CModalHeader>
    
    <CModalBody v-if="Object.keys(this.assignedPackagesOrderedByDeliveryEx).length > 0">
      <CRow>
        <CCol :xs="12" :md="3" v-for="(assigned_packages, executive_email) in this.assignedPackagesOrderedByDeliveryEx" class="mb-3" :key=executive_email>
          <CCard text-color="dark" class="mb-1 border border-secondary">
            <CCardHeader class="bg-light text-center text-align-center">
              <p class="text-medium-emphasis mb-0">{{executive_email}}</p>
              <h4 class="mb-2">{{assigned_packages[0].deliveryAgent.name}}</h4>

              <p class="text-medium-emphasis small mb-0">Total undelivered packages</p>
              <h4 class="mb-0">{{assigned_packages.length}}</h4>
            </CCardHeader>
            <CCardBody>
              <CCard v-for="deliverypackage in assigned_packages" class="mb-2">
                <CCardBody class="bg-light">
                  <p class="text-medium-emphasis small mb-0">AWB</p>
                  <h6 class="mb-2">{{deliverypackage.awbNumber}}</h6>
                  <p class="text-medium-emphasis small mb-0">Delivery area</p>
                  <h6 class="mb-0">
                    {{deliverypackage.payload.to.shipping_address.addressline}}, {{deliverypackage.payload.to.shipping_address.city}}, {{deliverypackage.payload.to.shipping_address.zip}}
                    <br>
                    {{deliverypackage.payload.to.shipping_address.state}}, {{deliverypackage.payload.to.shipping_address.country}}
                  </h6>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" v-on:click="this.clearWorkloadModal()">Close</CButton>
    </CModalFooter>
  </CModal>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Shipping & Delivery assignment",
  
  data: () => {
    return {

      //form
      validatedCustom01: null,

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      //models
      allShippedPackages: [],
      allDeliveryAgents: [],
      assignedPackages: null,
      assignedPackagesOrderedByDeliveryEx: {},
      // allItems: null,

      //modal - delivery assign
      viewModalDeliveryAssign: false,
      selectedAWBForAssignment: null,
      selectedAgentForAssignment: null,

      //modal - executive workload
      viewModalExecutiveWorkloadModal: false,
      
    }
  }, //end of Data

  methods: {

    getShippedPackages() {
      axios.get(this.APIHOST + '/infra/getAllAWB/', {
        params: {
          page_size: 100,
          page_seq: 1,
          delivery_agent_assigned: false,
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.allShippedPackages = response.data.response.payloads
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
    },

    // getShippedItems() {
    //   axios.get(this.APIHOST + '/infra/getOrderItemsByOrderId/', {
    //     params: {
    //       orderId: 'ALL',
    //       orderStatus: 'packed'
    //     },
    //     headers: this.headers,
    //   })
    //   .then(response => {
    //     console.log(response.data.response)
    //     this.allItems = response.data.response
        
    //   })
    //   .catch(error => {
    //     alert(JSON.stringify(error.response.data))
    //     console.log(error)
    //   })
    // },

    getDelivertAgents() {
      axios.get(this.APIHOST + '/infra/getAllWarehouseUsers/', {
        params: {
          role: 'Delivery',
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.allDeliveryAgents = response.data.response
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
    },

    clearDeliveryAgentModal() {
      this.selectedAWBForAssignment = null
      this.selectedAgentForAssignment = null
      this.viewModalDeliveryAssign = false
    },

    selectDeliveryAgent(awbIndex) {
      this.selectedAWBForAssignment = this.allShippedPackages[awbIndex]
      this.viewModalDeliveryAssign = true
    },

    setDeliveryAgent(event) {
      if (event.target.value == '') {
        this.selectedAgentForAssignment = null
      } else {
        this.selectedAgentForAssignment = event.target.value
      } 
    },

    assignDeliveryAgent() {
      if (this.selectedAgentForAssignment == null) {
        alert('Choose a Delivery executive first.')
      } else {

        let response = confirm("This will assign delivery executive. Are you sure?")

        if (response == true) {

          // TODO: update each row
          for (let counter=0; counter<this.selectedAWBForAssignment.orderItems.length; counter++) {
            let submitPayload = {
              rowId: this.selectedAWBForAssignment.orderItems[counter],
              newStatus: 'shipped',
              payload: {
                awbNumber: this.selectedAWBForAssignment.awbNumber,
                deliveryAgent: this.allDeliveryAgents[this.selectedAgentForAssignment]
              }
            }

            console.log(submitPayload)

            axios.post(this.APIHOST + '/infra/updateOrderItemByRowId/', submitPayload, {
              headers: this.headers
            })
            .then(response => {
              
            })
            .catch(error => {
              alert(JSON.stringify(error.response.data))
              console.log(error)
            })

          } //end of loop for order items update

          axios.post(this.APIHOST + '/infra/assignDeliveryAgentToShipping/', {
            awbNumber: this.selectedAWBForAssignment.awbNumber,
            email: this.allDeliveryAgents[this.selectedAgentForAssignment].email
          }, 
            { headers: this.headers })
          .then(response => {
            if (response.status == 200) {
              if (alert("Delivery executive assigned.")) {} 
              else {
                this.reloadPage() 
              }
            }
          })
          .catch(error => {
            alert(JSON.stringify(error.response.data))
            console.log(error)
          })
        }
      }

    },

    getAssignedItems() {
      // exclude delivered
      axios.get(this.APIHOST + '/infra/getAllAWB/', {
        params: {
          page_size: 100,
          page_seq: 1,
          delivery_agent_assigned: true,
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.assignedPackages = response.data.response.payloads

        // arrange by delivery executive
        for (let counter=0; counter <this.assignedPackages.length; counter++) {
          let agent_email = this.assignedPackages[counter].deliveryAgent.email

          if (this.assignedPackagesOrderedByDeliveryEx[agent_email] == undefined) {
            this.assignedPackagesOrderedByDeliveryEx[agent_email] = [this.assignedPackages[counter]]
          } else {
            let existing_packages = this.assignedPackagesOrderedByDeliveryEx[agent_email]
            existing_packages.push(this.assignedPackages[counter])
            this.assignedPackagesOrderedByDeliveryEx[agent_email] = existing_packages
          }
        }

        console.log(this.assignedPackagesOrderedByDeliveryEx)
        this.viewModalExecutiveWorkloadModal = true
        
      })
      // .catch(error => {
      //   alert(JSON.stringify(error.response.data))
      //   console.log(error)
      // })
    },

    clearWorkloadModal() {
      this.viewModalExecutiveWorkloadModal = false
    },

    reloadPage() {
      location.reload()
    },


  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getShippedPackages()
    // this.getShippedItems()
    this.getDelivertAgents()
  }, // end created

}

</script>


<style scoped>

</style>
