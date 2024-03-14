import axios from "axios";
import { useEffect, useState } from "react";
// BarChart ve Bar bileşenlerini import ediyoruz.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Chart = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:3000/todo/report", { withCredentials: true });
    console.log(response.data);
    setData(response.data.map((item:any) => ({
      name: `${item._id.month}/${item._id.year}`, // XAxis'de görünecek
      count: item.count
    })));
  }

  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <>
      <div>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
    </>
  )
}

export default Chart;
