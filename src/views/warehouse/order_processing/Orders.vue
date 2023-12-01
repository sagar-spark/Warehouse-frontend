<template>
  <CRow>
    <CCol :xs="12" class="mb-2">
      <h2>Orders</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>All Orders</strong>
        </CCardHeader>
        <CCardBody>
          <span v-if="this.ordersTableData.length == 0">
            <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading...
          </span>
          <CSmartTable
            :columns="this.ordersTableColumns"
            :items="this.ordersTableData"
            :itemsPerPage="this.itemsPerPage"
            itemsPerPageSelect
            :loading="this.tableContentLoading"
            :pagination="{ external: true, }"
            :paginationProps="{ activePage: activePage, pages: Math.ceil(records / itemsPerPage) || 1,}"
            :table-props="{ hover: true, responsive: true,}"
            @active-Page-change="(activePage) => setActivePage(activePage)"
            @items-per-page-change="(itemsPerPage) => {
              setActivePage(1)
              setItemsPerPage(itemsPerPage)
            }"
            v-if="this.ordersTableData.length > 0"
            cleaner
            header
            columnSorter
            table-filter
          >

            <template #order_id="{ item }">
              <td>
                {{item.order_id.id}}
                <p class="text-medium-emphasis small">Ref: {{item.order_id.externalOrderId}}</p>
              </td>
            </template>

            <template #dt_ts="{ item }">
              <td>
                {{item.dt_ts.dt}}
                <p class="text-medium-emphasis small" v-if="item.dt_ts.originalDate">Ref: {{item.dt_ts.originalDate}}</p>
              </td>
            </template>

            <template #source="{ item }">
              <td>
                {{getFriendlySource(item.source)}} <br>
                <hr>
                <b>{{item.vendorId.name}}</b>
              </td>
            </template>

            <template #amount="{ item }">
              <td>
                {{item.amount.billing_currency}}&nbsp;{{item.amount.billingAmount}}
              </td>
            </template>

            <template #customer="{ item }">
              <td>
                <strong>{{item.customer.name}}</strong>
                <p class="text-medium-emphasis small">
                  Phone: 
                    <strong>
                      <span v-if="item.customer.contact.phone">{{item.customer.contact.phone}}</span>
                      <span v-else-if="item.customer.shipping_address.phone">{{item.customer.shipping_address.phone}}</span>
                      <span v-else>Not provided</span>
                    </strong>, 
                  Email: <strong>{{item.customer.contact.email}}</strong><br>
                  {{item.customer.shipping_address.addressline}}{{item.customer.shipping_address.address1}} {{item.customer.shipping_address.address2}}, 

                  {{item.customer.shipping_address.city}}, 
                  {{item.customer.shipping_address.state}}, 
                  {{item.customer.shipping_address.province}}<br>
                  {{item.customer.shipping_address.country}} - {{item.customer.shipping_address.zip}}
                </p>
              </td>
            </template>

            <template #items="{ item }">
              <td width="35%">
                <CRow v-for="(order_item, itemIndex) in item.items">
                  <CCol :md="7">
                    {{order_item.itemPayload.quantity}} x 
                    <strong>
                      <span v-html="order_item.itemPayload.title"></span>
                    </strong>
                    <br>
                    <span class="text-medium-emphasis small" v-if="order_item.itemPayload.variantTitle" v-html="order_item.itemPayload.variantTitle"></span>
                    <br>
                    <span class="text-medium-emphasis small" v-if="order_item.itemPayload.name" v-html="order_item.itemPayload.name"></span>
                  </CCol>
                  <CCol :md="3">
                    <span class="text-medium-emphasis small">
                      <!-- <CBadge class="mb-2" :color="getOrderStatusBadge(order_item.recentStatus).color">{{ getOrderStatusBadge(order_item.recentStatus).name }}</CBadge> -->
                      <CBadge class="mb-2" :color="getOrderStatusBadge(this.getRecentStatus(order_item.itemStatus)).color">{{ getOrderStatusBadge(this.getRecentStatus(order_item.itemStatus)).name }}</CBadge>
                    </span>
                  </CCol>
                  <CCol :md="2">

                    <CDropdown color="primary" direction="dropup-center">

                      <!-- Order details & tracking -->
                      <CDropdownToggle color="primary">
                        <CIcon icon="cil-running" class="mt-1" />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem v-on:click="this.showOrderDetailsModal(item)">View Order details</CDropdownItem>
                        <CDropdownItem v-on:click="this.showModalItemMovement(order_item.itemStatus)">View Tracking details</CDropdownItem>
                        
                        <CDropdownDivider/>
                        
                        <!-- Returns -->
                        <CDropdownItem v-if="order_item.recentStatus != 'cancelled'" v-on:click="this.showOrderReturnModal(item, order_item, false)">Return</CDropdownItem>
                        <CDropdownItem v-if="order_item.recentStatus != 'cancelled'" v-on:click="this.showOrderReturnModal(item, order_item, true)">Exchange</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>

                    <!-- <CButton color="primary" size="sm" class="mt-1 mb-1" variant="outline" @click="this.cancelOrderItem(order_item.id, order_item.itemPayload.title, order_item.itemPayload.variantTitle, order_item.itemPayload.quantity)">
                      <CIcon icon="cil-x" alt="Cancel order" />
                    </CButton>
                    <br>
                    <CButton color="dark" size="sm" class="mt-1 mb-1" variant="outline" @click="this.showModalItemMovement(order_item.itemStatus)">
                      <CIcon icon="cil-running" class="mt-1" alt="Show details"/>
                    </CButton> -->

                  </CCol>
                  
                  <hr class="mt-1" style="dotted" v-if="item.items.length > 1 && itemIndex < item.items.length -1">
                </CRow>
              </td>
            </template>
          </CSmartTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>


  <!-- Modal for item movement -->
  <CModal alignment="center" backdrop="static" :visible="this.viewModalItemMovement" @close="this.clearModalItemMovement()">

    <CModalHeader dismiss color="bg-primary" @close="this.clearModalItemMovement()">
      <CModalTitle>
        Item movement details
      </CModalTitle>
    </CModalHeader>

    <CModalBody>

      <CRow class="mb-0">
        <CCol :md="12">
          <span v-if="this.selectedItemMovementDetails.exchange !== undefined">
            <CAlert color="warning" class="mb-2">
              <h6 class="mb-2">This item has been canceled due to Exchange / Created in lieu of an Exchange</h6>
              <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.exchange.timestamp}}, {{this.selectedItemMovementDetails.exchange.userId.userId}}</p>
            </CAlert>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-cart" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.created !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('created').color">{{ getOrderStatusBadge('created').name }}</CBadge>&nbsp;&nbsp;
              <strong>Order Created</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.created.timestamp}}, {{this.selectedItemMovementDetails.created.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('created').color">{{ getOrderStatusBadge('created').name }}</CBadge>
              <br>
              <strong>Order Created</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-braille" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.picked !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('picked').color">{{ getOrderStatusBadge('picked').name }}</CBadge>&nbsp;&nbsp;
              <strong>Item picked at Warehouse</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.picked.timestamp}}, {{this.selectedItemMovementDetails.picked.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('picked').color">{{ getOrderStatusBadge('picked').name }}</CBadge>&nbsp;&nbsp;
              <strong>Item picked at Warehouse</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-hand-point-down" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.sortdrop !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('sortdrop').color">{{ getOrderStatusBadge('sortdrop').name }}</CBadge>&nbsp;&nbsp;
              <strong>Arrived at Sorting area</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.sortdrop.timestamp}}, {{this.selectedItemMovementDetails.sortdrop.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('sortdrop').color">{{ getOrderStatusBadge('sortdrop').name }}</CBadge>&nbsp;&nbsp;
              <strong>Arrived at Sorting area</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-blur-linear" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.packed !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('packed').color">{{ getOrderStatusBadge('packed').name }}</CBadge>&nbsp;&nbsp;
              <strong>Quality checked & Packed</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.packed.timestamp}}, {{this.selectedItemMovementDetails.packed.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('packed').color">{{ getOrderStatusBadge('packed').name }}</CBadge>&nbsp;&nbsp;
              <strong>Quality checked & Packed</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-blur-linear" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails['AGENT ASSIGNED'] !== undefined || this.selectedItemMovementDetails['OUT FOR DELIVERY'] !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('shipped').color">{{ getOrderStatusBadge('shipped').name }}</CBadge>&nbsp;&nbsp;
              <span v-if="this.selectedItemMovementDetails['AGENT ASSIGNED'] !== undefined">
                <strong>Agent assigned</strong>
                <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails['AGENT ASSIGNED'].timestamp}}, {{this.selectedItemMovementDetails['AGENT ASSIGNED'].userId.userId}}</p>
              </span>
            </span>
          </span>
          <span v-else>
            <CBadge class="mb-2" :color="getOrderStatusBadge('shipped').color">{{ getOrderStatusBadge('shipped').name }}</CBadge>&nbsp;&nbsp;
            <span class="secondary">
              <strong>Shipped</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-truck" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails['DELIVERED'] !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('delivered').color">{{ getOrderStatusBadge('delivered').name }}</CBadge>&nbsp;&nbsp;
              <strong>Delivered</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails['DELIVERED'].timestamp}}, {{this.selectedItemMovementDetails['DELIVERED'].userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('delivered').color">{{ getOrderStatusBadge('delivered').name }}</CBadge>&nbsp;&nbsp;
              <strong>Delivered</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <div v-if="this.selectedItemMovementDetails.cancelled !== undefined">
        <hr>
        <CRow class="mb-0">
          <CCol :md="1">
            <CIcon icon="cil-truck" />
          </CCol>
          <CCol :md="11">
            <span v-if="this.selectedItemMovementDetails.cancelled !== undefined">
              <span class="primary">
                <CBadge class="mb-2" :color="getOrderStatusBadge('cancelled').color">{{ getOrderStatusBadge('cancelled').name }}</CBadge>&nbsp;&nbsp;
                <strong>Cancelled</strong>
              </span>
              <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.cancelled.timestamp}}, {{this.selectedItemMovementDetails.cancelled.userId.userId}}</p>
            </span>
            <span v-else>
              <span class="secondary">
                <CBadge class="mb-2" :color="getOrderStatusBadge('cancelled').color">{{ getOrderStatusBadge('cancelled').name }}</CBadge>&nbsp;&nbsp;
                <strong>Cancelled</strong>
              </span>
              <p class="text-medium-emphasis small mb-0">Pending</p>
            </span>
          </CCol>
        </CRow>
      </div>

      <hr style="dashed">
      
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" @click="this.clearModalItemMovement()">Close</CButton>
    </CModalFooter>

  </CModal>


  <!-- Modal for order details -->
  <CModal alignment="center" size="lg" backdrop="static" :visible="this.viewModalOrderDetails" @close="this.clearOrderDetailsModal()">

    <CModalHeader dismiss color="bg-primary" @close="this.clearOrderDetailsModal()">
      <CModalTitle>Order details</CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CRow v-if="this.selectedOrderForModal">
        <CCol :md="6">
          <p class="text-medium-emphasis small mb-0">Order number</p>
          <h6>{{this.selectedOrderForModal.order_id.externalOrderId}} / {{this.selectedOrderForModal.order_id.id}}</h6>
        </CCol>
        <CCol :md="6">
          <p class="text-medium-emphasis small mb-0">Order date</p>
          <h6>{{this.selectedOrderForModal.dt_ts.dt}}</h6>
        </CCol>
        <hr>
        <CCol :md="12">
          <p class="text-medium-emphasis small mb-0">Customer details</p>
          <h6>{{this.selectedOrderForModal.customer.name}}</h6>
          <h6>
            Email: {{this.selectedOrderForModal.customer.contact.email}}, 
            Phone: 
              <span v-if="this.selectedOrderForModal.customer.contact.phone">{{this.selectedOrderForModal.customer.contact.phone}}</span>
              <span v-else-if="this.selectedOrderForModal.customer.shipping_address.phone">{{this.selectedOrderForModal.customer.shipping_address.phone}}</span>
              <span v-else>Not provided</span>
            </h6>
        </CCol>
        <hr>
        <CCol :md="6">
          <p class="text-medium-emphasis small mb-0">Shipping address</p>
          <h6>
            {{this.selectedOrderForModal.customer.shipping_address.addressline}}
            {{this.selectedOrderForModal.customer.shipping_address.address1}}, 
            {{this.selectedOrderForModal.customer.shipping_address.address2}}
            <br>
            {{this.selectedOrderForModal.customer.shipping_address.city}}, 
            {{this.selectedOrderForModal.customer.shipping_address.state}},
            {{this.selectedOrderForModal.customer.shipping_address.province}}
            <br>
            {{this.selectedOrderForModal.customer.shipping_address.country}} - {{this.selectedOrderForModal.customer.shipping_address.zip}}
          </h6>
        </CCol>
        <CCol :md="6">
          <p class="text-medium-emphasis small mb-0">Billing address</p>
          <h6>
            {{this.selectedOrderForModal.customer.billing_address.addressline}}
            {{this.selectedOrderForModal.customer.billing_address.address1}}, 
            {{this.selectedOrderForModal.customer.billing_address.address2}}
            <br>
            {{this.selectedOrderForModal.customer.billing_address.city}}, 
            {{this.selectedOrderForModal.customer.billing_address.state}},
            {{this.selectedOrderForModal.customer.billing_address.province}}
            <br>
            {{this.selectedOrderForModal.customer.billing_address.country}} - {{this.selectedOrderForModal.customer.billing_address.zip}}
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
              <CTableRow v-for="(order_item, counter) in this.selectedOrderForModal.items">
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
        <CCol :md="6">
          <p class="text-medium-emphasis small mb-0">Total amount</p>
          <h6 v-if="this.selectedOrderForModalTotalAmount > 0">KWD {{this.selectedOrderForModalTotalAmount}}</h6>
        </CCol>
      </CRow>
    </CModalBody>

    <CModalFooter>
      <CNavLink :href="'/#/print/order-view?order=' + this.selectedOrderForModal.order_id.id" target="_blank">
        <CButton color="primary" class="mr-3">Print</CButton>
      </CNavLink>
      <CButton color="secondary" @click="this.clearOrderDetailsModal()">Close</CButton>
    </CModalFooter>
  </CModal>

  <!-- Modal for Order return / exchange -->
  <CModal alignment="center" size="lg" backdrop="static" :visible="this.viewModalOrderReturn" @close="this.clearOrderReturnModal()">

    <CModalHeader dismiss color="bg-primary" @close="this.clearOrderReturnModal()">
      <CModalTitle>Order 
        <span v-if="this.isExchange">Exchange</span>
        <span v-else>Return</span>
      </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CRow>
        <CCol :md="12">
          <CFormFloating class="mb-4">
            <CFormInput v-model="this.return_reason" placeholder="" required />
            <CFormLabel>Reason for Return / Exchange</CFormLabel>
          </CFormFloating>
        </CCol>

        <CCol :md="6" v-if="this.return_from_address">
          <CCard text-color="dark" class="mb-4 border border-primary">
            <CCardHeader>
              <strong>Pick-up address</strong>
              <p class="text-medium-emphasis small mb-0">Edit as needed</p>
            </CCardHeader>
            <CCardBody>

              <CRow>
                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_from_address.shipping_address.addressline" :placeholder="this.return_from_address.shipping_address.addressline" required />
                    <CFormLabel>Address Line</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_from_address.shipping_address.city" :placeholder="this.return_from_address.shipping_address.city" required />
                    <CFormLabel>City</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_from_address.shipping_address.state" :placeholder="this.return_from_address.shipping_address.state" required />
                    <CFormLabel>State</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_from_address.shipping_address.country" :placeholder="this.return_from_address.shipping_address.country" required />
                    <CFormLabel>Country</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_from_address.shipping_address.zip" :placeholder="this.return_from_address.shipping_address.zip" required />
                    <CFormLabel>Zip</CFormLabel>
                  </CFormFloating>
                </CCol>
              </CRow>

            </CCardBody>
          </CCard>
        </CCol>

        <CCol :md="6"  v-if="this.return_to_address">
          <CCard text-color="dark" class="mb-4 border border-primary">
            <CCardHeader>
              <strong>Drop address</strong>
              <p class="text-medium-emphasis small mb-0">Edit as needed</p>
            </CCardHeader>
            <CCardBody>

              <CRow>
                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_to_address.shipping_address.addressline" :placeholder="this.return_to_address.shipping_address.addressline" required />
                    <CFormLabel>Address Line</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_to_address.shipping_address.city" :placeholder="this.return_to_address.shipping_address.city" required />
                    <CFormLabel>City</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_to_address.shipping_address.state" :placeholder="this.return_to_address.shipping_address.state" required />
                    <CFormLabel>State</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_to_address.shipping_address.country" :placeholder="this.return_to_address.shipping_address.country" required />
                    <CFormLabel>Country</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol :md="12" class="mb-2">
                  <CFormFloating>
                    <CFormInput v-model="this.return_to_address.shipping_address.zip" :placeholder="this.return_to_address.shipping_address.zip" required />
                    <CFormLabel>Zip</CFormLabel>
                  </CFormFloating>
                </CCol>
              </CRow>

            </CCardBody>
          </CCard>
        </CCol>

      </CRow>
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" @click="this.clearOrderReturnModal()">Close</CButton>
      <CButton color="primary" @click="this.initiateReturn(this.isExchange)">
        <span v-if="this.isExchange">Exchange</span>
        <span v-else>Return</span>
      </CButton>
    </CModalFooter>
  </CModal>

  <!-- Modal shipping label -->
  <CModal alignment="center" backdrop="static" :visible="this.viewModalShippingLabel">

    <CModalHeader dismiss color="bg-primary">
      <CModalTitle>
        Print shipping label
      </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CAlert color="warning" v-if="this.shippingLabelData" class="text-center">
        <span class="h4">
          <strong>
            Ensure you've printed and pasted Shipping label on the Package
          </strong>
        </span>
      </CAlert>
      <span class="text-center">
        <p class="text-medium-emphasis small mb-0">AWB Number:</p>
        <h3 class="mb-3">
          {{this.shippingLabelData.awbNumber}}
        </h3>
        <br>
        <CNavLink v-if="this.shippingLabelURL" :href=this.shippingLabelURL target="_blank" active>
          <CButton color="primary">Print shipping label</CButton>
        </CNavLink>
      </span>
    </CModalBody>

    <CModalFooter>
      
      <CButton color="secondary" @click="this.clearShippingLabel()">Close</CButton>
    </CModalFooter>

  </CModal>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Orders",

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
        default: return {name: order_status, color: 'info'}
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


      // models
      allOrders: null,

      ordersTableData: [],
      ordersTableColumns: [
        {
          key: 'order_id',
          label: 'Order ID',
        },
        {
          key: 'dt_ts',
          label: 'Date',
        },
        {
          key: 'source',
          label: 'Source',
        },
        {
          key: 'amount',
          label: 'Amount',
        },
        {
          key: 'customer',
          label: 'Customer details & Shipping address',
        },
        {
          key: 'items',
          label: 'Items',
        },
      ],

      // smart table properties
      activePage: 1,
      itemsPerPage: 20,
      tableContentLoading: false,
      records: [],

      // item movement details
      viewModalItemMovement: false,
      selectedItemMovementDetails: null,

      // order details modal
      viewModalOrderDetails: false,
      selectedOrderForModal: null,
      selectedOrderForModalTotalAmount: 0,

      // order return / exchange
      viewModalOrderReturn: false,
      isExchange: false,
      selectedOrderForReturn: null,
      selectedOrderItemForReturn: null,

      return_from_address: null,
      return_to_address: null,
      return_reason: null,

      warehouse_address: {
        "addressline": "ConnectCo Warehouse, Amghara Industrial Area",
        "city": "Amghara",
        "state": "Jahra",
        "country": "Kuwait",
        "zip": "13085",
      },

      // Shipping label modal
      viewModalShippingLabel: false,

      // shipping label data
      shippingLabelData: null,
      shippingLabelURL: null,

    }
  }, //end of Data

  methods: {

    setActivePage(page) {
      this.activePage = page
      this.getAllOrders()
    },

    setItemsPerPage(items) {
      this.itemsPerPage = items
      this.getAllOrders()
    },

    getAllOrders() {
      this.tableContentLoading = true
      this.ordersTableData = []

      axios.get(this.APIHOST + '/infra/getOrderItems/', {
        params: {
          page_seq: this.activePage,
          page_size: this.itemsPerPage,
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.records = response.data.response.totalCount
        this.allOrders = response.data.response.payloads

        // prepare data for Smart table
        for (let counter = 0; counter < this.allOrders.length; counter++) {
          let orderDetails = {
            order_id: {
              id: this.allOrders[counter].id,
              externalOrderId: this.allOrders[counter].externalOrderId,
            },
            dt_ts: {
              'dt': this.allOrders[counter].createdDate,
              'originalDate': this.allOrders[counter].originalDate,
            },
            source: this.allOrders[counter].source,
            items: this.allOrders[counter].orderItems,
            customer: this.allOrders[counter].customer,
            vendorId: this.allOrders[counter].vendorId,
            amount: {
              'billing_currency': this.allOrders[counter].billing_currency,
              'billingAmount': this.allOrders[counter].billingAmount,
            },
          }

          this.ordersTableData.push(orderDetails)

        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.response))
        console.log(error)
      })

      this.tableContentLoading = false
    },

    cancelOrderItem(orderItemId, item_name, variant_name, quantity) {
      if (confirm('Are you sure you want to return/cancel order item of\n\n ' + quantity + ' x ' + item_name + ', ' + variant_name + " ?")) {
        // else item to be canceled
      } 
    },

    showModalItemMovement(movementDetails) {
      this.selectedItemMovementDetails = movementDetails
      this.viewModalItemMovement = true
    },

    clearModalItemMovement() {
      this.selectedItemMovementDetails = null
      this.viewModalItemMovement = false
    },

    showOrderDetailsModal(order) {
      console.log(order)
      this.viewModalOrderDetails = true
      this.selectedOrderForModal = order

      for (let counter = 0; counter < this.selectedOrderForModal.items.length; counter++) {
        this.selectedOrderForModalTotalAmount = this.selectedOrderForModalTotalAmount + (this.selectedOrderForModal.items[counter].itemPayload.price * this.selectedOrderForModal.items[counter].itemPayload.quantity)
      }
    },

    clearOrderDetailsModal() {
      this.viewModalOrderDetails = false
      this.selectedOrderForModal = null
      this.selectedOrderForModalTotalAmount = 0
    },

    showOrderReturnModal(order, order_item, exchange) {
      console.log(order)
      console.log(order_item)
      this.isExchange = exchange
      this.selectedOrderForReturn = order
      this.selectedOrderItemForReturn = order_item
      this.viewModalOrderReturn = true

      this.return_from_address = {
        shipping_address: order.customer.shipping_address,
        billing_address: order.customer.billing_address
      }
      

      if (exchange == false) {
        this.return_to_address = {
          shipping_address: this.warehouse_address,
          billing_address: this.warehouse_address
        }
      } else {
        this.return_to_address = {
          shipping_address: order.customer.shipping_address,
          billing_address: order.customer.shipping_address
        }
      }

    },

    clearOrderReturnModal() {
      this.viewModalOrderReturn = false
      this.isExchange = false
      this.selectedOrderForReturn = null
      this.selectedOrderItemForReturn = null
      this.return_from_address = null
      this.return_to_address = null
      this.return_reason = null
    },

    initiateReturn(exchange) {

      let term = (exchange == true) ? "Exchange" : "Return"
      let exchange_flag = (exchange == true) ? "1" : "0"

      let response = confirm("Are you sure you want to create this " + term + "?")

      if (response == true) {

        let return_payload = {
          "exchange": exchange_flag,
          "orderItems": [this.selectedOrderItemForReturn.id],
          "orderId": this.selectedOrderItemForReturn.orderId,
          "payload": {
            "from": this.return_from_address,
            "to": this.return_to_address,
            "reason": this.return_reason
          }
        }

        console.log(return_payload)

        axios.post(this.APIHOST + '/infra/cancelOrderItems/', return_payload, {
          headers: this.headers
        })
        .then(response => {
          if (response.status == 200) {
            console.log(response.data.response)
            this.shippingLabelData = response.data.response
            this.shippingLabelURL = '#/print/shipping-label?orderId=' + this.selectedOrderItemForReturn.orderId + '&awb=' + this.shippingLabelData.awbNumber
            this.showShippingLabel()
          }
        })
        // .catch(error => {
        //   alert(JSON.stringify(error.response.data))
        //   console.log(error)
        // })

      } else {
        this.clearOrderReturnModal()
      }

    },

    showShippingLabel() {
      this.viewModalShippingLabel = true
    },

    clearShippingLabel() {
      this.viewModalShippingLabel = false
      this.shippingLabelData = null
      this.shippingLabelURL = null
      this.reloadPage()
    },

    getRecentStatus(itemStatus) {
      let max_timestamp = null
      let recentStatus = null
      Object.keys(itemStatus).forEach(function(key) {
        if (max_timestamp == null) {
          recentStatus = key
          max_timestamp = itemStatus[key].timestamp
        }
        else if (itemStatus[key].timestamp == null) {
          // pass
        }
        else if (itemStatus[key].timestamp > max_timestamp) {
          recentStatus = key
          max_timestamp = itemStatus[key].timestamp
        }
      })

      return recentStatus.toLowerCase()
    },

    reloadPage() {
      location.reload()
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getAllOrders()
  }, // end created

}

</script>


<style scoped>

</style>
