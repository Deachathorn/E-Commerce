<template>
    <div>
        <span class="mr-2" v-if="comment.rating === 5">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
        </span>
        <span class="mr-2" v-if="comment.rating === 4">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['far', 'star']" />
        </span>
        <span class="mr-2" v-if="comment.rating === 3">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
        </span>
        <span class="mr-2" v-if="comment.rating === 2">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
        </span>
        <span class="mr-2" v-if="comment.rating === 1">
            <font-awesome-icon :icon="['fas', 'star']" class="has-text-warning"/>
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
            <font-awesome-icon :icon="['far', 'star']" />
        </span>
    </div>
</template>

<script>
export default {
    name: "star_comment",
    props:['comment']
}
</script>

<style>

</style>