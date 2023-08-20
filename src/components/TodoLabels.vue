<script setup>
const props = defineProps(['labels'])
</script>
<template>
    <div>
        <div class="inline-block w-fit rounded px-1 text-white mr-1" v-for="label in labels"
            :style="{ backgroundColor: label.color }">
            <p class="shadow-lg text-white text-shadow">{{ label.name }}</p>
        </div>
    </div>
</template>