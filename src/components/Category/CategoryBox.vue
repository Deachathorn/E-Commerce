<template>
    <div>
        <router-link :to="{name:'list_product', params: {id: category.category_id}}">
        <div class="card card-shadow">
            <div class="card-image">
                <figure class="image is-5by4">
                    <img :src="'http://localhost:3000/uploads/category/' + category.image_url" >
                </figure>
            </div>
            <div class="card-content">
                <div class="content is-multiline">
                    <h1 class="title is-size-5">{{category.name}}</h1>
                </div>
            </div>
            <div class="has-text-right py-2 px-3">
                <router-link :to="{name: 'admin_editcategory', params: {id: category.category_id}}" v-show="$route.name === 'admin_category'">
                    <a class="has-text-weight-bold has-text-dark">Edit</a>
                </router-link>
            </div>
        </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name:"category_box",
    props:['category']
}
</script>

<style>

</style>