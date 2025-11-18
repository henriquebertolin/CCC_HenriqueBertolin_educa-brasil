import { db } from "../db";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { CreateAulasRequest, CreateAulasResponse, GetAulasFromCursoResponse, UpdateAulaVideoRequest } from "../entities/Aulas";
import { GetCursoData } from "../entities/Curso";
import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class AulasUseCase {

    private s3Client: S3Client;
    private bucketName: string;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });

        this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'educabrasil';
    }


    async createAula(aulaData: CreateAulasRequest): Promise<CreateAulasResponse> {
        const create = await db.query(`insert into aulas (id_curso, titulo, descricao, is_video, position, estimated_sec, material_text) values ($1, $2, $3, $4, $5, $6, $7) returning id`,
            [aulaData.id_curso, aulaData.titulo, aulaData.descricao, aulaData.is_video, aulaData.posicao, aulaData.estimated_sec, aulaData.material_text]);
        const alunosMatriculados = await db.query(`select * from matriculas where id_curso = $1`, [aulaData.id_curso]);
        for (const aluno of alunosMatriculados.rows) {
            await db.query(
                `INSERT INTO usuarios_aulas (id_aluno, id_aula, finalizado) VALUES ($1, $2, false)`,
                [aluno.id_aluno, create.rows[0].id]
            );
        }


        return create.rows[0];
    }

    async getAulasFromCurso(id: GetCursoData): Promise<GetAulasFromCursoResponse[]> {
        const aulasFromCurso = await db.query(`select id, id_curso, titulo, descricao, 
            is_video, position, is_published, estimated_sec, video_url, material_url, material_text from aulas
            where id_curso = $1`, [id.id]);
        return aulasFromCurso.rows;
    }

    async uploadMaterial(materialData: UpdateAulaVideoRequest): Promise<UpdateAulaVideoRequest> {
        console.log("veio pro usecase")
        const { id, /* estimated_sec, material_text,*/ material } = materialData;
        const aula = await db.query(`select * from aulas where id = $1`, [id]);
        if (aula.rows.length < 1) {
            throw new Error('Aula não encontrada');
        }

        const fileExtension = this.getFileExtension(material.filename);
        if ((aula.rows[0].is_video && fileExtension == ".pdf") || (!aula.rows[0].is_video && fileExtension == ".mp4")) {
            throw new Error('Esse tipo de material não está de acordo com o tipo da aula.');
        }
        const s3Key = `educabrasil/${id}${fileExtension}`;

        const uploadParams: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: s3Key,
            Body: material.buffer,
            ContentType: material.mimetype,
            // IMPORTANTE: Não definir ACL pública - arquivo será privado por padrão
            Metadata: {
                'original-filename': material.filename,
                'upload-date': new Date().toISOString(),
                'id': id,

            },
        };

        const uploadCommand = new PutObjectCommand(uploadParams);
        await this.s3Client.send(uploadCommand);
        if (fileExtension == ".mp4") {
            const updateQuery = await db.query(`update aulas set video_url = $2 where id = $1`, [id, s3Key]);
        } else {
            const updateQuery = await db.query(`update aulas set material_url = $2 where id = $1`, [id, s3Key]);

        }
        return {
            id,
            // estimated_sec,
            // material_text,
            material: {
                filename: material.filename,
                mimetype: material.mimetype,
            },
            material_url: s3Key, // útil para frontend
        } as any;

    }

    private getFileExtension(filename: string): string {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
    }

    async find(aulaData: CreateAulasResponse) {
        const query = await db.query(`select * from aulas a
        where a.id = $1`, [aulaData.id]);
        return query.rows[0];
    }

    async updateFinalizado(alunoId: string, aulaId: string) {
        try {
            const findCheck = await db.query(`select * from usuarios_aulas where id_aluno = $1 and id_aula = $2`, [alunoId, aulaId]);
            if (findCheck.rows.length < 1) {
                throw new Error('Aula não encontrada');
            }
            const updateCheck = await db.query(`update usuarios_aulas set finalizado = true where id = $1`, [findCheck.rows[0].id]); 
        } catch (error: any) {
            throw new Error('Error accessing class');
        }
    }

    async getMaterialUrl(aulaId: string): Promise<string> {
        try {
            const aula = await db.query(`select * from aulas where id = $1`, [aulaId]);

            if (aula.rows.length === 0) {
                throw new Error('aula was not found');
            }
            let s3Key;
            if (aula.rows[0].is_video) {
                s3Key = aula.rows[0].video_url;
            } else {
                s3Key = aula.rows[0].material_url;
            }


            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: s3Key,
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn: 360000, //COLOCAR NO .ENV
            });

            return signedUrl;

        } catch (error: any) {
            throw new Error('Error accessing class');
        }
    }
}