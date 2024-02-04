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
            $userTasks[] = [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'description' => $task->getDescription(),
                'status' => $task->getStatus(),
            ];
        }

        return $this->json([
            'tasks' => $userTasks,
        ]);
    }

}