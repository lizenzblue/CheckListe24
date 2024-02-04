<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DataProviderController extends AbstractController
{
    #[Route('/api/getUsersForForm', name: 'getUserData')]
    public function getUserData(EntityManagerInterface $entityManagerInterface): Response
    {
        $users = $entityManagerInterface->getRepository(User::class)->findAll();
        $modifiedUsers = [];
        foreach ($users as $user) {
            $modifiedUsers[] = [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
            ];
        }
        return $this->json([
            'users' => $modifiedUsers,
        ]);
    }

    #[Route('/api/getUserAccount', name: 'getUserDataAccount')]
    public function getUserDataAccount(EntityManagerInterface $entityManagerInterface, Request $request): Response
    {
        $requestData = json_decode($request->getContent(), true);
        $username = strval($requestData['username']);
        $user = $entityManagerInterface->getRepository(User::class)->findOneBy(['username' => $username]);
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
            "userId" => $user->getId(),
            "username" => $user->getUsername(),
            "tasks" => $userTasks,
        ]);
    }
}