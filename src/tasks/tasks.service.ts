import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
import { GetTasksByDateRangeDto } from './dto/get-tasks-by-date-range.dto';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        return this.taskRepository.GetTasksFilterDto(filterDto, user);
    }


    async searchTasksByUsername(username: string): Promise<Task[]> {
        return this.taskRepository.searchTasksByUsername(username);
    }

    async getTaskByID(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not found`);
        }
        return found

    }

    async createTask(CreateTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(CreateTaskDto, user);
    }

    async deleteTaskByID(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID: ${id} not found`)
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus,
        user: User): 
        Promise<Task> {
        const task = await this.getTaskByID(id, user);
        task.status = status;
        await task.save()
        return task;
    }

    async getTasksByDateRange(
        getTasksByDateRangeDto: GetTasksByDateRangeDto,
        user: User
    ): Promise<Task[]> {
        return this.taskRepository.getTasksByDateRange(getTasksByDateRangeDto, user);
    }

}