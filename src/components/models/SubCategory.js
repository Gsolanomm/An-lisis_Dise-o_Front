export const createSubCategory = (idSubCategory, idCategory, name, createdAt, updatedAt) => {
    return {
        idSubCategory,
        idCategory,
        name,
        createdAt: new Date(createdAt), // Asegúrate de que sea un objeto Date si es necesario
        updatedAt: new Date(updatedAt),
    };
};
