// src/models/Category.js
export const createCategory = (idCategory, name, createdAt, updatedAt) => {
    return {
        idCategory,
        name,
        createdAt: new Date(createdAt), // Asegúrate de que sea un objeto Date si es necesario
        updatedAt: new Date(updatedAt),
    };
};
