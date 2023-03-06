<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProductionDateRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: ProductionDateRepository::class)]
#[ApiResource]
class ProductionDate
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $dayAt = null;

    #[ORM\OneToMany(mappedBy: 'productionDate', targetEntity: DailyProduction::class, orphanRemoval: true)]
    private Collection $dailyProductions;

    public function __construct()
    {
        $this->dailyProductions = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getDayAt(): ?\DateTimeImmutable
    {
        return $this->dayAt;
    }

    public function setDayAt(\DateTimeImmutable $dayAt): self
    {
        $this->dayAt = $dayAt;

        return $this;
    }

    /**
     * @return Collection<int, DailyProduction>
     */
    public function getDailyProductions(): Collection
    {
        return $this->dailyProductions;
    }

    public function addDailyProduction(DailyProduction $dailyProduction): self
    {
        if (!$this->dailyProductions->contains($dailyProduction)) {
            $this->dailyProductions->add($dailyProduction);
            $dailyProduction->setProductionDate($this);
        }

        return $this;
    }

    public function removeDailyProduction(DailyProduction $dailyProduction): self
    {
        if ($this->dailyProductions->removeElement($dailyProduction)) {
            // set the owning side to null (unless already changed)
            if ($dailyProduction->getProductionDate() === $this) {
                $dailyProduction->setProductionDate(null);
            }
        }

        return $this;
    }
}
