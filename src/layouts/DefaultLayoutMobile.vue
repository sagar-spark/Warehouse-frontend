 <template>
  <div>
    <div class="wrapper d-flex flex-column min-vh-100 bg-light dark:bg-transparent">
      <div class="body flex-grow-1 px-3 mt-3">
        <CContainer lg>
          <router-view />
        </CContainer>
      </div>
    </div>
  </div>
</template>
<script>
import { CContainer } from '@coreui/vue-pro'
// import AppFooter from '@/components/AppFooter.vue'
// import AppHeader from '@/components/AppHeader.vue'
// import AppSidebar from '@/components/AppSidebar.vue'
// import AppBreadcrumb from '@/components/AppBreadcrumb.vue'

export default {
  name: 'DefaultLayoutMobile',
  components: {
    // AppFooter,
    // AppHeader,
    // AppSidebar,
    // AppBreadcrumb,
    CContainer,
  },
}
</script>
