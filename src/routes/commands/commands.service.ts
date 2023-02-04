import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Command, CommandDocument} from "./command.schema";
import {PostCommandDto} from "./dto/post-command.dto";
import {PostManyCommandsDto} from "./dto/post-many-commands.dto";
import {UpdateCommandDto} from "./dto/update-command.dto";

@Injectable()
export class CommandsService {
    constructor(@InjectModel('commands') private readonly commandsModel: Model<CommandDocument>) {}

    async findOne(name: string) {
        return this.findOneRaw(name);
    }

    async findMany(names: string[]) {
        return this.findManyRaw(names);
    }

    async findAll() {
        return this.commandsModel.find().exec();
    }

    async putOne(postCommandDto: PostCommandDto) {
        const existingCommand = await this.findOneRaw(postCommandDto.name);
        if (existingCommand)
            throw new HttpException('There is already a command with the name: ' + postCommandDto.name, HttpStatus.BAD_REQUEST);
        postCommandDto.description ??= '';
        return new this.commandsModel(postCommandDto).save();
    }

    async putMany(postManyCommandsDto: PostManyCommandsDto) {
        await this.deleteManyRaw(postManyCommandsDto.commands.map(e => e.name));
        return this.commandsModel.insertMany(PostManyCommandsDto);
    }

    async updateOne(id: string, updateCommandDto: UpdateCommandDto) {
        const command = await this.findOneRawById(id);
        if (!command)
            throw new HttpException('There is no such command with id: ' + id, HttpStatus.NOT_FOUND);
        return this.updateOneRaw(command, updateCommandDto);
    }

    private async findOneRaw(name: string) {
        return this.commandsModel.findOne({ name: name }).exec();
    }

    private async findOneRawById(id: string) {
        return this.commandsModel.findOne({ id: id }).exec();
    }

    private async findManyRaw(names: string[]) {
        return this.commandsModel.find({ name: { $in: names } }).exec();
    }

    private async updateOneRaw(command: Command, updateCommandDto: UpdateCommandDto) {
        command.name = updateCommandDto.name ?? command.name;
        command.description = updateCommandDto.description ?? command.description;
        command.category = updateCommandDto.description ?? command.description;
        return this.commandsModel.updateOne({ id: command.id }, command);
    }

    private async deleteOneRaw(name: string) {
        return this.commandsModel.deleteOne({ name: name }).exec();
    }

    private async deleteManyRaw(names: string[]) {
        return this.commandsModel.deleteMany({ name: { $in: names }}).exec();
    }
}
