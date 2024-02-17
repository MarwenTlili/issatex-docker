<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DailyProductionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;
use Doctrine\DBAL\Types\Types;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Validator\Constraints\DateInRangeOfEntityAttributes;
use App\Validator\Constraints\UniqueDate;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\Unique;

#[ORM\Entity(repositoryClass: DailyProductionRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
#[GetCollection(normalizationContext: ['groups' => ['DailyProduction_Collection']])]
#[Get(normalizationContext: ['groups' => ['DailyProduction_Get']])]
#[Post()]
#[Put(normalizationContext: ['groups' => ['DailyProduction_Put']])]
#[Delete()]
class DailyProduction {
    #[Groups(['DailyProduction_Collection', 'DailyProduction_Get'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[Groups(['DailyProduction_Collection', 'DailyProduction_Get'])]
    #[ORM\Column]
    // #[Assert\PositiveOrZero]
    private ?int $firstChoiceQuantity = null;

    #[Groups(['DailyProduction_Collection', 'DailyProduction_Get'])]
    #[ORM\Column]
    // #[Assert\PositiveOrZero]
    private ?int $secondChoiceQuantity = null;
    
    #[Groups(['DailyProduction_Collection', 'DailyProduction_Get'])]
    #[ORM\ManyToOne(inversedBy: 'dailyProductions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ilot $ilot = null;
    
    #[Groups(['DailyProduction_Collection', 'DailyProduction_Get'])]
    #[ORM\ManyToOne(inversedBy: 'dailyProductions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?WeeklySchedule $weeklySchedule = null;
    
    #[Groups(['DailyProduction_Collection', 'DailyProduction_Get'])]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[UniqueDate(field: 'weeklySchedule')]
    #[DateInRangeOfEntityAttributes(targetEntity: 'weeklySchedule', startAtField: 'startAt', endAtField: 'endAt')]
    private ?\DateTimeInterface $day = null;

    public function __construct() {
    }

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

    public function getDay(): ?\DateTimeInterface {
        return $this->day;
    }

    public function setDay(\DateTimeInterface $day): self {
        $this->day = $day;

        return $this;
    }
}
