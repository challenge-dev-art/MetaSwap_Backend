import { Service } from 'typedi';
import { prisma } from '@/prisma-client';
import { Document } from '@prisma/client';
import { assertNever } from '@/utils/assertNever';
import { DocumentsRequest, UpdateDocumentsRequest, DeleteDocumentsRequest } from '@/interfaces/documents.interface';

export type GetAllDocumentsResult = { kind: 'OK'; documents: Document[] } | { kind: 'DOCUMENTS_NOT_FOUND' };

export type GetDocumentsResult = { kind: 'OK'; documents: Document } | { kind: 'DOCUMENTS_NOT_FOUND' };

export type CreateDocumentsResult = { kind: 'OK'; documents: Document } | { kind: 'DOCUMENTS_NOT_FOUND' };

export type DeleteDocumentsResult = { kind: 'OK', documents: Document } | { kind: 'DOCUMENTS_NOT_FOUND' };

@Service()
export class DocumentsService {
  public documents = prisma.document;

  public async getAllDocuments(): Promise<GetAllDocumentsResult> {
    const documents = await this.documents.findMany();
    if (!documents) {
      return { kind: 'DOCUMENTS_NOT_FOUND' };
    }
    return { kind: 'OK', documents };
  }

  public async getDocumentsById(documentsId: number): Promise<GetDocumentsResult> {
    const documents = await this.documents.findUnique({
      where: {
        id: documentsId,
      },
    });
    if (!documents) {
      return { kind: 'DOCUMENTS_NOT_FOUND' };
    }
    return { kind: 'OK', documents };
  }

  public async createDocuments(documents: DocumentsRequest): Promise<GetDocumentsResult> {
    const createdDocuments = await this.documents.create({
      data: {
        userId: documents.userId,
        title: documents.title,
        content: documents.content
      }
    });
    if (!createdDocuments) {
      return { kind: 'DOCUMENTS_NOT_FOUND' };
    }
    return { kind: 'OK', documents: createdDocuments };
  }

  public async updateDocuments(documents: UpdateDocumentsRequest): Promise<CreateDocumentsResult> {
    const existingDocuments = await this.documents.findUnique({
      where: {
        id: documents.id,
      },
    });
    if (!existingDocuments) {
      return { kind: 'DOCUMENTS_NOT_FOUND' };
    } else {
      const updatedDocuments = await this.documents.update({
        where: {
          id: documents.id,
        },
        data: {
          userId: documents.userId,
          title: documents.title,
          content: documents.content
        }
      });
      if (!updatedDocuments) {
        return { kind: 'DOCUMENTS_NOT_FOUND' };
      }
      return { kind: 'OK', documents: updatedDocuments };
    }
  }

  public async deleteDocuments(documents: DeleteDocumentsRequest): Promise<DeleteDocumentsResult> {
    const existingDocuments = await this.documents.findUnique({
      where: {
        id: documents.id
      },
    });
    if (!existingDocuments) {
      return { kind: 'DOCUMENTS_NOT_FOUND' };
    } else {
      const deletedDocuments = await this.documents.delete({
        where: {
          id: documents.id
        }
      });
      if (deletedDocuments) {
        return { kind: 'OK', documents: deletedDocuments };
      }
      
    }
  }
}