import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { DocumentsController } from '@/controllers/documents.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { AdminValidationMiddleware } from '@/middlewares/admin-validation.middleware';
import { CreateDocumentsDto, UpdateDocumentsDto, DeleteDocumentsDto } from '@/dtos/documents.dto';

export class DocumentsRoute implements Routes {
  public path = '/documents';
  public router = Router();
  public documents = new DocumentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.documents.getAllDocuments(req, res, next).catch(next); 
    });

    this.router.get(`${this.path}/get-documents`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.documents.getDocumentsById(req, res, next).catch(next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), AdminValidationMiddleware(), ValidationMiddleware(CreateDocumentsDto), (req: RequestWithUser, res, next) => {
      this.documents.createDocuments(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/update`, AuthMiddleware(), AdminValidationMiddleware(), ValidationMiddleware(UpdateDocumentsDto), (req: RequestWithUser, res, next) => {
      this.documents.updateDocuments(req, res, next).catch(next);
    });

    this.router.delete(`${this.path}`, AuthMiddleware(), AdminValidationMiddleware(), ValidationMiddleware(DeleteDocumentsDto), (req: RequestWithUser, res, next) => {
      this.documents.deleteDocuments(req, res, next).catch(next);
    });

  }
}