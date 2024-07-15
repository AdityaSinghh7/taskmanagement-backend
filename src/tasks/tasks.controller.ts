import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user);
    }


    @Get('/:id')
    getTaskByID(@Param('id', ParseIntPipe) id: number, @GetUser() user:User): Promise<Task> {
        return this.tasksService.getTaskByID(id, user);
    }

    @Delete('/:id')
    deleteTaskByID(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTaskByID(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatusByID(@Param('id') id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);

    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() CreateTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User ${user.username} has created a task with the following data: ${JSON.stringify(CreateTaskDto)}`)
        return this.tasksService.createTask(CreateTaskDto, user);
    }



}
