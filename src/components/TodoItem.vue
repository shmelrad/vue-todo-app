<script setup>
import { ref, computed } from 'vue'
import TodoLabels from './TodoLabels.Vue';

const props = defineProps(['todo'])
const emit = defineEmits(['todoClick'])

const collapsed = ref(true)


const sortedTodoTasks = computed(() => {
    return [...props.todo.tasks].sort((a, b) => {
        if (!a.done && b.done) {
            return 1
        }

        if (a.done && !b.done) {
            return -1
        }

        return 0
    })

})
function getfulfillment() {
    return props.todo.tasks.filter(t => t.done).length
}

function getfulfillmentInPercents() {
    return getfulfillment() / props.todo.tasks.length * 100
}

</script>

<template>
    <div class="bg-gray-50 hover:bg-stone-100 w-full rounded p-0.5 my-2 shadow-md cursor-pointer">
        <div @click="emit('todoClick')">
            <div class="flex gap-2" v-if="todo.labels">
                <TodoLabels :labels="todo.labels" />
            </div>
            <p>{{ todo.text }}</p>
        </div>
        <div v-if="todo.tasks && todo.tasks.length > 0">
            <div class="flex w-full items-center" @click="collapsed = !collapsed">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-green-500 h-2.5 rounded-full" :style="{ width: getfulfillmentInPercents() + '%',
                     backgroundColor:
                             todo.tasks.filter(t => t.done).length === todo.tasks.length 
                             ? 'rgb(34, 197, 94)'
                             : 'rgb(37, 99, 235)' }"></div>
                </div>
                <p class=" ml-3 whitespace-nowrap">{{ getfulfillment() }} / {{ props.todo.tasks.length }} {{ collapsed ? '▼'
                    : '▲' }} </p>
            </div>
            <ul v-if="!collapsed">
                <li :class="task.done && 'done'" v-for="task in sortedTodoTasks">- {{ task.text }}</li>
            </ul>
        </div>

    </div>
</template>

<style scoped>
.done {
    text-decoration: line-through;
}
</style>