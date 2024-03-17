import axios from "axios";
import { useEffect, useState } from "react";
// BarChart ve Bar bileşenlerini import ediyoruz.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "../styles/chart.scss";

const Chart = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:3000/todo/report", {
      withCredentials: true,
    });
    console.log(response.data);
  
    setData(
      response.data.map((item:any) => ({ // data ile gelen tüm verileri map ile dönüyoruz çünkü verileri ayrıştırıp grafik içinde ayrı ayrı eklencek
        name: `${item._id.month}/${item._id.year}`, // XAxis'de görünecek eğik çizgi ile ay ve yıl birbirinden ayrılıyor
        count: item.count, // Barların yüksekliği
      }))
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="chartContainer">
        <div className="chartTitleArea">
          <h3 className="chartTitle">Todo Ekleme Oranı Grafiği(aylara göre)</h3>
        </div>
        <div className="chartArea">
          <BarChart
            className="chart"
            width={500} // grafiğin genişlği
            height={300} // grafiğin yüksekliği
            data={data} // grafiğin içerdiği veriler data adlı state içinden geliyor
            margin={{  // grafiğin diğer elemanlar ile olan mesafesini ayarlar
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* garfiğin arkasına ızgara ekler 3 3 olması 3 piksel çizgi 3 piksel boşluk olması ayarlanıyor */}
            <XAxis dataKey="name" /> 
            {/* x ekseninde ne olacağına burada karar veriliyor */}
            <YAxis />
            {/* y ekseni için burada ayarlanıyor */}
            <Tooltip /> 
            {/* fare imleci üzerine gelince gösterilecek olan bilgi penceresi */}
            <Legend />
            {/* aynı grafikte birden fazla veri grubu varsa bunların hangi renk olacağı burada ayarlanır */}
            <Bar dataKey="count" fill="#F4EAE0" />
            {/* bar çubuklarını temsil ediyor hangi veriyi alacakları ne kadar yüksek olacakları gibi burada ayarlanıyor  */}
          </BarChart>
        </div>
      </div>
    </>
  );
};

export default Chart;
