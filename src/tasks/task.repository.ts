import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { log } from 'console';
import { plainToInstance } from 'class-transformer';
import { GetTasksByDateRangeDto } from './dto/get-tasks-by-date-range.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
    constructor(private dataSaource: DataSource) {
        super(Task, dataSaource.createEntityManager());
    }
    private logger = new Logger();
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description, date } = createTaskDto;


        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        task.userId = user.id;
        task.date = date;
        try {
            await task.save()
        } catch (error) {
            this.logger.error(`Failed to save task in repository by user: ${user.username}, dto: ${createTaskDto}`, error.stack)
            throw new InternalServerErrorException();
        }

        
        delete task.user;
        return task;
    }

    async getTasksByDateRange(
        getTasksByDateRangeDto: GetTasksByDateRangeDto,
        user: User
    ): Promise<Task[]> {
        const { startDate, endDate } = getTasksByDateRangeDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id })
            .andWhere('task.date BETWEEN :startDate AND :endDate', { startDate, endDate });

        const tasks = await query.getMany();
        return tasks;
    }




    async GetTasksFilterDto(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', {userId: user.id});

        if(status){
            query.andWhere('task.status = :status', {status});
        }

        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
        }

        try{
            const tasks = await query.getMany();
            return tasks;
        } catch(error)
        {
            this.logger.error(`error caught while getting tasks for user: ${user.username}, Filters: ${JSON.stringify(filterDto)}`)
            throw new InternalServerErrorException();
        }
    }



    async searchTasksByUsername(username: string): Promise<Task[]> {
        const query = this.createQueryBuilder('task')
            .innerJoinAndSelect('task.user', 'user')
            .where('user.username LIKE :username', { username: `%${username}%` });

        const tasks = await query.getMany();
        
        return tasks.map(task => plainToInstance(Task, task));
    }
}
