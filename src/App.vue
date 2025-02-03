<template>
  <Navbar/>
  <router-view :key="$route.fullPath" @auth-change="onAuthChange"/>
</template>
<script>
import axios from '@/plugins/axios'
import Navbar from './components/Navbar.vue'
export default {
    components:{
        Navbar
    },
    data(){
      return{
          user: null
      }
    },
    methods:{
      onAuthChange(){
        const token = localStorage.getItem('token')
        if(token){
          this.getUser()
        }
      },

      getUser(){
        axios.get('/user')
        .then(res => {
          this.$store.dispatch('user', res.data.users)
        }).catch(err => {
            console.log(err)
        })
      }
    },
    mounted(){
      this.onAuthChange()
    }
}
</script>
<style>

</style>
