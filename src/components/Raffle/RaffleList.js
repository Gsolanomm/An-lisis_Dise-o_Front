import React, { useEffect, useState } from 'react';
import RaffleCard from './RaffleCard';
import api from '../Auth/AxiosConfig';

function RaffleList() {
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const response = await api.get('/raffle/all');
        setRaffles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching raffles:', error);
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await api.get('/auth/verify-role');
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchRaffles();
    fetchUserRole();
  }, []);

  if (loading) return <p>CARGANDO RIFAS...</p>;

  return (
    <div className="container">
      <div className="row justify-content-center">
        {raffles.length === 0 ? (
          <p>No existen rifas disponibles.</p>
        ) : (
          raffles.map((raffle) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={raffle.idRaffle}>
              <RaffleCard
                id={raffle.idRaffle}
                title={raffle.title}
                imageUrl={`${raffle.urlImage}`}
                description={raffle.details}
                startDate={raffle.startDate}
                endDate={raffle.endDate}
                userRole={userRole} // Pasar el rol del usuario
                award={raffle.award}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RaffleList;
