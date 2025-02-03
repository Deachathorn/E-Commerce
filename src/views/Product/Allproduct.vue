<template>
    <div id="bg">
        <div class="container">
            <div class="columns">
                <div class="column px-6 py-6">
                    <p class="title is-size-3 has-text-dark">Products</p>
                    <p class="control has-icons-left">
                        <input class="input" type="text" placeholder="Search" v-model="search">
                        <span class="icon is-small is-left">
                            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                        </span>
                    </p>
                    <hr>
                    <div class="columns is-multiline">
                        <div class="column is-one-fifth has-text-centered" v-for="item in product" :key="item.product_id">
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
    name: "all_product",
    components:{
        ProductBox
    },
    data(){
        return{
            products: [],
            search: ""
        }
    },
    computed:{
        product(){
            if(!this.search){
                return this.products
            }else{
                return this.products.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()))
            }
        }
    },
    created(){
        axios.get('/product')
        .then(res => {
            this.products = res.data.product
        })
        .catch(err => {
            console.log(err)
        })
    }
}
</script>

<style>
    #bg{
        min-height: 100vh;
        background: url("../../assets/many-cat2.jpg");
    }
</style>