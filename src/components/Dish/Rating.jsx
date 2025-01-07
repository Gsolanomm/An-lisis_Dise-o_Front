import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

function Rating({ rating, setRating, readOnly = false}) {

    const [] = useState(null);
    const [hover, setHover] = useState(null);

    return(
        <div className='Rating'>

            {[...Array(5)].map((star, index) => {

                const currentRating = index+1;
                return(
                    <label >
                        {!readOnly && <input 
                            type="radio" 
                            name="rating"
                            value={currentRating}
                            style={{ display: 'none' }} 
                            onClick={() => setRating && setRating(currentRating)}
                        />}
                        <FaStar 
                            className='star' 
                            size={50} 
                            color={currentRating <= (hover || rating) ? "#ffc107":"#e4e5e9"}
                            onMouseEnter={() => !readOnly && setHover(currentRating)}
                            onMouseLeave={() => !readOnly && setHover(null)}
                            onClick={() => !readOnly && setRating && setRating(currentRating)}
                        />
                    </label>
                );

            })}

        </div>
    );
}

export default Rating;