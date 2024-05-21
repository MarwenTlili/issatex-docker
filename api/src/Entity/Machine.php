<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MachineRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;

#[ORM\Entity(repositoryClass: MachineRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'name' => 'ipartial',
        'category' => 'ipartial',
        'brand' => 'ipartial',
    ]
)]
#[ApiFilter(OrderFilter::class)]
#[ApiFilter(ExistsFilter::class, properties: ['islet'])] // ?exists[islet]=false
class Machine {
    #[Groups(['user:read'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $category = null;

    #[ORM\Column(length: 255)]
    private ?string $brand = null;

    #[ORM\ManyToOne(inversedBy: 'machines')]
    private ?Islet $islet = null;

    public function __construct() {}

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }

    public function getCategory(): ?string {
        return $this->category;
    }

    public function setCategory(string $category): self {
        $this->category = $category;

        return $this;
    }

    public function getBrand(): ?string {
        return $this->brand;
    }

    public function setBrand(string $brand): self {
        $this->brand = $brand;

        return $this;
    }

    public function getIslet(): ?Islet
    {
        return $this->islet;
    }

    public function setIslet(?Islet $islet): self
    {
        $this->islet = $islet;

        return $this;
    }
}
