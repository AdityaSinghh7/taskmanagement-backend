import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        return this.taskRepository.GetTasksFilterDto(filterDto, user);
    }


    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    async getTaskByID(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not found`);
        }
        return found

    }

    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    //     const { status, search } = filterDto;

    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task =>
    //             task.title.includes(search) || task.description.includes(search),
    //         );
    //     }

    //     return tasks;
    // }

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

}
