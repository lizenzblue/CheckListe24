<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class TestController extends AbstractController
{
   #[Route('/test', name: 'test')]
   public function test(Request $request, UserPasswordHasherInterface $passwordHasher): Response
   {
    return $this->json([
        'message' => 'Test',
     ]);
   }
}