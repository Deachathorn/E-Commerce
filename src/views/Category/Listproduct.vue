<template>
    <div>
        <div class="container">
            <div class="columns">
                <div class="column px-6 py-6 has-text-centered">
                    <p class="title is-size-3 pb-3">{{ category_name }}</p>
                    <p class="subtitle has-text-grey-light">{{ product.length }} Product Found</p>

                    <div class="columns is-multiline">
                        <div class="column is-one-fifth" v-for="item in product" :key="item.product_id">
                            <ProductBox :product="item"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/plugins/axios'
import ProductBox from '@/components/Product/ProductBox.vue'
export default {
    name: "list_product",
    components:{
        ProductBox
    },
    data(){
        return{
            category_name: "",
            product: []
        }
    },
    created(){
        axios.get(`/category/${this.$route.params.id}`)
        .then(res => {
            this.category_name = res.data.category_name
            this.product = res.data.product
        })
        .catch(err => {
            console.log(err)
        })
    }
}
</script>

<style>

</style>