<script setup>
import { ref, computed } from 'vue'
import ModalComponent from './ModalComponent.vue'
import LabelSelector from './LabelSelector.vue'
import { TrashIcon } from '@heroicons/vue/24/solid';
import TodoLabels from './TodoLabels.Vue';

const props = defineProps(['open', 'todo', 'appLabels'])
const emit = defineEmits([
    'close',
    'deleteTodo',
    'addAppLabel',
    'deleteAppLabel',
    'toggleTodoLabel',
    'updateTodo'
])

const isAddingTask = ref(false)
const newTaskName = ref('')

const todoText = ref(props.todo.text)
const todoDesc = ref(props.todo.description || '')
const todoLabels = ref(props.todo.labels || [])
const todoTasks = ref(props.todo.tasks || [])
const descriptionRef = ref(null)
const taskInputRef = ref(null)

function saveBtnClick() {

    const newTodo = {
        ...props.todo,
        text: todoText.value,
        description: descriptionRef.value.textContent,
        tasks: todoTasks.value,
    }

    emit('updateTodo', newTodo)
    emit('close')
}

function addTaskButtonClick() {
    isAddingTask.value = true
    setTimeout(() => {
        taskInputRef.value.focus();
    }, 0);
}

function addNewTask() {
    todoTasks.value.push({ text: newTaskName.value, done: false })
    isAddingTask.value = false
    newTaskName.value = ''
}
</script>

<template>
    <ModalComponent :open="open" @close="emit('close')">
        <div class="min-w-[500px] max-w-[700px]">
            <div class="flex">
                <div class="flex-1 mr-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            📝 Задача
                        </label>
                        <input v-model="todoText"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            📰 Подробное описание
                        </label>
                        <p class="font-medium text-lg px-1 rounded border-black outline-none focus:shadow-lg focus:border focus:bg-white"
                            ref="descriptionRef" contenteditable="true">{{ todoDesc }}</p>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            ✅ Подзадачи
                        </label>
                        <ul>
                            <li v-for="task in todoTasks">
                                <div class="flex items-center">
                                    <input :checked="task.done" type="checkbox" class="h-4 w-4" @click="task.done = !task.done">
                                    <p class="ml-2"
                                        :style="{ textDecoration: task.done ? 'line-through' : 'none' }">
                                        {{ task.text }}</p>
                                </div>
                            </li>
                        </ul>
                        <div v-if="!isAddingTask" @click="addTaskButtonClick"
                            class="text-stone-600 hover:bg-slate-300 w-full rounded p-0.5 cursor-pointer">
                            <p>+ Добавить задачу</p>
                        </div>
                        <div v-else>
                            <form @submit.prevent="addNewTask">
                                <input v-model="newTaskName" ref="taskInputRef"
                                    class="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                <button submit @mousedown=""
                                    class="bg-green-600 rounded shadow-md text-white p-1">Добавить</button>
                            </form>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="inline-block text-gray-700 text-sm font-bold mb-2">
                            Метки
                        </label>
                        <div class='inline-block'>
                            <VDropdown placement="top-start">
                                <button class=" bg-gray-400 text-sm rounded px-1 ml-1 cursor-pointer select-none">+
                                    Добавить</button>

                                <template #popper>
                                    <LabelSelector :labels="appLabels" :selectedLabels="todoLabels"
                                        @addLabel="label => emit('addAppLabel', label)"
                                        @deleteLabel="label => emit('deleteAppLabel', label)"
                                        @toggleSelectedLabel="label => emit('toggleTodoLabel', label)" />
                                </template>
                            </VDropdown>
                        </div>
                        <TodoLabels :labels="todo.labels" />
                    </div>
                </div>
                <div>
                    <p class="text-gray-700 text-sm font-bold">Действия</p>
                    <button @click="emit('deleteTodo')"
                        class="bg-red-700 rounded shadow-md  text-white p-2 mt-2">🗑️Удалить</button>
                </div>
            </div>
            <button class="bg-green-600 rounded shadow-md text-white p-2 mt-2" @click="saveBtnClick">Сохранить</button>

        </div>
    </ModalComponent>
</template>
