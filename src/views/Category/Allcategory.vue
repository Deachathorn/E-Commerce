<template>
    <div id="bg">
        <div class="container">
            <div class="columns">
                <div class="column px-6 py-6">
                    <p class="title is-size-3 has-text-dark">Category</p>
                    <hr>
                    <div class="columns is-multiline">
                        <div class="column is-one-fifth has-text-centered" v-for="item in category" :key="item.category_id">
                            <CategoryBox :category="item"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/plugins/axios'
import CategoryBox from '@/components/Category/CategoryBox.vue'
export default {
    name:"list_product",
    components:{
        CategoryBox
    },
    data(){
        return{
            category: [],
        }
    },
    created(){
        axios.get('/category')
        .then(res => {
            this.category = res.data.category
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