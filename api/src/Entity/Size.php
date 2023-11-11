<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SizeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;

#[ORM\Entity(repositoryClass: SizeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['size:read']],
    denormalizationContext: ['groups' => ['size:write']]
)]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'exact'])]
class Size {
    #[Groups(['size:read'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[Groups(['size:read'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'size', targetEntity: ManufacturingOrderSize::class, orphanRemoval: true)]
    private Collection $manufacturingOrderSizes;

    public function __construct() {
        $this->manufacturingOrderSizes = new ArrayCollection();
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
}
