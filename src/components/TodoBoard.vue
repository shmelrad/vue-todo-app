<script setup>
import { ref, watchEffect } from 'vue'
import TodoList from './TodoList.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { addTodoToListAtIndex, getLists, addList, deleteList, removeTodoByIndex, removeTodoById, moveTodo, addTodoToList, changeListHeader, getLabels, addLabel, removeLabel, updateTodo } from '../api';
import EditTodoModal from './EditTodoModal.vue';
import TodoLabels from './TodoLabels.Vue';
import LabelSelector from './LabelSelector.vue';

const lists = ref(null)
const isCreatingNewList = ref(false)
const appLabels = ref([])
const searchText = ref('')
const filterLabels = ref([])
const newListInputRef = ref(null)
const newListName = ref('')

const modalTodo = ref(null)
const modalList = ref(null)
const modalOpened = ref(false)

watchEffect(() => {
    getLists().then(resp => lists.value = resp)
    getLabels().then(resp => appLabels.value = resp)
})

async function change(e, list) {
    const listId = list.id
    if (e.removed) {
        const oldIndex = e.removed.oldIndex

        list.todos.splice(oldIndex, 1)
        await removeTodoByIndex(listId, oldIndex)
    } else if (e.added) {
        const todo = e.added.element
        const index = e.added.newIndex

        list.todos.splice(index, 0, todo)
        await addTodoToListAtIndex(listId, todo, index)
    } else if (e.moved) {
        const oldIndex = e.moved.oldIndex
        const newIndex = e.moved.newIndex

        let tmp = list.todos[oldIndex]
        list.todos[oldIndex] = list.todos[newIndex]
        list.todos[newIndex] = tmp
        await moveTodo(listId, oldIndex, newIndex)
    }

}

async function onNewTodoAdd(text, list) {
    const resp = await addTodoToList(list.id, { text })
    const newTodo = await resp.json()
    list.todos.push(newTodo)
}

async function onChangeListHeader(list, newHeader) {
    await changeListHeader(list.id, newHeader)
    list.name = newHeader
}

function onTodoClick(todo, list) {
    modalTodo.value = todo
    modalList.value = list
    modalOpened.value = true
}

async function addAppLabel(label) {
    const resp = await addLabel(label.name, label.color)
    const data = await resp.json()
    appLabels.value.push(data)
}

async function deleteTodo(list, todo) {
    await removeTodoById(list.id, todo.id)
    list.todos = list.todos.filter(t => t.id !== todo.id)
    modalOpened.value = false
}

async function deleteAppLabel(label) {
    await removeLabel(label.id)
    appLabels.value = appLabels.value.filter((l => l.id !== label.id))
    filterLabels.value = filterLabels.value.filter((l => l.id !== label.id))
    for (let list of lists.value) {
        for (let item of list.todos) {
            if (!item.labels) {
                continue
            }

            item.labels = item.labels.filter(l => l.id !== label.id)
        }
    }
}

async function toggleTodoLabel(list, todo, label) {
    if (!todo.labels) {
        todo.labels = []
    }

    let index = todo.labels.findIndex(l => l.id === label.id)

    if (index === -1) {
        todo.labels.push(label)
    } else {
        todo.labels.splice(index, 1)
    }

    await updateTodo(list.id, todo)
}

function toggleFilterLabel(label) {
    let index = filterLabels.value.findIndex(l => l.id === label.id)

    if (index === -1) {
        filterLabels.value.push(label)
    } else {
        filterLabels.value.splice(index, 1)
    }
}

async function onUpdateTodo(list, newTodo) {
    console.log(list)
    const todoIndex = list.todos.findIndex(t => t.id === newTodo.id)
    list.todos.splice(todoIndex, 1, newTodo)
    await updateTodo(list.id, newTodo)
}

async function onDeleteList(list) {
    await deleteList(list.id)
    lists.value = lists.value.filter(l => l.id !== list.id)
}

function addListBtnClick() {
    isCreatingNewList.value = true
    setTimeout(() => {
        newListInputRef.value.focus();
    }, 0);
}

function onAddingListBlur() {
    isCreatingNewList.value = false
    newListName.value = ''
}


async function onAddList(name) {
    if (name) {
        const resp = await addList(name)
        lists.value.push(await resp.json())
    }
}
</script>

<template>
    <div class="flex flex-col gap-4 min-w-full w-fit items-center bg-transparent">
        <p class="text-4xl font-medium text-center mt-4 mb-8">Todo App</p>
        <form class="flex bg-white items-center shadow-md rounded-md border-0 py-1.5">
            <MagnifyingGlassIcon class="h-6 w-6 text-gray-400 mr-2" />
            <input v-model="searchText" class="text-gray-900 placeholder:text-gray-400 w-96 outline-none" />
            <button hidden>Поиск</button>
        </form>

        <div class="bg-black/10 p-1.5 rounded-lg">
            <VDropdown placement="bottom-start">
                <p>Метки:
                    <TodoLabels v-if="filterLabels.length > 0" :labels="filterLabels" />
                    <template v-else>все</template>
                </p>

                <template #popper>
                    <LabelSelector :labels="appLabels" :selectedLabels="filterLabels" @addLabel="addAppLabel"
                        @deleteLabel="deleteAppLabel" @toggleSelectedLabel="label => toggleFilterLabel(label)" />
                </template>
            </VDropdown>
        </div>

        <div class="flex gap-4 justify-center">
            <TodoList v-for="list in lists" :header="list.name" :todos="list.todos" :filterText="searchText"
                :filterLabels="filterLabels" @changeListHeader="newHeader => onChangeListHeader(list, newHeader)"
                @change="e => change(e, list)" @addNewTodo="name => onNewTodoAdd(name, list)"
                @todoClick="todo => onTodoClick(todo, list)" @delete="onDeleteList(list)" />
            <div @click="addListBtnClick" class=" bg-gray-600/60 w-64 rounded-xl p-2.5 h-fit cursor-pointer">
                <p class="text-white select-none" v-if="!isCreatingNewList">+ Добавить новый список</p>
                <div v-else>
                    <form @submit.prevent="onAddList(newListName); onAddingListBlur();">
                        <input v-model="newListName" class="w-full shadow-md focus:shadow-lg rounded p-0.5 my-0.5"
                            ref="newListInputRef" @blur="onAddingListBlur" />
                        <button @mousedown="onAddList(newListName)"
                            class="bg-green-600 rounded shadow-md text-white p-1">Добавить</button>
                    </form>
                </div>
            </div>
        </div>

        <EditTodoModal v-if="modalOpened" :open="modalOpened" @close="modalOpened = false" :todo="modalTodo"
            :appLabels="appLabels" @addAppLabel="addAppLabel" @deleteTodo="deleteTodo(modalList, modalTodo)"
            @deleteAppLabel="deleteAppLabel" @toggleTodoLabel="label => toggleTodoLabel(modalList, modalTodo, label)"
            @updateTodo="newTodo => onUpdateTodo(modalList, newTodo)" />
    </div>
</template>