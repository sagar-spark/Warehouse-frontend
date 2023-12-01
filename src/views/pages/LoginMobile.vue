<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center bg-pattern3-repeat">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :xs="12" :xm="4" :xl="4">

            <CCard class="p-4 customcard-border-primary">
              <CCardBody>
                <CForm
                  class="needs-validation"
                  novalidate
                  :validated="validatedCustom01"
                  @submit="handleSubmitCustom01"
                  @submit.prevent=";"
                >
                  <img class="d-block w-100 mb-2" :src="ccMainLogo" alt="ConnectCo main logo" />
                  <h2 class="mb-2">Warehouse Portal</h2>
                  

                  <div v-if="this.checkCredentialsSpin == true">
                    <p class="text-medium-emphasis mb-3">Checking credentials</p>
                    <CSpinner color="primary" size="sm" />
                  </div>

                  <div v-if="this.checkCredentialsSpin == false">
                    <p class="text-medium-emphasis mb-3">Enter credentials to continue</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autocomplete="username"
                        v-model="username"
                        required
                      />
                    </CInputGroup>


                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autocomplete="current-password"
                        v-model="password"
                        required
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol :xs="6">
                        <CButton color="primary" class="px-4" type="submit"> Login </CButton>
                      </CCol>
                    </CRow>
                  </div>

                </CForm>
              </CCardBody>
            </CCard>
          
          
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
  import axios from "axios"
  import vueCookies from 'vue-cookies'
  import vueRouter from 'vue-router'
  // import {storeUserRole} from '@/store/store_userrole'

  import ccMainLogo from '@/assets/images/connectco/logo_main_with_tagline.png'

  export default {
    name: 'Mobile Login',

    data: () => {

      return {

        // headerToken
        APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json; charset=utf-8',
        },

        // markers
        validatedCustom01: null,

        // data models
        username: null,
        password: null,
        userrole: null,

        //flags
        checkCredentialsSpin: true,


      } // end data return
    }, // end data


    methods: {
      handleSubmitCustom01(event) {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        } else {
           this.userLogin()
        }
        this.validatedCustom01 = true
      },

      userLogin() {

        let login_url = this.APIHOST + '/infra/warehouse-login/'

        axios.post(login_url, JSON.stringify({
          email: this.username,
          passw: this.password
        }), {headers: this.headers})
        .then(response => {
          if (response.status == 200) {
            // save in cookie
            // https://www.npmjs.com/package/vue-cookies
            vueCookies.set('accessToken', response.data.response, '1d')

            // land to dashboard
            this.checkCredentialsSpin = true
            setTimeout(this.redirect_dashboard, 3000)
            //this.$router.push('/dashboard')
          }
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data.response))
          console.log(error)
        });

      }, // end user login

      redirect_dashboard() {
        this.$router.push('/mobile/dashboard')
      },

    }, // end methods


    beforeCreate() {
      
    }, // end beforeCreate

    created() {
      let access_token = vueCookies.get('accessToken')
      // validate access token
      if (access_token != null) {
        //this.$router.push('/dashboard')
        // this.checkCredentialsSpin = true
        this.redirect_dashboard()
      } else {
        this.checkCredentialsSpin = false
      }
    }, // end created

    setup() {
      return {
        ccMainLogo
      }
    }, // end setup

  } // end export
</script>

