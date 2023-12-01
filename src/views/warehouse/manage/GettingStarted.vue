<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Getting started</h2>
    </CCol>
  </CRow>
  
  <!-- A. Shopify integration -->
  <CAccordion class="mb-4" :active-item-key="1">
    <CAccordionItem :item-key="1">
      <CAccordionHeader>
        <strong>#1 Integrate your Shopify account</strong>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <CBadge color="warning">Pending</CBadge>
      </CAccordionHeader>
      <CAccordionBody>
        <CRow class="mt-1 mb-0">
          
          <CCol :md="12" class="mb-2">
            <p class="text-medium-emphasis">We will automatically fetch your SKU & Inventory details. <br>As your customers place orders on Shopify page we will be automatically notified of it and start to process orders immediately.</p>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="https://www.shopify.com/in/partners/blog/17056443-how-to-generate-a-shopify-api-token" target="_new" active>
              <CWidgetStatsC class="mb-3" color="dark" inverse :progress="{ value: 33 }"  title="Prepare API Keys" value="Step 1-A">
                <template #icon>
                  <CIcon icon="cil-notes" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/manage/integrations" active>
              <CWidgetStatsC class="mb-3" color="dark" inverse :progress="{ value: 66 }"  title="Add API Keys" value="Step 1-B">
                <template #icon>
                  <CIcon icon="cil-link" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/manage/integrations" active>
              <CWidgetStatsC class="mb-3" color="dark" inverse :progress="{ value: 100 }" title="Check SKUs" value="Step 1-C">
                <template #icon>
                  <CIcon icon="cil-spreadsheet" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

        </CRow>
      </CAccordionBody>
    </CAccordionItem>
  </CAccordion>


  <!-- B. Inbound Workflow -->
  <CAccordion class="mb-4" :active-item-key="1">
    <CAccordionItem :item-key="1">
      <CAccordionHeader>
        <strong>#2 Inbound items workflow</strong>
      </CAccordionHeader>
      <CAccordionBody>
        <CRow class="mt-1 mb-0">

          <CCol :md="12" class="mb-2">
            <p class="text-medium-emphasis">Follow these steps to start building your inventory for Order processing.<br>We will stock them into our Warehouse optimally for a quick turn-around time for processing of your Orders & delivery.</p>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/manage/address" active>
              <CWidgetStatsC class="mb-3" color="info" inverse :progress="{ value: 25 }"  title="Add your address" value="Step 2-A">
                <template #icon>
                  <CIcon icon="cil-address-book" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/inbound/asn-create" active>
              <CWidgetStatsC class="mb-3" color="info" inverse :progress="{ value: 50 }"  title="Create ASN" value="Step 2-B">
                <template #icon>
                  <CIcon icon="cil-bolt" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/inbound/asn" active>
              <CWidgetStatsC class="mb-3" color="info" inverse :progress="{ value: 75 }"  title="Track QC status" value="Step 2-C">
                <template #icon>
                  <CIcon icon="cil-bolt" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/inbound/grn-approve" active>
              <CWidgetStatsC class="mb-3" color="info" inverse :progress="{ value: 100 }"  title="Approve GRN" value="Step 2-D">
                <template #icon>
                  <CIcon icon="cil-arrow-thick-from-left" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

        </CRow>
      </CAccordionBody>
    </CAccordionItem>
  </CAccordion>


  <!-- C. Order Workflow -->
  <CAccordion class="mb-4" :active-item-key="1">
    <CAccordionItem :item-key="1">
      <CAccordionHeader>
        <strong>#3 Order workflow</strong>
      </CAccordionHeader>
      <CAccordionBody>
        <CRow class="mt-1 mb-0">

          <CCol :md="12" class="mb-2">
            <p class="text-medium-emphasis">View and Track your current orders.<br>We understand that in certain scenarios, you may've an ask to create certain orders manually, we've an option for that.</p>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/order-processing/all-orders" active>
              <CWidgetStatsC class="mb-3" color="primary" inverse :progress="{ value: 33 }" title="View Orders" value="Step 3-A">
                <template #icon>
                  <CIcon icon="cil-apps-settings" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/manage/sku" active>
              <CWidgetStatsC class="mb-3" color="primary" inverse :progress="{ value: 66 }" title="Track Orders" value="Step 3-B">
                <template #icon>
                  <CIcon icon="cil-spreadsheet" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

          <CCol :xs="12" :xl="2" :xm="2" :xd="2">
            <CNavLink href="/#/order-processing/order-form" active>
              <CWidgetStatsC class="mb-3" color="primary" inverse :progress="{ value: 100 }" title="Manual Order" value="Step 3-C">
                <template #icon>
                  <CIcon icon="cil-cart" height="36"/>
                </template>
              </CWidgetStatsC>
            </CNavLink>
          </CCol>

        </CRow>
      </CAccordionBody>
    </CAccordionItem>
  </CAccordion>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Getting started",
  
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
      
    }
  }, //end of Data

  methods: {

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

}

</script>


<style scoped>

</style>