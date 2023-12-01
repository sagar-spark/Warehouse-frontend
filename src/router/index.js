import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutMobile from '@/layouts/DefaultLayoutMobile'
import PrintLayout from '@/layouts/PrintLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/pages/login',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
      },

      // Inbound

      {
        path: '/inbound/asn',
        name: 'Advance Shipment Notice (ASN)',
        component: () => import('@/views/warehouse/inbound/AsnAll.vue'),
      },
      {
        path: '/inbound/create-grn',
        name: 'Create GRN (ASN Sorting & Quality Check)',
        component: () => import('@/views/warehouse/inbound/CreateGRN.vue'),
      },

      // Inventory
      {
        path: '/inventory/assign-location',
        name: 'Assign Location',
        component: () => import('@/views/warehouse/inventory/AssignLocation.vue'),
      },
      // {
      //   path: '/inventory/stock-in',
      //   name: 'Inventory Stock-in',
      //   component: () => import('@/views/warehouse/inventory/StockIn.vue'),
      // },
      // {
      //   path: '/inventory/transport',
      //   name: 'Inventory Transport',
      //   component: () => import('@/views/warehouse/inventory/Transport.vue'),
      // },
      // {
      //   path: '/inventory/shelving',
      //   name: 'Inventory Shelving',
      //   component: () => import('@/views/warehouse/inventory/Shelving.vue'),
      // },

      {
        path: '/inventory/stock-transfer',
        name: 'Inventory',
        component: () => import('@/views/warehouse/inventory/StockTransfer.vue'),
      },
      {
        path: '/inventory/all',
        name: 'Stock Transfer',
        component: () => import('@/views/warehouse/inventory/Inventory.vue'),
      },


      // Orders

      {
        path: '/order-processing/all-orders',
        name: 'Orders',
        component: () => import('@/views/warehouse/order_processing/Orders.vue'),
      },
      {
        path: '/order-processing/order-form',
        name: 'Order Form',
        component: () => import('@/views/warehouse/order_processing/OrderForm.vue'),
      },
      {
        path: '/order-processing/order-inbox',
        name: 'Order Inbox',
        component: () => import('@/views/warehouse/order_processing/OrderInbox.vue'),
      },
      {
        path: '/order-processing/picking',
        name: 'Order Picking',
        component: () => import('@/views/warehouse/order_processing/Picking.vue'),
      },
      {
        path: '/order-processing/sorting-drop',
        name: 'Sorting Drop',
        component: () => import('@/views/warehouse/order_processing/SortingDrop.vue'),
      },
      {
        path: '/order-processing/sorting',
        name: 'Sorting QC, Packing & Labelling',
        component: () => import('@/views/warehouse/order_processing/SortingQCPackingLabelling.vue'),
      },
      {
        path: '/outbound/shipping',
        name: 'Shipping assignment',
        component: () => import('@/views/warehouse/order_processing/Shipping.vue'),
      },

      // Manage

      {
        path: '/manage/getting-started',
        name: 'Getting started',
        component: () => import('@/views/warehouse/manage/GettingStarted.vue'),
      },
      {
        path: '/manage/barcodes',
        name: 'Barcodes',
        component: () => import('@/views/warehouse/manage/Barcodes.vue'),
      },

      {
        path: '/manage/downloads',
        name: 'ConnectCo+ App Downloads',
        component: () => import('@/views/warehouse/manage/Downloads.vue'),
      },



      /////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////

    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'sso',
        name: 'SSO Interstitial',
        component: () => import('@/views/pages/InterstitialSSO'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'forgot-password',
        name: 'Forgot Password',
        component: () => import('@/views/pages/forgotPassword'),
      },
      {
        path: 'reset-password/:id',
        name: 'Reset Password',
        component: () => import('@/views/pages/resetPassword'),
      },
      // {
      //   path: 'print-barcode',
      //   name: 'Print Barcode',
      //   component: () => import('@/views/warehouse/manage/PrintBarcodes.vue'),
      // },
    ],
  },
  {
    path: '/mobile',
    name: 'Mobile app Home',
    component: DefaultLayoutMobile,
    redirect: '/mobile/login',
    children: [
      {
        path: 'login',
        name: 'Mobile login',
        component: () => import('@/views/pages/LoginMobile.vue') 
      },
      {
        path: 'dashboard',
        name: 'Mobile dashboard',
        component: () => import('@/views/DashboardMobile.vue') 
      },
      {
        path: 'location-assign',
        name: 'Inventory Assign Location - Mobile',
        component: () => import('@/views/warehouse/inventory/AssignLocation.vue')
      },

      // {
      //   path: 'stockin',
      //   name: 'Inventory Stock-in - Mobile',
      //   component: () => import('@/views/warehouse/inventory/StockIn.vue')
      // },
      // {
      //   path: 'transport',
      //   name: 'Inventory Transport - Mobile',
      //   component: () => import('@/views/warehouse/inventory/Transport.vue')
      // },
      // {
      //   path: 'shelving',
      //   name: 'Inventory Shelving - Mobile',
      //   component: () => import('@/views/warehouse/inventory/Shelving.vue')
      // },
      {
        path: 'picking',
        name: 'Order Picking - Mobile',
        component: () => import('@/views/warehouse/order_processing/Picking.vue')
      },
      {
        path: 'sorting-drop',
        name: 'Sorting Drop - Mobile',
        component: () => import('@/views/warehouse/order_processing/SortingDrop.vue')
      },
      {
        path: 'stock-transfer',
        name: 'Stock transfer - Mobile',
        component: () => import('@/views/warehouse/inventory/StockTransfer.vue')
      },
    ],
  },
  {
    path: '/print',
    name: 'Print area',
    component: PrintLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'invoice',
        name: 'Print invoice',
        component: () => import('@/views/warehouse/print/Invoice.vue') 
      },
      {
        path: 'shipping-label',
        name: 'Shipping label',
        component: () => import('@/views/warehouse/print/ShippingLabel.vue') 
      },
      {
        path: 'sku-barcode',
        name: 'Print SKU barcode',
        component: () => import('@/views/warehouse/print/SKUs.vue') 
      },
      {
        path: 'artefact-barcode',
        name: 'Print barcode',
        component: () => import('@/views/warehouse/print/Barcodes.vue') 
      },
      {
        path: 'asn-view',
        name: 'View ASN',
        component: () => import('@/views/warehouse/print/AsnView.vue') 
      },
      {
        path: 'order-view',
        name: 'View Order',
        component: () => import('@/views/warehouse/print/OrderView.vue') 
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
