const users = []

const addUser = ({
    id,
    username,
    room
}) => {
    // clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && room.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username already taken!'
        }
    }

    // Store User
    const user = {
        id,
        username,
        room
    }
    user.push(user)
    return {
        user
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === user
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return user.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}