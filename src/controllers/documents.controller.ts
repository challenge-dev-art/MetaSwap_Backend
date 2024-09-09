import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { assertNever } from '@/utils/assertNever';
import { DocumentsService } from '@/services/documents.service';

export class DocumentsController {
  public documents = Container.get(DocumentsService);

  public async getAllDocuments(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const documents = await this.documents.getAllDocuments();
    switch (documents.kind) {
      case 'OK': {
        res.status(200).json({ kind: documents.kind, documents: documents.documents });
        break;
      }
      case 'DOCUMENTS_NOT_FOUND': {
        res.status(400).json({
          kind: 'DOCUMENTS_NOT_FOUND',
          message: 'documents not found',
        });
        break;
      }
      default: {
        assertNever(documents);
      }
    }
}

public async getDocumentsById(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
  try {
    const documentsId = Number(req.query.id);
    const documents = await this.documents.getDocumentsById(documentsId);
    switch (documents.kind) {
      case 'OK': {
        res.status(200).json({ kind: documents.kind, documents: documents.documents });
        break;
      }
      case 'DOCUMENTS_NOT_FOUND': {
        res.status(400).json({
          kind: 'DOCUMENTS_NOT_FOUND',
          message: 'documents not found',
        });
        break;
      }
      default: {
        assertNever(documents);
      }
    }
  } catch (error) {
    next(error);
  }
}

public async createDocuments(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
  try {
    const createDocuments = await this.documents.createDocuments({
      userId: req.user.id,
      title: req.body.title,
      content: req.body.content
    });
    switch (createDocuments.kind) {
      case 'OK': {
        res.status(200).json({ kind: createDocuments.kind, news: createDocuments.documents });
        break;
      }
      case 'DOCUMENTS_NOT_FOUND': {
        res.status(400).json({
          kind: 'DOCUMENTS_NOT_FOUND',
          message: 'documents not found',
        });
        break;
      }
      default: {
        assertNever(createDocuments);
      }
    }
  } catch (error) {
    next(error);
  }
}

public async updateDocuments(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
  try {
    const updateDocuments = await this.documents.updateDocuments({
      id: req.body.id,
      userId: req.user.id,
      title: req.body.title,
      content: req.body.content
    });
    switch (updateDocuments.kind) {
      case 'OK': {
        res.status(200).json({ kind: updateDocuments.kind, documents: updateDocuments.documents });
        break;
      }
      case 'DOCUMENTS_NOT_FOUND': {
        res.status(400).json({
          kind: 'DOCUMENTS_NOT_FOUND',
          message: 'documents not found',
        });
        break;
      }
      default: {
        assertNever(updateDocuments);
      }
    }
  } catch (error) {
    next(error);
  }
}

public async deleteDocuments(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleteDocuments = await this.documents.deleteDocuments({
      id: req.body.id
    });
    switch (deleteDocuments.kind) {
      case 'OK': {
        res.status(200).json({ kind: deleteDocuments.kind, news: deleteDocuments.documents });
        break;
      }
      case 'DOCUMENTS_NOT_FOUND': {
        res.status(400).json({
          kind: 'DOCUMENTS_NOT_FOUND',
          message: 'documents not found',
        });
        break;
      }
      default: {
        assertNever(deleteDocuments);
      }
    }
  } catch (error) {
    next(error);
  }
}
}