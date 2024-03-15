<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SizeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SizeRepository::class)]
#[ApiResource]
#[GetCollection(normalizationContext: ['groups' => ['Size_Collection']])]
#[Get(normalizationContext: ['groups' => ['Size_Get']])]
#[Post()]
#[Put()]
#[Delete()]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'exact'])]
class Size {
    #[Groups(['Size_Get', 'Size_Collection', 'Quantity_Collection', 'DailyProduction_Get'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[Groups(['Size_Get', 'Size_Collection', 'Schedule_Collection', 'Quantity_Collection', 'DailyProduction_Get'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'size', targetEntity: ManufacturingOrderSize::class, orphanRemoval: true)]
    private Collection $manufacturingOrderSizes;

    #[ORM\OneToMany(mappedBy: 'size', targetEntity: DailyProductionQuantity::class, orphanRemoval: true)]
    private Collection $dailyProductionQuantities;

    public function __construct() {
        $this->manufacturingOrderSizes = new ArrayCollection();
        $this->dailyProductionQuantities = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, ManufacturingOrderSize>
     */
    public function getManufacturingOrderSizes(): Collection {
        return $this->manufacturingOrderSizes;
    }

    public function addManufacturingOrderSize(ManufacturingOrderSize $manufacturingOrderSize): self {
        if (!$this->manufacturingOrderSizes->contains($manufacturingOrderSize)) {
            $this->manufacturingOrderSizes->add($manufacturingOrderSize);
            $manufacturingOrderSize->setSize($this);
        }

        return $this;
    }

    public function removeManufacturingOrderSize(ManufacturingOrderSize $manufacturingOrderSize): self {
        if ($this->manufacturingOrderSizes->removeElement($manufacturingOrderSize)) {
            // set the owning side to null (unless already changed)
            if ($manufacturingOrderSize->getSize() === $this) {
                $manufacturingOrderSize->setSize(null);
            }
        }

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
            $dailyProductionQuantity->setSize($this);
        }

        return $this;
    }

    public function removeDailyProductionQuantity(DailyProductionQuantity $dailyProductionQuantity): self {
        if ($this->dailyProductionQuantities->removeElement($dailyProductionQuantity)) {
            // set the owning side to null (unless already changed)
            if ($dailyProductionQuantity->getSize() === $this) {
                $dailyProductionQuantity->setSize(null);
            }
        }

        return $this;
    }
}
