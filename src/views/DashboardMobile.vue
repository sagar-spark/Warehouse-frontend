<template>
	<div class="bg-light min-vh-100 d-flex flex-row align-items-center">
		<CContainer>
			<CRow class="mb-4 justify-content-center">
				<CCol :md="6" :xs="10">
					<h5 class="text-center">Choose an option to continue</h5>
				</CCol>
			</CRow>

			<CRow class="mb-4 justify-content-center">
				<CCol :md="2" :xs="8">
					<CCard class="text-white bg-primary py-2">
						<CCardBody class="text-center">
							<div>
								<CNavLink href="/#/mobile/location-assign" active>
									<CIcon icon="cil-storage" class="mb-2" />
									<br>
									Assign Location
								</CNavLink>
							</div>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>
	
			<!-- <CRow class="mb-4 justify-content-center">
				<CCol :md="2" :xs="8">
					<CCard class="text-white bg-primary py-2">
						<CCardBody class="text-center">
							<div>
								<CNavLink href="/#/mobile/stockin" active>
									<CIcon icon="cil-layers" class="mb-2" />
									<br>
									Stock-in
								</CNavLink>
							</div>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow> -->

			<!-- <CRow class="mb-4 justify-content-center">
				<CCol :md="2" :xs="8">
					<CCard class="text-white bg-primary py-2">
						<CCardBody class="text-center">
							<div>
								<CNavLink href="/#/mobile/transport" active>
									<CIcon icon="cil-rowing" class="mb-2" />
									<br>
									Transport
								</CNavLink>
							</div>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow> -->

			<!-- <CRow class="mb-4 justify-content-center">
				<CCol :md="2" :xs="8">
					<CCard class="text-white bg-primary py-2">
						<CCardBody class="text-center">
							<div>
								<CNavLink href="/#/mobile/shelving" active>
									<CIcon icon="cil-storage" class="mb-2" />
									<br>
									Shelving
								</CNavLink>
							</div>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow> -->

			<CRow class="mb-4 justify-content-center">
				<CCol :md="2" :xs="8">
					<CCard class="text-white bg-primary py-2">
						<CCardBody class="text-center">
							<div>
								<CNavLink href="/#/mobile/picking" active>
									<CIcon icon="cil-braille" class="mb-2" />
									<br>
									Picking
								</CNavLink>
							</div>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>

			<CRow class="mb-4 justify-content-center">
				<CCol :md="2" :xs="8">
					<CCard class="text-white bg-primary py-2">
						<CCardBody class="text-center">
							<div>
								<CNavLink href="/#/mobile/sorting-drop" active>
									<CIcon icon="cil-hand-point-down" class="mb-2" />
									<br>
									Sort drop
								</CNavLink>
							</div>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>

			<CRow class="mb-4 justify-content-center">
				<CCol :md="2" :xs="8">
					<CCard class="text-white bg-primary py-2">
						<CCardBody class="text-center">
							<div>
								<CNavLink href="/#/mobile/stock-transfer" active>
									<CIcon icon="cil-transfer" class="mb-2" />
									<br>
									Sort drop
								</CNavLink>
							</div>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>
			
			<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

		</CContainer>
	</div>
</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {getAccessToken} from '@/store/session'
import {validateSessionMobile} from '@/store/session'


export default {
  name: "Dashboard Mobile",
  
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
    validateSessionMobile(this.$router)
  }, // end beforeCreate

}

</script>


<style scoped>

</style>
