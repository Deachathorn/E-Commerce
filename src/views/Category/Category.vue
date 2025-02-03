<template>
    <div id="bg" v-if="user && user.role === 'admin'">
        <div class="container">
            <div class="columns is-centered">
                <div class="column px-6 py-6 has-text-centered">
                    <div class="column" style="display:flex; justify-content:space-between">
                        <p class="title is-size-3 mt-5">Our Category</p>
                        <router-link to="/admin/category/add">
                            <button class="button is-dark my-5">ADD CATEGORY</button>
                        </router-link>
                    </div>
                    <div class="columns is-multiline" style="text-align:center">
                        <div class="column is-one-fifth" v-for="item in category" :key="item.category_id">
                            <CategoryBox :category="item"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CategoryBox from '@/components/Category/CategoryBox.vue'
import axios from '@/plugins/axios'
import {mapGetters} from 'vuex'
export default {
    name:"categoryView",
    components:{
        CategoryBox
    },
    data(){
        return{
            category:[],
        }
    },
    computed:{
        ...mapGetters(['user'])
    },
    created(){
        axios.get('/admin/category')
        .then(res => {
            console.log(res.data)
            this.category = res.data.category
        }).catch(err =>{
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