<template>
    <div>
        <span class="mr-2">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
        </span>
        <span>({{ rating5.length }})</span>
        <br>
        <span class="mr-2">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['far', 'star']" />
        </span>
        <span>({{ rating4.length }})</span>
        <br>
        <span class="mr-2">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
        </span>
        <span>({{ rating3.length }})</span>
        <br>
        <span class="mr-2">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
        </span>
        <span>({{ rating2.length }})</span>
        <br>
        <span class="mr-2">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
        </span>
        <span>({{ rating1.length }})</span>
    </div>
</template>

<script>
import axios from '@/plugins/axios'
export default {
    name: "star_views",
    data(){
        return{
            rating1: [],
            rating2: [],
            rating3: [],
            rating4: [],
            rating5: []
        }
    },
    created(){
        axios.get(`/${this.$route.params.id}/rating`)
        .then(res => {
            this.rating1 = res.data.rating1
            this.rating2 = res.data.rating2
            this.rating3 = res.data.rating3
            this.rating4 = res.data.rating4
            this.rating5 = res.data.rating5
        })
        .catch(err => {
            console.log(err)
        })
    }
}
</script>

<style>

</style>