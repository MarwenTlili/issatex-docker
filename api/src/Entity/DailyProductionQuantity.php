<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DailyProductionQuantityRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: DailyProductionQuantityRepository::class)]
#[ApiResource()]
#[GetCollection(normalizationContext: ['groups' => ['Quantity_Collection']])]
#[Get(normalizationContext: ['groups' => ['Quantity_Get']])]
#[Post()]
#[Put()]
#[Delete()]
class DailyProductionQuantity {
    #[Groups(['Quantity_Get', 'Quantity_Collection', 'DailyProduction_Get'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[Groups(['Quantity_Get', 'Quantity_Collection', 'DailyProduction_Get', 'Schedule_Collection', 'Schedule_Get'])]
    #[ORM\Column]
    private ?int $quantity = null;

    #[Groups(['Quantity_Get', 'Quantity_Collection', 'DailyProduction_Get', 'Schedule_Collection', 'Schedule_Get'])]
    #[ORM\ManyToOne(inversedBy: 'dailyProductionQuantities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Size $size = null;

    #[Groups(['Quantity_Get', 'Quantity_Collection', 'DailyProduction_Get', 'Schedule_Collection', 'Schedule_Get'])]
    #[ORM\ManyToOne(inversedBy: 'dailyProductionQuantities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Choice $choice = null;

    #[Groups(['Quantity_Get', 'Quantity_Collection'])]
    #[ORM\ManyToOne(inversedBy: 'dailyProductionQuantities')]
    private ?DailyProduction $dailyProduction = null;

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getQuantity(): ?int {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self {
        $this->quantity = $quantity;

        return $this;
    }

    public function getSize(): ?Size {
        return $this->size;
    }

    public function setSize(?Size $size): self {
        $this->size = $size;

        return $this;
    }

    public function getChoice(): ?Choice {
        return $this->choice;
    }

    public function setChoice(?Choice $choice): self {
        $this->choice = $choice;

        return $this;
    }

    public function getDailyProduction(): ?DailyProduction {
        return $this->dailyProduction;
    }

    public function setDailyProduction(?DailyProduction $dailyProduction): self {
        $this->dailyProduction = $dailyProduction;

        return $this;
    }
}
