<?php

namespace App\Entity;

use App\Repository\MediaObjectRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model;
use App\Controller\CreateArticleImageAction;
use App\Repository\ArticleImageRepository;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\Entity(repositoryClass: ArticleImageRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['article_image:read']],
    types: ['https://schema.org/MediaObject'],
    operations: [
        new Get(),
        new GetCollection(),
        new Delete(),
        new Post(
            controller: CreateArticleImageAction::class,
            deserialize: false,
            validationContext: ['groups' => ['Default', 'article_image_create']],
            openapi: new Model\Operation(
                requestBody: new Model\RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            )
        ),
    ]
)]
class ArticleImage {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'])]
    #[Groups(['article_image:read'])] // 'user:read'
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contentUrl = null;

    #[Vich\UploadableField(mapping: "article_image", fileNameProperty: "filePath")]
    #[Assert\Notnull(groups: ['article_image_create'])]
    private ?File $file = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $filePath = null;

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getContentUrl(): ?string {
        return $this->contentUrl;
    }

    public function setContentUrl(?string $contentUrl): self {
        $this->contentUrl = $contentUrl;

        return $this;
    }

    public function getFile(): ?File {
        return $this->file;
    }

    public function setFile(?File $file): self {
        $this->file = $file;

        return $this;
    }

    public function getFilePath(): ?string {
        return $this->filePath;
    }

    public function setFilePath(?string $filePath): self {
        $this->filePath = $filePath;

        return $this;
    }
}
