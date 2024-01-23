//install ---> yarn add @types/multer
// https://www.youtube.com/watch?v=a0vf3WiTw3U&ab_channel=4SoftwareDevelopers

import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile,UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, ValidRoles } from '../auth/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {

    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage : diskStorage({
                    destination: './public/avatars',
                    filename : function(req, file, cb){
                        cb(null, file.originalname)
                    }
                })
            }
        )
    )
    @Post()
    uploadImage(@UploadedFile() file:Express.Multer.File) {
        console.log("archivo recibido", file)
        return {
            msg: 'Archivo cargado correctamente'
        }
    }
}