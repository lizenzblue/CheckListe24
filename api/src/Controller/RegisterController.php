<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
   #[Route('/api/register', name: 'register')]
   public function register(Request $request, EntityManagerInterface $entityManagerInterface, UserPasswordHasherInterface $passwordHasher): Response
   {
      $requestData = json_decode($request->getContent(), true);
      $email = strval($requestData['email']);
      $username = strval($requestData['username']);
      $password = strval($requestData['password']);

      // for testing purposes
      /*$email = "test@mail.com";
      $username = "test";
      $password = "test";*/

      if (isset($requestData)) {
         $user = new User();
         $hashedpwd = $passwordHasher->hashPassword($user, $password);
         $user->setUsername($username);
         $user->setEmail($email);
         $user->setPassword($hashedpwd);
         $user->setRoles(['ROLE_USER']);
         $entityManagerInterface->persist($user);
         $entityManagerInterface->flush();
      }
      return $this->json([
         'message' => 'User registered successfully',
      ]);
   }
}