<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PaletteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: PaletteRepository::class)]
#[ApiResource]
class Palette
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $articlesTotalQuantity = null;

    #[ORM\ManyToOne(inversedBy: 'palettes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ManufacturingOrder $manufacturingOrder = null;

    #[ORM\ManyToOne(inversedBy: 'palettes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $client = null;

    #[ORM\OneToMany(mappedBy: 'palette', targetEntity: Package::class, orphanRemoval: true)]
    private Collection $packages;

    public function __construct()
    {
        $this->packages = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getArticlesTotalQuantity(): ?int
    {
        return $this->articlesTotalQuantity;
    }

    public function setArticlesTotalQuantity(?int $articlesTotalQuantity): self
    {
        $this->articlesTotalQuantity = $articlesTotalQuantity;

        return $this;
    }

    public function getManufacturingOrder(): ?ManufacturingOrder
    {
        return $this->manufacturingOrder;
    }

    public function setManufacturingOrder(?ManufacturingOrder $manufacturingOrder): self
    {
        $this->manufacturingOrder = $manufacturingOrder;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return Collection<int, Package>
     */
    public function getPackages(): Collection
    {
        return $this->packages;
    }

    public function addPackage(Package $package): self
    {
        if (!$this->packages->contains($package)) {
            $this->packages->add($package);
            $package->setPalette($this);
        }

        return $this;
    }

    public function removePackage(Package $package): self
    {
        if ($this->packages->removeElement($package)) {
            // set the owning side to null (unless already changed)
            if ($package->getPalette() === $this) {
                $package->setPalette(null);
            }
        }

        return $this;
    }
}
