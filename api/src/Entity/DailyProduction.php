<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DailyProductionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: DailyProductionRepository::class)]
#[ApiResource]
class DailyProduction {
    #[Groups(['user:read'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ORM\Column]
    private ?int $firstChoiceQuantity = null;

    #[ORM\Column]
    private ?int $secondChoiceQuantity = null;

    #[ORM\ManyToOne(inversedBy: 'dailyProductions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ilot $ilot = null;

    #[ORM\ManyToOne(inversedBy: 'dailyProductions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?WeeklySchedule $weeklySchedule = null;

    #[ORM\ManyToOne(inversedBy: 'dailyProductions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ProductionDate $productionDate = null;

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getFirstChoiceQuantity(): ?int {
        return $this->firstChoiceQuantity;
    }

    public function setFirstChoiceQuantity(int $firstChoiceQuantity): self {
        $this->firstChoiceQuantity = $firstChoiceQuantity;

        return $this;
    }

    public function getSecondChoiceQuantity(): ?int {
        return $this->secondChoiceQuantity;
    }

    public function setSecondChoiceQuantity(int $secondChoiceQuantity): self {
        $this->secondChoiceQuantity = $secondChoiceQuantity;

        return $this;
    }

    public function getIlot(): ?Ilot {
        return $this->ilot;
    }

    public function setIlot(?Ilot $ilot): self {
        $this->ilot = $ilot;

        return $this;
    }

    public function getWeeklySchedule(): ?WeeklySchedule {
        return $this->weeklySchedule;
    }

    public function setWeeklySchedule(?WeeklySchedule $weeklySchedule): self {
        $this->weeklySchedule = $weeklySchedule;

        return $this;
    }

    public function getProductionDate(): ?ProductionDate {
        return $this->productionDate;
    }

    public function setProductionDate(?ProductionDate $productionDate): self {
        $this->productionDate = $productionDate;

        return $this;
    }
}
