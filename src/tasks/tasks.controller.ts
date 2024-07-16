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
import { GetTasksByDateRangeDto } from './dto/get-tasks-by-date-range.dto';

@Controller('tasks')

export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) { }

    @Get()
    @UseGuards(AuthGuard())
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/search/:username')
    searchTasksByUsername(@Param('username') username: string): Promise<Task[]> {
        this.logger.verbose(`Searching tasks for user ${username}`);
        return this.tasksService.searchTasksByUsername(username);
    }

    @Get('/date-range')
    @UseGuards(AuthGuard())
    getTasksByDateRange(
        @Query(ValidationPipe) getTasksByDateRangeDto: GetTasksByDateRangeDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retrieving tasks between ${getTasksByDateRangeDto.startDate} and ${getTasksByDateRangeDto.endDate}`);
        return this.tasksService.getTasksByDateRange(getTasksByDateRangeDto, user);
    }

    @Get('/:id')
    @UseGuards(AuthGuard())
    getTaskByID(@Param('id', ParseIntPipe) id: number, @GetUser() user:User): Promise<Task> {
        return this.tasksService.getTaskByID(id, user);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard())
    deleteTaskByID(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTaskByID(id, user);
    }

    @Patch('/:id/status')
    @UseGuards(AuthGuard())
    updateTaskStatusByID(@Param('id') id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);

    }

    @Post()
    @UsePipes()
    @UseGuards(AuthGuard())
    createTask(@Body(new ValidationPipe({ transform: true })) createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User ${user.username} has created a task with the following data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }



}
