<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Dashboard</h2>
    </CCol>
  </CRow>
  
  <CRow class="mb-4">
    <CCol :md="12">
      <CCard style="max=width: 540px">
        <CRow class="g-0">
          <CCol :md="4">
            <CCardImage class="rounded-0" src="/images/general/new-setup2.jpg" />
          </CCol>
          <CCol :md="8" class="p-3">
            <CCardBody>
              <CCardTitle class="h3">Welcome to ConnectCo Warehouse Portal</CCardTitle>
              <CCardText>Manage Advance shipment notices quality checking, Inventory stock-in and shelving, Order processing, picking, sorting, quality checks and returns, Track orders and assign delivery - all in one portal.
              </CCardText>
              <CCardText class="mt-4">
                <CNavLink href="/#/manage/getting-started" active>
                  <CButton color="primary">Get started</CButton>
                </CNavLink>
              </CCardText>
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>
    </CCol>
  </CRow>
  <CRow>
    <CCol :xl="4">
      <CRow>
        <CCol :lg="12">
          <CCard class="mb-4">
            <CCardBody class="p-4">
              <CRow>

                <!-- Order value -->
                <CCol>
                  <CCardTitle class="fs-4 fw-semibold">Orders</CCardTitle>
                  <CCardSubtitle class="fw-normal text-disabled">
                    January - Dec 2022
                  </CCardSubtitle>
                </CCol>
                <CCol class="text-end text-primary fs-4 fw-semibold"
                  >1526</CCol
                >
              </CRow>
            </CCardBody>
            <CChart
              type="line"
              class="mt-3"
              style="height: 150px"
              :data="{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: `rgba(${getStyle(
                      '--cui-primary-rgb',
                    )}, .1)`,
                    borderColor: getStyle('--cui-primary'),
                    borderWidth: 3,
                    data: [78, 81, 80, 45, 34, 22, 40],
                    fill: true,
                  },
                ],
              }"
              :options="{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    beginAtZero: true,
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }"
            />
          </CCard>
        </CCol>

        <!-- Total orders -->
        <CCol :lg="6">
          <CCard class="mb-4">
            <CCardBody>
              <div class="d-flex justify-content-between">
                <CCardTitle component="div">Order Amount</CCardTitle>
                <div class="bg-primary bg-opacity-25 text-primary p-2 rounded">
                  <CIcon icon="cil-cart" size="xl" />
                </div>
              </div>
              <div class="fs-4 fw-semibold pb-3">154.925</div>
              <small class="text-danger">
                (-12.4% <CIcon icon="cil-arrow-bottom" />)
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol :lg="6">
          <CCard class="mb-4">
            <CCardBody>
              <div class="d-flex justify-content-between">
                <CCardTitle component="div">Returned Orders</CCardTitle>
                <div class="bg-primary bg-opacity-25 text-primary p-2 rounded">
                  <CIcon icon="cil-cart" size="xl" />
                </div>
              </div>
              <div class="fs-4 fw-semibold pb-3">109</div>
              <small class="text-success">
                (17.2% <CIcon icon="cil-arrow-top" />)
              </small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CCol>
    <CCol :xl="8">
      <CCard class="mb-4">
        <CCardBody class="p-4">
          <CCardTitle class="fs-4 fw-semibold">ASN Processed and QC Pending</CCardTitle>
          <CCardSubtitle class="fw-normal text-disabled">
            January 01, 2022 - December 31, 2022
          </CCardSubtitle>
          <CChart
            type="bar"
            style="height: 300px; margin-top: 40px"
            :data="{
              labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              datasets: [
                {
                  label: 'Users',
                  backgroundColor: getStyle('--cui-primary'),
                  borderRadius: 6,
                  borderSkipped: false,
                  data: [
                    78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67,
                    82,
                  ],
                  barPercentage: 0.6,
                  categoryPercentage: 0.5,
                },
                {
                  label: 'New users',
                  backgroundColor: getStyle('--cui-gray-100'),
                  borderRadius: 6,
                  borderSkipped: false,
                  data: [
                    78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67,
                    82,
                  ],
                  barPercentage: 0.6,
                  categoryPercentage: 0.5,
                },
              ],
            }"
            :options="{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                    drawBorder: false,
                    drawTicks: false,
                  },
                  ticks: {
                    color: getStyle('--cui-text-disabled'),
                    font: {
                      size: 14,
                    },
                    padding: 16,
                  },
                },
                y: {
                  grid: {
                    drawBorder: false,
                    borderDash: [2, 4],
                  },
                  gridLines: {
                    borderDash: [8, 4],
                    color: '#348632',
                  },
                  ticks: {
                    beginAtZero: true,
                    color: getStyle('--cui-text-disabled'),
                    font: {
                      size: 14,
                    },
                    maxTicksLimit: 5,
                    padding: 16,
                    stepSize: Math.ceil(100 / 4),
                  },
                },
              },
            }"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { CChart } from '@coreui/vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils/src'

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: 'Dashboard',
  components: {
    CChart,
  },
  setup() {
    return {
      getStyle,
      hexToRgba,
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
      
    }
  }, //end of Data

  methods: {

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate
}
</script>
