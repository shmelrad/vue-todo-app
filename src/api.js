async function req(url, body = null, method) {
    const reqMethod = method ? method : (body ? 'POST' : 'GET')
    try {
        const response = await fetch('api/' + url, {
            method: reqMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function reqJson(url, body = null, method) {
    return (await req(url, body, method)).json()
}

const getLists = async () => {
    return await reqJson('lists')
}

const addList = async (name) => {
    return await req('lists', { name })
}

const deleteList = async (listId) => {
    await req('lists', { listId }, 'DELETE')
}

const addTodoToList = async (listId, todo) => {
    return await req('addTodoToList', { listId, todo })
}

const addTodoToListAtIndex = async (listId, todo, index) => {
    return await req('addTodoToList', { listId, todo, index })
}

const updateTodo = async (listId, todo) => {
    return await req('updateTodo', { listId, todo })
}

const removeTodoByIndex = async (listId, index) => {
    return await req('removeTodoByIndex', { listId, index }, 'DELETE')
}

const removeTodoById = async (listId, todoId) => {
    return await req('removeTodoById', { listId, todoId }, 'DELETE')
}

const moveTodo = async (listId, oldIndex, newIndex) => {
    return await req('moveTodo', { listId, oldIndex, newIndex })
}

const changeListHeader = async (listId, newHeader) => {
    return await req('changeListHeader', { listId, newHeader })
}

const getLabels = async () => {
    return await reqJson('getLabels')
}

const addLabel = async (name, color) => {
    return await req('addLabel', { name, color })
}

const removeLabel = async (labelId) => {
    return await req('removeLabel', { labelId }, 'DELETE')
}

export {
    getLists,
    addList,
    deleteList,
    addTodoToList,
    addTodoToListAtIndex,
    updateTodo,
    removeTodoByIndex,
    removeTodoById,
    moveTodo,
    changeListHeader,
    getLabels,
    addLabel,
    removeLabel
}
