import React, { useState, useEffect } from 'react';

interface Routes {
  [key: string]: string[];
}

const PriceEditPage: React.FC = () => {
  const [fromCity, setFromCity] = useState<string | undefined>(undefined);
  const [toCity, setToCity] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState('');
  const [routes, setRoutes] = useState<Routes>({});

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('https://lavial.icu/get-routes');
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      alert('A apărut o eroare la încărcarea rutelor.');
    }
  };

  const fetchPrice = async () => {
    if (!fromCity || !toCity) {
      alert('Vă rugăm să selectați ambele orașe.');
      return;
    }
  
    try {
      console.log('Fetching price for:', { from: fromCity, to: toCity });
  
      const response = await fetch('https://lavial.icu/get-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromCity,
          to: toCity,
          passengers: [{ isStudent: false }],  // Adaugă un pasager implicit
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        alert(`Eroare la încărcarea prețului: ${errorData.message}`);
        return;
      }
  
      const data = await response.json();
      console.log('Price data received from server:', data);
  
      if (data.routePrice !== undefined) {
        setPrice(data.routePrice.toString());
      } else {
        alert('Prețul nu a putut fi determinat. Verificați datele introduse.');
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      alert('A apărut o eroare la încărcarea prețului.');
    }
  };

  const handleSavePrice = async () => {
    if (!fromCity || !toCity || !price) {
      alert('Vă rugăm să completați toate câmpurile.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      alert('Introduceți un preț valid.');
      return;
    }

    try {
      await fetch('https://lavial.icu/update-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: fromCity, to: toCity, price: parsedPrice }),
      });
      alert('Prețul a fost actualizat cu succes.');
    } catch (error) {
      console.error('Error updating price:', error);
      alert('A apărut o eroare la actualizarea prețului.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">Modificare Preț</h2>

      <label className="block mb-2">Selectați orașul de plecare:</label>
      <select
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={fromCity}
        onChange={(e) => setFromCity(e.target.value)}
      >
        <option value="">Selectați orașul</option>
        {Object.keys(routes).map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <label className="block mb-2">Selectați orașul de destinație:</label>
      <select
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={toCity}
        onChange={(e) => setToCity(e.target.value)}
        disabled={!fromCity}
      >
        <option value="">Selectați orașul</option>
        {fromCity &&
          routes[fromCity] &&
          routes[fromCity].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
      </select>

      <button onClick={fetchPrice} className="w-full bg-blue-500 text-white py-2 rounded mb-4">
        Afișează Prețul
      </button>

      <label className="block mb-2">Prețul:</label>
      <input
        type="text"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={handleSavePrice} className="w-full bg-green-500 text-white py-2 rounded">
        Salvează Prețul
      </button>
    </div>
  );
};

export default PriceEditPage;