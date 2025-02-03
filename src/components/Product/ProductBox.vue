<template>
    <div>
        <router-link :to="{name: 'showdetails', params: {id: product.product_id}}" >
        <div class="card card-shadow">
            <div class="card-image">
                <figure class="image is-5by4">
                    <img :src="'http://localhost:3000/uploads/product/' + product.file_path" >
                </figure>
            </div>
            <div class="card-content">
                <div class="content">
                    <p class="title is-5 mb-6">{{product.name}}</p>
                    <p class="subtitle has-text-weight-bold"> ฿ {{ product.price }}</p>
                </div>
            </div>
            <div class="has-text-right py-2 px-3">
                <router-link :to="{name: 'admin_editproduct', params: {id: product.product_id}}" v-show="$route.name === 'admin_product'">
                    <a class="has-text-weight-bold has-text-dark">Edit</a>
                </router-link>
            </div>
        </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "product_box",
    props:['product']
}
</script>

<style>

</style>