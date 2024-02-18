import { Document } from 'mongoose';
import { NextFunction } from 'express'; // Eğer NextFunction tipi için tip güvenliği istiyorsanız

interface IUserDocument extends Document {
  role?: string;
}

const setDefaultRoleMiddleware = function(this: IUserDocument, next: NextFunction) {
  if (!this.role) {
    this.role = 'user';
  }
  next();
};

export default setDefaultRoleMiddleware;
