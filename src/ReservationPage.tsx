import React, { useEffect, useState } from 'react';

interface Reservation {
  tripType: string;
  from: string;
  fromStation: string;
  departureTime: string;
  to: string;
  toStation: string;
  arrivalTime: string;
  date: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  passportSerial: string;
  isStudent: boolean;
  studentIdSerial: string;
}

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fromCity, setFromCity] = useState<string>('');
  const [toCity, setToCity] = useState<string>('');
  const [reservationCount, setReservationCount] = useState<number>(0);
  const [reservationsStopped, setReservationsStopped] = useState<boolean>(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('https://lavial.icu/reservations');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    if (filterDate) {
      checkReservationStatus(new Date(filterDate));
    }
  }, [filterDate]);

  const checkReservationStatus = async (date: Date) => {
    try {
      const response = await fetch('https://lavial.icu/check-reservation-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date.toISOString() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reservation status');
      }

      const data = await response.json();
      setReservationsStopped(data.stopped);
    } catch (error) {
      console.error('Error checking reservation status:', error);
      alert('A apărut o eroare la verificarea stării rezervărilor.');
    }
  };

  useEffect(() => {
    if (filterDate) {
      const count = reservations.filter(
        (reservation) => new Date(reservation.date).toLocaleDateString('ro-RO') === new Date(filterDate).toLocaleDateString('ro-RO')
      ).length;
      setReservationCount(count);
    } else {
      setReservationCount(0);
    }
  }, [filterDate, reservations]);

  const resetFilters = () => {
    setFilterDate(undefined);
    setSearchQuery('');
    setFromCity('');
    setToCity('');
  };

  const toggleReservations = async () => {
    if (!filterDate) {
      alert('Selectați o dată pentru a opri/pornir rezervările');
      return;
    }

    const action = reservationsStopped ? 'start' : 'stop';
    try {
      const response = await fetch(`https://lavial.icu/${action}-reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date(filterDate).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} reservations`);
      }

      setReservationsStopped(!reservationsStopped);
      alert(`Rezervările au fost ${reservationsStopped ? 'pornite' : 'oprite'} pentru data selectată`);
    } catch (error) {
      console.error(`Error ${action}ping reservations:`, error);
      alert(`A apărut o eroare la ${action}ping rezervărilor`);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesDate = !filterDate || new Date(reservation.date).toLocaleDateString('ro-RO') === new Date(filterDate).toLocaleDateString('ro-RO');
    const matchesSearch = searchQuery === '' || reservation.name.toLowerCase().includes(searchQuery.toLowerCase()) || reservation.surname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFromCity = fromCity === '' || reservation.from.toLowerCase().includes(fromCity.toLowerCase());
    const matchesToCity = toCity === '' || reservation.to.toLowerCase().includes(toCity.toLowerCase());
    return matchesDate && matchesSearch && matchesFromCity && matchesToCity;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">Rezervări</h2>
      <div className="mb-6">
        <label className="block mb-2">Selectați data:</label>
        <input
          type="date"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={filterDate || ''}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <div className="mb-4">
          <button onClick={toggleReservations} className={`w-full py-2 rounded mb-4 ${reservationsStopped ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {reservationsStopped ? 'Porniți Rezervările' : 'Opriți Rezervările'}
          </button>
        </div>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Căutați după nume..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="De la oraș..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="La oraș..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={toCity}
          onChange={(e) => setToCity(e.target.value)}
        />
        <button onClick={resetFilters} className="w-full bg-yellow-500 text-white py-2 rounded mb-4">
          Resetați Filtrele
        </button>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Rezervări pentru {filterDate ? new Date(filterDate).toLocaleDateString('ro-RO') : 'selectați o dată'}: {reservationCount}</p>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        filteredReservations.map((reservation) => (
          <div key={reservation.email + reservation.date} className="border-b p-4">
            <p>
              <strong>Pasager:</strong> {reservation.name} {reservation.surname}
            </p>
            <p>
              <strong>De la:</strong> {reservation.from} ({reservation.fromStation}) - <strong>La:</strong> {reservation.to} ({reservation.toStation})
            </p>
            <p>
              <strong>Data:</strong> {new Date(reservation.date).toLocaleDateString('ro-RO')}
            </p>
            {expandedReservation === reservation.email + reservation.date && (
              <div className="mt-4">
                <p><strong>Tipul călătoriei:</strong> {reservation.tripType}</p>
                <p><strong>Ora plecării:</strong> {reservation.departureTime}</p>
                <p><strong>Ora sosirii:</strong> {reservation.arrivalTime}</p>
                <p><strong>Email:</strong> {reservation.email}</p>
                <p><strong>Telefon:</strong> {reservation.phone}</p>
                {reservation.isStudent && <p><strong>Legitimația de student:</strong> {reservation.studentIdSerial}</p>}
              </div>
            )}
            <button
              className="mt-4 text-blue-500"
              onClick={() => setExpandedReservation(expandedReservation === reservation.email + reservation.date ? null : reservation.email + reservation.date)}
            >
              {expandedReservation === reservation.email + reservation.date ? 'Ascunde Detalii' : 'Afișează Detalii'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ReservationList;