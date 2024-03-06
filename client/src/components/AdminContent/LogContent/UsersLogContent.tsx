import { Table } from "reactstrap";
import "../../../styles/logContent.scss";
import { useLogData } from "../../context/logContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const UsersLogContent: React.FC = () => {
  const { state } = useLogData(); // Context'ten state'i çekiyoruz
  const { logData, selectUserName } = state; // state içinden logData'yı alıyoruz

  const [selectedLogLevel, setSelectedLogLevel] = useState<string>("all");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!selectUserName) {
      // eğer name değeri yoksa dashboard kısmına yönelndiriyor
      navigate("/dashboard");
    }
  }, [selectUserName]);

  const logLevels: { [key: string]: number | null } = {
    all: null,
    info: 30,
    warn: 40,
    error: 50,
  };

  const handleLogLevelChange = (event: any) => {
    setSelectedLogLevel(event.target.value);
  };

  const handleSearchLogChange = (e: any) => {
    setSearch(e.target.value);
  };

  const filteredLogData = logData.filter((item: any) => {
    if (selectedLogLevel === "all") {
      return true;
    }
    return item.level === logLevels[selectedLogLevel];
  });

  const finalFiltered = filteredLogData.filter((item: any) => {
    const description = item.description || "";
    return description.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="logContainer">
        <div className="logTitleArea">
          <h3 className="logTitle">Log Content for {selectUserName}</h3>
        </div>

        <div className="logSelectBoxArea">
          <select
            className="logSelectBox"
            onChange={handleLogLevelChange}
            value={selectedLogLevel}
          >
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>

          <input
            className="logInput"
            type="text"
            onChange={handleSearchLogChange}
            value={search}
          />
        </div>
        <div className="logTableArea">
          <Table className="logTable" hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Action</th>
                <th>Level</th>
                <th>Details</th>
                <th>time</th>
                <th>hostName</th>
              </tr>
            </thead>
            <tbody>
              {finalFiltered && finalFiltered.length > 0 ? (
                finalFiltered.map((item: any, index: any) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{item.action}</td>
                    <td>{item.level}</td>
                    <td className="logDescription">{item.description}</td>
                    <td>{item.hostname}</td>
                    <td>{ new Date( item.time).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>Veri yok</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default UsersLogContent;
