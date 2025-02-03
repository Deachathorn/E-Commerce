<template>
<section class="section container" v-if="user && user.role === 'admin'">
        <h1 class="title is-4">
            Order Management
        </h1>

        <div class="box">
            <div class="columns">
                <div class="column">
                    <p class="subtitle is-5 my-3">Order List</p>
                </div>
            </div>
            <div class="columns">
                <div class="column" style="display: flex; justify-content: center;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody v-for="orders in order" :key="orders.id">
                            <tr>
                                <td>{{ orders.id }}</td>
                                <td>{{ orders.order_name }}</td>
                                <td>{{ orders.order_email }}</td>
                                <td>{{ orders.order_address }}</td>
                                <td>{{ orders.order_phone }}</td>
                                <td>{{ orders.order_date.substring(0, 10) }}</td>
                                <td>{{ orders.status }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from '@/plugins/axios'
import {mapGetters} from 'vuex'
export default {
    name: "manage_order",
    data(){
        return{
            order: null
        }
    },
    computed:{
        ...mapGetters(['user'])
    },
    created(){
        axios.get('/manage/order')
        .then(res => {
            this.order = res.data.order
        })
        .catch(err => {
            console.log(err)
        })
    }
}
</script>

<style>

</style>