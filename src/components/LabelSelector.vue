<script setup>
import { ref } from 'vue'

const props = defineProps(['labels', 'selectedLabels'])
const emit = defineEmits(['addLabel', 'deleteLabel', 'toggleSelectedLabel'])

const addingNewLabel = ref(false)
const newLabelName = ref('')
const newLabelColor = ref('#000000')

async function onSaveBtnClick(){
    addingNewLabel.value = false

    const label = {name: newLabelName.value, color: newLabelColor.value}

    emit('addLabel', label)
    
    newLabelName.value = ''
    newLabelColor.value = ''
}

</script>
<template>
    <div class="p-3" v-if="!addingNewLabel">
        <p class="text-center font-bold">Метки</p>
        <div class="w-full h-[1px] bg-slate-800 my-1"></div>
        <div>
            <div class="flex" v-for="label in labels">
                <div @click="emit('toggleSelectedLabel', label)" class="w-52 h-10 m-1 rounded shadow-md flex justify-between cursor-pointer" :style="{ backgroundColor: label.color}">
                    <p class="text-white text-shadow self-center ml-3">{{ label.name }}</p>
                    <p v-if="selectedLabels.findIndex(l => l.id === label.id) !== -1" class="text-white text-bold text-lg text-shadow self-center mr-3">✓</p>
                </div>
                <button @click="emit('deleteLabel', label)" class="bg-red-700 rounded shadow-md  text-white p-2 m-1">🗑️</button>
            </div>
        </div>
        <p @click="addingNewLabel = true" class="underline cursor-pointer text-gray-400 m-1 mt-2">Добавить новую метку</p>
    </div>
    <div class="p-3" v-else>
        <div class="flex w-full justify-between">
            <p @click="addingNewLabel = false" class="cursor-pointer w-fit text-lg font-bold">&lt;</p>
            <p class="text-center font-bold self-center">Добавить новую метку</p>
            <p></p>
        </div>


        <div class="w-full h-[1px] bg-slate-800 my-1"></div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Название метки
            </label>
            <input v-model="newLabelName"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Цвет метки
            </label>
            <input v-model="newLabelColor" type="color" />
        </div>
        <button class="bg-green-700 rounded shadow-md  text-white p-2 mt-2" @click="onSaveBtnClick">Сохранить</button>
    </div>
</template>