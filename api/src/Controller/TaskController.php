<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Task;

class TaskController extends AbstractController{
    #[Route('/api/createTask', name: 'createTask')]
    public function createTask(Request $request, EntityManagerInterface $entityManager): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $taskName = strval($requestData['taskName']);
        $taskDescription = strval($requestData['description']);
        $taskStatus = strval($requestData['status']);
        $usersFromRequest = $requestData['users'];
        $userId = $requestData['userId'];
        
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $userId]);
        $task = $user->createTask($taskName, $taskDescription, $taskStatus);
        $entityManager->persist($user);

        foreach ($usersFromRequest as $userFromRequest) {
            $anotherUser = $entityManager->getRepository(User::class)->findOneBy(['id' => $userFromRequest['id']]);
            $task->assignToUser($anotherUser);
        }

        $task->assignToUser($user);

        $entityManager->persist($task);
        $entityManager->flush();

        return $this->json([
            'message' => 'Task created successfully',
            'createdTask' => [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'description' => $task->getDescription(),
                'status' => $task->getStatus(),
                'users' => $task->getUsers()->map(fn($user) => ['id' => $user->getId(), 'username' => $user->getUsername()])->toArray(),
            ],
        ]);
    }

    #[Route('/api/getTaskUpdates', name: 'getTaskUpdates')]
    public function getTaskUpdates(Request $request, EntityManagerInterface $entityManager): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $userId = $requestData['userId'];
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $userId]);
        $tasks = $user->getTasks();
        
        $userTasks = [];
        foreach ($tasks as $task) {
            $taskUsers = $task->getUsers();
            $filteredUsers = [];
            foreach ($taskUsers as $taskUser) {
                if ($taskUser->getId() !== $userId) {
                    $filteredUsers[] = ['id' => $taskUser->getId(), 'username' => $taskUser->getUsername()];
                }
            }
        
            $userTasks[] = [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'description' => $task->getDescription(),
                'status' => $task->getStatus(),
                'users' => $filteredUsers,
            ];
        }
        
        

        return $this->json([
            'tasks' => $userTasks,
        ]);
    }

    #[Route('/api/updateTask', name: 'updateTask')]
    public function updateTask(Request $request, EntityManagerInterface $entityManager): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $taskId = $requestData['taskId'];
        $taskName = strval($requestData['taskName']);
        $taskDescription = strval($requestData['description']);
        $taskStatus = strval($requestData['status']);
        $usersFromRequest = $requestData['users'];
        $userId = $requestData['userId'];

        $task = $entityManager->getRepository(Task::class)->findOneBy(['id' => $taskId]);
        $task->setTitle($taskName);
        $task->setDescription($taskDescription);
        $task->setStatus($taskStatus);
        $task->removeAllUsers();

        foreach ($usersFromRequest as $userFromRequest) {
            $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $userFromRequest['id']]);
            $task->assignToUser($user);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $userId]);
        $task->assignToUser($user);

        $entityManager->persist($task);
        $entityManager->flush();

        return $this->json([
            'message' => 'Task updated successfully',
            'updatedTask' => [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'description' => $task->getDescription(),
                'status' => $task->getStatus(),
                'users' => $task->getUsers()->map(fn($user) => ['id' => $user->getId(), 'username' => $user->getUsername()])->toArray(),
            ],
        ]);
    }

    #[Route('/api/deleteTask', name: 'deleteTask')]
    public function deleteTask(Request $request, EntityManagerInterface $entityManager): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $taskId = $requestData['taskId'];

        $task = $entityManager->getRepository(Task::class)->findOneBy(['id' => $taskId]);
        $entityManager->remove($task);
        $entityManager->flush();

        return $this->json([
            'message' => 'Task deleted successfully',
        ]);
    }

    #[Route('/api/markTaskAsDone', name: 'markTaskAsDone')]
    public function markTaskAsDone(Request $request, EntityManagerInterface $entityManager): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $taskId = $requestData['taskId'];

        $task = $entityManager->getRepository(Task::class)->findOneBy(['id' => $taskId]);
        $task->setStatus('Completed');
        $entityManager->persist($task);
        $entityManager->flush();

        return $this->json([
            'message' => 'Task marked as done successfully',
            'updatedTask' => [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'description' => $task->getDescription(),
                'status' => $task->getStatus(),
                'users' => $task->getUsers()->map(fn($user) => ['id' => $user->getId(), 'username' => $user->getUsername()])->toArray(),
            ],
        ]);
    }
}