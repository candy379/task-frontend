# TaskFlow - React Frontend

A responsive React frontend for the Task Management REST API developed for WA-2.

## Project Overview

TaskFlow is a task management web application that allows authenticated users to:

- Register an account
- Log in securely
- View their tasks
- Create new tasks
- View task details
- Edit existing tasks
- Mark tasks as completed
- Delete tasks
- Search and filter tasks
- Use the application on desktop and mobile devices

The frontend communicates with the REST API created in WA-2.

## Technologies Used

- React
- Vite
- React Router
- JavaScript
- CSS
- Lucide React
- REST API
- JWT authentication

## Features

### Authentication

- User registration
- User login
- JWT token storage
- Protected routes
- Logout functionality

### Task Management

- View all tasks
- View individual task details
- Create tasks
- Edit tasks
- Mark tasks as completed
- Delete tasks
- Search tasks
- Filter pending and completed tasks

### User Experience

- Loading states
- API error states
- Client-side form validation
- Responsive desktop layout
- Responsive mobile layout
- Confirmation before deleting tasks

## Routes

| Route | Description |
|---|---|
| `/login` | User login |
| `/register` | Create an account |
| `/tasks` | Task dashboard |
| `/tasks/new` | Create a new task |
| `/tasks/:id` | View task details |
| `/tasks/:id/edit` | Edit a task |

## API Configuration

The frontend uses the following environment variable:

```env
VITE_API_URL=http://localhost:5000/api