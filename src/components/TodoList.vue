<script setup>
import TodoItem from './TodoItem.vue';
import draggable from "vuedraggable";
import { ref, computed } from 'vue'

const isAddingTask = ref(false)
const inputRef = ref(null)
const headerRef = ref(null)
const newTodoName = ref('')

const props = defineProps(['header', 'todos', 'filterText', 'filterLabels'])
const emit = defineEmits(['change', 'addNewTodo', 'changeListHeader', 'todoClick', 'delete'])

const filteredTodos = computed(() => {
    const filterLabels = props.filterLabels
    return props.todos.filter(todo =>
        todo.text.toLowerCase().includes(props.filterText.toLowerCase()) &&
        (filterLabels.length === 0 || todo.labels.some(todoLabel =>
            filterLabels.some(filterLabel => todoLabel.id === filterLabel.id)
        ))
    );
})

function addTaskButtonClick() {
    isAddingTask.value = true
    setTimeout(() => {
        inputRef.value.focus();
    }, 0);
}

function onAddingTaskBlur() {
    isAddingTask.value = false
    newTodoName.value = ''
}

function headerKeydown(e) {
    if (e.key === 'Enter') {
        e.target.blur()
        onHeaderBlur()
    }
}

function onHeaderBlur() {
    emit('changeListHeader', headerRef.value.textContent)
}
</script>

<template>
    <div class=" bg-gray-200 min-w-[16rem] rounded-xl p-2.5 h-fit">
        <div class="flex justify-between items-center">
            <p class="font-medium text-lg flex-1 px-1 rounded border-black outline-none focus:shadow-lg focus:border focus:bg-white"
            @keydown="headerKeydown" ref="headerRef" @blur="onHeaderBlur()" contenteditable="true">{{ header }}</p>
            <p class="select-none cursor-pointer ml-3 text-lg" @click="emit('delete')">X</p>
        </div>

        <div>
            <draggable class="min-h-[2rem]" :list="filteredTodos" group="people" item-key="id"
                @change="e => emit('change', e)">
                <template class="" #item="{ element }">
                    <TodoItem @todoClick="emit('todoClick', element)" :todo="element"></TodoItem>
                </template>
            </draggable>
        </div>
        <div v-if="!isAddingTask" @click="addTaskButtonClick"
            class="text-stone-600 hover:bg-slate-300 w-full rounded p-0.5 cursor-pointer">
            <p>+ Добавить задачу</p>
        </div>
        <div v-else>
            <form @submit.prevent="emit('addNewTodo', newTodoName); onAddingTaskBlur();">
                <input v-model="newTodoName" class="w-full shadow-md focus:shadow-lg rounded p-0.5 my-0.5" ref="inputRef"
                    @blur="onAddingTaskBlur" />
                <button @mousedown="emit('addNewTodo', newTodoName)"
                    class="bg-green-600 rounded shadow-md text-white p-1">Добавить</button>
            </form>
        </div>
    </div>
</template>