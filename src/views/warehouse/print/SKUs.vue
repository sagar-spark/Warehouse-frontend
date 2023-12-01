<template>
	<!-- references:
		https://stackoverflow.com/questions/51357990/html-css-print-out-pos-size
		https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/
		https://stackoverflow.com/questions/14047440/printing-an-invoice-on-pre-formatted-paper-using-css
		https://parzibyte.me/blog/en/2019/10/10/print-receipt-thermal-printer-javascript-css-html/
	-->
	<img v-if="this.skuBarcodePath" :src="this.skuBarcodePath" class="centered">

	<!-- <p class="centered">
		<table style="width:100%">
			<tr>
				<td align="center">
					
				</td>
			</tr>
		</table>
	</p> -->
	
</template>

<script>

import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: "PrintSKU",
  data: () => {
    return {
      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': vueCookies.get('accessToken')
			},

      // data models
      //skuBarcodePath: "https://wms-s3-assets-bc-rss-hkhaled.s3.ap-south-1.amazonaws.com/SKU/5467654344.png",
	  skuBarcodePath: null,
    }
  },

  methods: {

  	getSelections() {
  		this.skuBarcodePath = this.$route.query.barcodePath

  		if (this.skuBarcodePath == undefined || this.skuBarcodePath == null) {
  			alert("Invalid parameter - close this window and try again")
  		} 
  	},

  	callPrint() {
    	window.print()
    }

  }, //end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
  	this.getSelections()
  }, // end created

  mounted() {
  	// this.callPrint()
  },

}
	
</script>

<style scoped>

/*@page {
	size: 50mm;
}*/

*,
html 
{
	margin:0;
	padding:0;
	font-size: 10px;
	font-family: 'Times New Roman';
}

img {
    max-width: 5cm;
    max-height: 3cm;
    overflow: hidden;
}

.centered {
    text-align: center;
    align-content: center;
}

p
{
	page-break-before: always;
}

td
{
	width: 50mm;
	height: 50mm;
}
</style>