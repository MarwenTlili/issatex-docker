<?php

namespace App\Controller;

use App\Entity\TechnicalDocument;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class CreateTechnicalDocumentAction extends AbstractController {
    public function __invoke(Request $request): TechnicalDocument {
        $uploadedFile = $request->files->get('file');

        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        $technicalDocument = new TechnicalDocument();
        $technicalDocument->setFile($uploadedFile);

        return $technicalDocument;
    }
}
