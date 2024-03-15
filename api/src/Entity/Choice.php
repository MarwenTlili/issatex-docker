<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\ChoiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: ChoiceRepository::class)]
#[ApiResource]
#[GetCollection(normalizationContext: ['groups' => ['Choice_Collection']])]
#[Get(normalizationContext: ['groups' => ['Choice_Get']])]
#[Post()]
#[Put()]
#[Delete()]
class Choice {
    #[Groups(['Choice_Get', 'Choice_Collection', 'Quantity_Collection', 'DailyProduction_Get'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[Groups(['Choice_Get', 'Choice_Collection', 'Quantity_Collection', 'DailyProduction_Get'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'choice', targetEntity: DailyProductionQuantity::class, orphanRemoval: true)]
    private Collection $dailyProductionQuantities;

    public function __construct() {
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
     * @return Collection<int, DailyProductionQuantity>
     */
    public function getDailyProductionQuantities(): Collection {
        return $this->dailyProductionQuantities;
    }

    public function addDailyProductionQuantity(DailyProductionQuantity $dailyProductionQuantity): self {
        if (!$this->dailyProductionQuantities->contains($dailyProductionQuantity)) {
            $this->dailyProductionQuantities->add($dailyProductionQuantity);
            $dailyProductionQuantity->setChoice($this);
        }

        return $this;
    }

    public function removeDailyProductionQuantity(DailyProductionQuantity $dailyProductionQuantity): self {
        if ($this->dailyProductionQuantities->removeElement($dailyProductionQuantity)) {
            // set the owning side to null (unless already changed)
            if ($dailyProductionQuantity->getChoice() === $this) {
                $dailyProductionQuantity->setChoice(null);
            }
        }

        return $this;
    }
}
