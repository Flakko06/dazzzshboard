import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Dato {
  id: number;
  nombre: string;
  valor: number;
  created_at?: string;
  [key: string]: any; // Index signature para compatibilidad con Recharts
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [data, setData] = useState<Dato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNombre, setNewNombre] = useState("");
  const [newValor, setNewValor] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Dato[]>(`${API_URL}/api/datos/`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre || !newValor) return;

    try {
      await axios.post(`${API_URL}/api/datos/`, {
        nombre: newNombre,
        valor: parseInt(newValor)
      });
      setNewNombre("");
      setNewValor("");
      fetchData();
    } catch (err) {
      console.error("Error al agregar dato:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/datos/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error al eliminar dato:", err);
    }
  };

  const totalValor = data.reduce((sum, item) => sum + item.valor, 0);
  const promedio = data.length > 0 ? (totalValor / data.length).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full xl:w-[85%] xl:mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Interactivo</h1>
          <p className="text-gray-600">Visualización de datos en tiempo real desde MySQL</p>
        </header>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Total de Registros</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{data.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Suma Total</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalValor}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium">Promedio</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{promedio}</p>
          </div>
        </div>

        {/* Formulario para agregar datos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Nuevo Dato</h2>
          <form onSubmit={handleAddData} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Valor"
              value={newValor}
              onChange={(e) => setNewValor(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Agregar
            </button>
          </form>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gráfico de Barras</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gráfico de Líneas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gráfico Circular</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="valor"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla de datos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tabla de Datos</h2>
            <div className="overflow-auto max-h-80">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Valor</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{item.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.nombre}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.valor}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;