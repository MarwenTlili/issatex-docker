<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PackageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: PackageRepository::class)]
#[ApiResource]
class Package
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column]
    private ?int $articlesNumber = null;

    #[ORM\ManyToOne(inversedBy: 'packages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Palette $palette = null;

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getArticlesNumber(): ?int
    {
        return $this->articlesNumber;
    }

    public function setArticlesNumber(int $articlesNumber): self
    {
        $this->articlesNumber = $articlesNumber;

        return $this;
    }

    public function getPalette(): ?Palette
    {
        return $this->palette;
    }

    public function setPalette(?Palette $palette): self
    {
        $this->palette = $palette;

        return $this;
    }
}
