import React, { useState, useEffect } from 'react';

import Aos from 'aos'
import SeeCategorys from './SeeCategorys'


function Setting() {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);


    const [CategoryVisibility, setCategoryVisibility] = useState(false);

    return (

        <>
            <div className="content-Pane" style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '50px', padding: '0', marginBottom: '100px', overflowX: 'hidden', height: '100%', }}>
                <div className="Settings d-flex flex-column flex-md-row mt-5">
                    <div className="settings p-3 border-end bg-dark text-white" style={{ width: '100%', position: 'relative', marginTop: '20px' }}>
                        <table className="table table-borderless text-white">
                            <thead>
                                <tr>
                                    <th className="text-center">Configuraciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="mt-2">
                                    <td
                                        className="btn btn_primary text-center w-100"
                                        onClick={() => setCategoryVisibility(!CategoryVisibility)}
                                        style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold' }}
                                    >
                                        Categorías
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {CategoryVisibility && (
                <SeeCategorys />
            )}

                </div>
               
            </div>

     

        </>
    )
}

export default Setting