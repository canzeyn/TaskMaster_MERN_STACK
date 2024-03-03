import  { useState } from "react";
import { Table } from "reactstrap";
import "../../../styles/logContent.scss";
import axios from "axios";
import { useEffect } from "react";

interface LogData {
  _id: string;
  level: number;
  time: string;
  pid: number;
  hostname: string;
  userId: string;
  description: string;
  action: string;
}



const UsersLogContent: React.FC = () => {
  const [logData , setLogData] = useState<LogData>();

  const getLogsData = async () => {
    const response = await axios.get("http://localhost:3000/getAllLogs", {
      withCredentials: true,
    });
    setLogData(response.data)
    console.log("usersLogContentData.tsx: çekilen veriler: " , logData)
  };

  useEffect(() => {
       getLogsData();
  },[])
  return (
    <>
      <div className="logContainer">
        <div className="logTitleArea">
          <h3 className="logTitle">log Content User Name</h3>
        </div>

        <div className="logTableArea">
          <Table className="logTable" hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>action</th>
                <th>level</th>
                <th>details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>index</th>
                <td>ronaldo</td>
                <td>todo eklendi</td>
                <td>info</td>
                <td>todo var burada...</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default UsersLogContent;
