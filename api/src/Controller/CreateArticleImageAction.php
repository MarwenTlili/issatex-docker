<?php

namespace App\Controller;

use App\Entity\ArticleImage;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class CreateArticleImageAction extends AbstractController {
    public function __invoke(Request $request): ArticleImage {
        $uploadedFile = $request->files->get('file');

        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        $articleImage = new ArticleImage();
        $articleImage->setFile($uploadedFile);

        return $articleImage;
    }
}
