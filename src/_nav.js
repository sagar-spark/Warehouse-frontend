export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    userrole: "Warehouse"
  },

  // Inbound
  {
    component: 'CNavTitle',
    name: 'Inbound',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'ASN',
    to: '/inbound/asn',
    icon: 'cil-blur',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Create GRN',
    to: '/inbound/create-grn',
    icon: 'cil-task',
    userrole: "Warehouse"
  },

  // Inventory

  {
    component: 'CNavTitle',
    name: 'INVENTORY MANAGEMENT',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Assign Location',
    to: '/inventory/assign-location',
    icon: 'cil-storage',
    userrole: "Warehouse"
  },
  
  // {
  //   component: 'CNavItem',
  //   name: 'Stock-In',
  //   to: '/inventory/stock-in',
  //   icon: 'cil-layers',
  //   userrole: "Warehouse"
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Transport',
  //   to: '/inventory/transport',
  //   icon: 'cil-rowing',
  //   userrole: "Warehouse"
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Shelving',
  //   to: '/inventory/shelving',
  //   icon: 'cil-storage',
  //   userrole: "Warehouse"
  // },

  {
    component: 'CNavItem',
    name: 'Inventory',
    to: '/inventory/all',
    icon: 'cil-apps',
    userrole: "Warehouse"
  }, 
  {
    component: 'CNavItem',
    name: 'Stock Transfer',
    to: '/inventory/stock-transfer',
    icon: 'cil-transfer',
    userrole: "Warehouse"
  },


  // Order Processing
  {
    component: 'CNavTitle',
    name: 'ORDER PROCESSING (STOCK-OUT)',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'All Orders',
    to: '/order-processing/all-orders',
    icon: 'cil-apps-settings',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Order Form',
    to: '/order-processing/order-form',
    icon: 'cil-cart',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Order Inbox',
    to: '/order-processing/order-inbox',
    icon: 'cil-envelope-letter',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Picking',
    to: '/order-processing/picking',
    icon: 'cil-braille',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Sorting Drop',
    to: '/order-processing/sorting-drop',
    icon: 'cil-hand-point-down',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Sorting QC & Packing',
    to: '/order-processing/sorting',
    icon: 'cil-blur-linear',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Shipping',
    to: '/outbound/shipping',
    icon: 'cil-truck',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Returns',
    to: '/outbound/returns',
    icon: 'cil-data-transfer-down',
    userrole: "Warehouse"
  }, 

  // Manage
  {
    component: 'CNavTitle',
    name: 'MANAGE',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Barcodes',
    to: '/manage/barcodes',
    icon: 'cil-barcode',
    userrole: "Warehouse"
  },
  {
    component: 'CNavItem',
    name: 'Downloads',
    to: '/manage/downloads',
    icon: 'cil-cloud-download',
    userrole: "Warehouse"
  },


  // Reports
  
  // {
  //   component: 'CNavTitle',
  //   name: 'REPORTS',
  //   userrole: "Warehouse"
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Stats',
  //   to: '/reports/stats',
  //   icon: 'cil-graph',
  //   userrole: "Warehouse"
  // },

]
