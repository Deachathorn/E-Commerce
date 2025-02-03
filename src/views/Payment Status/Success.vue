<template>
    <div>
        <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <section class="modal-card-body has-text-centered">
                    <p class="title is-4">Payment Successful</p>
                    <p class="has-text-grey-light">Thank you for your payment</p>
                </section>
                <footer class="modal-card-foot">
                    <router-link to="/">
                        <button class="button is-success is-fullwidth">
                            Continue Shopping
                        </button>
                    </router-link>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/plugins/axios'
export default {
    name: "success_payment",
    methods:{
        checkStatus(){
            axios.get(`/order/${this.$route.params.id}`)
            .then(res => {
                if(res.data.order.status !== 'complete'){
                    this.$router.push({name: "cancel"})
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted(){
        this.checkStatus()
    },
}
</script>

<style>

</style>