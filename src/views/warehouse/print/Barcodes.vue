<template>
	<!-- references:
		https://stackoverflow.com/questions/51357990/html-css-print-out-pos-size
		https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/
		https://stackoverflow.com/questions/14047440/printing-an-invoice-on-pre-formatted-paper-using-css
		https://parzibyte.me/blog/en/2019/10/10/print-receipt-thermal-printer-javascript-css-html/
	-->

	<p class="centered" v-if="this.barcodesPrint.length > 0" v-for="barcode in this.barcodesPrint">
		<table style="width:100%">
			<tr>
				<td align="center">
					<img :src=barcode>
				</td>
			</tr>
		</table>
	</p>
	
</template>

<script>

import axios from "axios"
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
	    selectedArtefactType: null,
      selectedArtefactsString: null,
      selectedArtefacts: [],
      availableArtefacts: null,
      barcodesPrint: [],
      isDownload: null,
      barcodesDownload: [],
    }
  },

  methods: {

  	getSelections() {
  		this.selectedArtefactType = this.$route.query.artefact
  		this.selectedArtefactsString = this.$route.query.selectedArtefacts
  		this.isDownload = this.$route.query.isdownload

  		if (this.selectedArtefactType == undefined || this.selectedArtefactType == null || this.selectedArtefactsString == undefined || this.selectedArtefactsString == null) {

  			alert("Invalid selections - close this window and try again")

  		} else {

  			this.selectedArtefacts = this.selectedArtefactsString.split("@@")

  			if (this.selectedArtefacts == undefined || this.selectedArtefacts == null || this.selectedArtefacts.length < 1) {

  				alert("Invalid selections - close this window and try again")
  			}

  			else {
  				
  				axios.get(this.APIHOST + '/infra/get-all-warehouse-objects/', {
		          params: {
		            type: this.selectedArtefactType
		          },
		          headers: this.headers,
		        })
		        .then(response => {
		          if (response.status == 200) {
		            this.availableArtefacts = response.data.response
		            console.log(response.data.response)

		            // prepare print ones
		            this.barcodesPrint = []
		            this.barcodesDownload = []

		            for (let counter = 0; counter<this.availableArtefacts.length; counter++) {
		              // console.log(this.availableArtefacts[counter])
		              
		              if (this.selectedArtefacts.includes(this.availableArtefacts[counter].id.toString())) {
		              	this.barcodesPrint.push(this.availableArtefacts[counter].barcode)
		              	
		              	this.barcodesDownload.push({
		              		qualifiedName: this.availableArtefacts[counter].qualifiedName,
		              		barcode: this.availableArtefacts[counter].barcode,
		              	})

		              	console.log(this.barcodesDownload)
		              }
		            }

		            console.log(this.barcodesPrint)
		          }
		        })
		        .catch(error => {
		          alert(JSON.stringify(error.response.data.response))
		          console.log(error)
		        });

  			}
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
  	this.callPrint()
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
    max-width: inherit;
    width: inherit;
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
	width: 100mm;
	height: 36mm;
}

/*@media print {
    body 
    {
  		transform: scale(.2);
  	}

  	table,
  	tr,
  	td
  	{
  		page-break-inside: avoid;
  	}

}*/
</style>