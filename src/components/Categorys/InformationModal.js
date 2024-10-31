import React, { useState } from 'react';

function InformationModal({ text, onConfirm, onCancel, mode, initialValue }) {
    const [inputValue, setInputValue] = useState(initialValue || '');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleConfirm = () => {
        onConfirm(inputValue);
    };

    return (
        <div
            className="modal-backdrop"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className="modal-content bg-dark text-white p-4" style={{ width: '400px', borderRadius: '5px' }}>
                <h5>{mode === 1 ? 'Eliminar' : mode === 2 ? 'Detalles' : 'Editar'}</h5>
                <style>
                    {`
                    .modal-text::-webkit-scrollbar {
                        width: 8px; /* Ancho del scrollbar */
                    }
                    .modal-text::-webkit-scrollbar-track {
                        border-radius: 10px;
                        background: #080808; /* Fondo del track */
                    }
                    .modal-text::-webkit-scrollbar-thumb {
                        background-color: #B74046; /* Color del thumb */
                        border-radius: 10px; /* Bordes redondeados */
                    }
                    .modal-text::-webkit-scrollbar-thumb:hover {
                        background-color: #A03038; /* Color del thumb en hover */
                    }
                    `}
                </style>
                <div
                    className="modal-text"
                    style={{
                        maxHeight: '200px', // Ajusta la altura máxima según sea necesario
                        overflowY: 'auto',
                        marginBottom: '1rem', // Espaciado inferior
                    }}
                >
                    {mode === 3 ? (
                        <>
                            <p>Ingrese el nuevo nombre:</p>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Nuevo nombre"
                            />
                        </>
                    ) : (
                        text
                    )}
                </div>
                <div className="mt-4 d-flex justify-content-center">
                    {mode === 1 || mode === 3 ? (
                        <>
                            <button
                                className="btn btn_primary"
                                onClick={onCancel}
                                style={{
                                    backgroundColor: '#6C757D',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '10px 13px',
                                    fontSize: '17px',
                                    minWidth: '80px',
                                    whiteSpace: 'nowrap',
                                    marginRight: '5px',
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn_primary"
                                onClick={handleConfirm}
                                style={{
                                    backgroundColor: '#C83F46',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '10px 13px',
                                    fontSize: '17px',
                                    minWidth: '80px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Confirmar
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn_primary"
                            onClick={onCancel}
                            style={{
                                backgroundColor: '#6C757D',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '10px 13px',
                                fontSize: '17px',
                                minWidth: '80px',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Cerrar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InformationModal;