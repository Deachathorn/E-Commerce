<template>
    <div>
        <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <section class="modal-card-body has-text-centered">
                    <p class="title is-4 has-text-danger">Cancel Payment</p>
                    <p class="has-text-grey-light">Back To Your Cart</p>
                </section>
                <footer class="modal-card-foot">
                    <router-link to="/cart">
                        <button class="button is-danger is-fullwidth" @click="deleteOrder()">
                            Back To Cart
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
    name: "cancel_payment",
    methods:{
        deleteOrder(){
            axios.delete(`/cancel/${this.$route.params.order_id}`)
            .then(res => {
                console.log(res)
            }).catch(err =>{
                console.log(err)
            })
        }
    }
}
</script>

<style>

</style>