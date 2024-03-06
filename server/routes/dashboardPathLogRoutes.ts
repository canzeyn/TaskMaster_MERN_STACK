import express , {Request , Response} from 'express';
import pathLog from '../middlewares/pathLogMiddleware'; // Oluşturduğunuz middleware'i import edin
import verifyToken from '../middlewares/verifyToken';

const dashboardPathLogRouter = express.Router();

// Middleware'ı sadece bu rota için kullanın
dashboardPathLogRouter.post('/' , verifyToken, pathLog, (req:Request, res:Response) => {
  res.send('Dashboard sayfası');
});

export default dashboardPathLogRouter;
