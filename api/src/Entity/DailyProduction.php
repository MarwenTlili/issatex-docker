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
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

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
    #[ORM\ManyToOne(inversedBy: 'dailyProductions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?WeeklySchedule $weeklySchedule = null;

    #[Groups(['DailyProduction_Collection', 'DailyProduction_Get', 'Schedule_Collection', 'Schedule_Get'])]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[UniqueDate(field: 'weeklySchedule')]
    #[DateInRangeOfEntityAttributes(targetEntity: 'weeklySchedule', startAtField: 'startAt', endAtField: 'endAt')]
    private ?\DateTimeInterface $day = null;

    #[Groups(['DailyProduction_Collection', 'DailyProduction_Get', 'Schedule_Collection', 'Schedule_Get'])]
    #[ORM\OneToMany(mappedBy: 'dailyProduction', targetEntity: DailyProductionQuantity::class, orphanRemoval: true)]
    private Collection $dailyProductionQuantities;

    public function __construct() {
        $this->dailyProductionQuantities = new ArrayCollection();
    }

    public function getId(): ?Ulid {
        return $this->id;
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

    /**
     * @return Collection<int, DailyProductionQuantity>
     */
    public function getDailyProductionQuantities(): Collection {
        return $this->dailyProductionQuantities;
    }

    public function addDailyProductionQuantity(DailyProductionQuantity $dailyProductionQuantity): self {
        if (!$this->dailyProductionQuantities->contains($dailyProductionQuantity)) {
            $this->dailyProductionQuantities->add($dailyProductionQuantity);
            $dailyProductionQuantity->setDailyProduction($this);
        }

        return $this;
    }

    public function removeDailyProductionQuantity(DailyProductionQuantity $dailyProductionQuantity): self {
        if ($this->dailyProductionQuantities->removeElement($dailyProductionQuantity)) {
            // set the owning side to null (unless already changed)
            if ($dailyProductionQuantity->getDailyProduction() === $this) {
                $dailyProductionQuantity->setDailyProduction(null);
            }
        }

        return $this;
    }
}
